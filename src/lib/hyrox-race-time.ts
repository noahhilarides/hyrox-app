/** Parse finish time like 1:24:30, 84:30, or 90 (minutes). Returns seconds or null. */
export function parseHyroxFinishTime(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const minutes = Number(trimmed);
    if (minutes > 0 && minutes < 600) return minutes * 60;
    return null;
  }

  const parts = trimmed.split(':').map((p) => p.trim());
  if (parts.some((p) => p === '' || !/^\d+$/.test(p))) return null;

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 2) {
    minutes = Number(parts[0]);
    seconds = Number(parts[1]);
  } else if (parts.length === 3) {
    hours = Number(parts[0]);
    minutes = Number(parts[1]);
    seconds = Number(parts[2]);
  } else {
    return null;
  }

  if (minutes > 59 || seconds > 59) return null;

  const total = hours * 3600 + minutes * 60 + seconds;
  if (total <= 0 || total > 6 * 3600) return null;
  return total;
}

/** Format seconds as H:MM:SS or M:SS when under an hour. */
export function formatHyroxFinishTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
