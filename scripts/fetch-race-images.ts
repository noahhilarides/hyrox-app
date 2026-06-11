/**
 * One-time helper: fetch an Unsplash photo URL for each HYROX race city.
 *
 * Outputs scripts/race-images-output.json mapping race id -> image URL (or null)
 * and prints a readable summary. It does NOT modify races.ts — review the output
 * file first, then paste the URLs you want.
 *
 * Run:  npx tsx scripts/fetch-race-images.ts
 * Needs UNSPLASH_ACCESS_KEY (from .env or the environment).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { HYROX_RACE_EVENTS } from '../src/data/onboarding/races';

const OUTPUT_PATH = resolve(__dirname, 'race-images-output.json');
const REQUEST_DELAY_MS = 1200; // Unsplash demo tier ~50 req/hour — be gentle.

/** Read UNSPLASH_ACCESS_KEY from the environment, falling back to a manual .env parse. */
function resolveAccessKey(): string | null {
  if (process.env.UNSPLASH_ACCESS_KEY) return process.env.UNSPLASH_ACCESS_KEY;

  try {
    const envPath = resolve(__dirname, '..', '.env');
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (key !== 'UNSPLASH_ACCESS_KEY') continue;
      let value = trimmed.slice(eq + 1).trim();
      // Strip surrounding quotes if present.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return value || null;
    }
  } catch {
    // No .env file — fall through to null.
  }
  return null;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Sentinel thrown when Unsplash returns a 403 rate-limit so we can stop gracefully. */
class RateLimitError extends Error {}

/**
 * Returns the first landscape photo URL for a query, or null if none.
 * Throws RateLimitError on a 403 so the caller can stop and resume later.
 */
async function searchUnsplash(query: string, accessKey: string): Promise<string | null> {
  const url =
    'https://api.unsplash.com/search/photos' +
    `?query=${encodeURIComponent(query)}` +
    '&per_page=1&orientation=landscape';

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    throw new RateLimitError(
      `Unsplash returned 403 (rate limited). x-ratelimit-remaining=${remaining ?? 'unknown'}.`
    );
  }

  if (!res.ok) {
    console.warn(`  ! HTTP ${res.status} for query "${query}" — treating as no result.`);
    return null;
  }

  const data = (await res.json()) as { results?: { urls?: { regular?: string } }[] };
  const first = data.results?.[0];
  return first?.urls?.regular ?? null;
}

/** Tries "<city> skyline" then "<city>" as a fallback. */
async function fetchImageForCity(city: string, accessKey: string): Promise<string | null> {
  const primary = await searchUnsplash(`${city} skyline`, accessKey);
  if (primary) return primary;

  await sleep(REQUEST_DELAY_MS);
  const fallback = await searchUnsplash(city, accessKey);
  return fallback;
}

async function main(): Promise<void> {
  const accessKey = resolveAccessKey();
  if (!accessKey) {
    console.error(
      'Missing UNSPLASH_ACCESS_KEY. Add it to .env (UNSPLASH_ACCESS_KEY=your_key) or export it.'
    );
    process.exit(1);
  }

  const results: Record<string, string | null> = {};
  let stoppedEarly = false;

  console.log(`Fetching images for ${HYROX_RACE_EVENTS.length} races...\n`);

  for (let i = 0; i < HYROX_RACE_EVENTS.length; i++) {
    const race = HYROX_RACE_EVENTS[i]!;
    try {
      const imageUrl = await fetchImageForCity(race.city, accessKey);
      results[race.id] = imageUrl;
      console.log(`${race.city.padEnd(18)} → ${imageUrl ?? 'NO RESULT'}`);
    } catch (err) {
      if (err instanceof RateLimitError) {
        console.error(`\n${err.message}`);
        console.error(
          `Stopping gracefully after ${i} of ${HYROX_RACE_EVENTS.length} races. ` +
            'Partial results saved — re-run later to resume (wait for the hourly limit to reset).'
        );
        stoppedEarly = true;
        break;
      }
      console.warn(`  ! Error for ${race.city}: ${(err as Error).message} — recording null.`);
      results[race.id] = null;
    }

    if (i < HYROX_RACE_EVENTS.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2) + '\n', 'utf8');

  const fetched = Object.values(results).filter((v) => v != null).length;
  const missing = Object.values(results).filter((v) => v == null).length;
  console.log(`\n— Summary —`);
  console.log(`Resolved: ${fetched}   No result: ${missing}   Total processed: ${fetched + missing}`);
  console.log(`Output written to: ${OUTPUT_PATH}`);
  if (stoppedEarly) {
    console.log('NOTE: run stopped early due to rate limiting — re-run to fill in the rest.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
