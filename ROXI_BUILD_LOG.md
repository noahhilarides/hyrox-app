# Rox — Build Log

Complete summary of what has been built and changed in this project. Product name: **Rox** (repo: `hyrox-app`; Expo display name currently `HYROX Train`).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | **React Native** via **Expo SDK 56** |
| Language | **TypeScript** |
| Routing | **expo-router** (file-based, typed routes) |
| State | **Zustand** (onboarding draft) + React context (`app-context`) for plan/completions |
| Storage | **@react-native-async-storage/async-storage** |
| Dates | **date-fns** v4 |
| UI | Custom design tokens, dark theme, Reanimated, gesture handler, safe area |
| Native | iOS/Android via `expo run:ios` / `expo run:android` (prebuild) |
| Tests | Node `tsx --test` for coaching engine and plan logic |

---

## App structure (built)

### Onboarding flow
Multi-step flow: goal → race selection → running/strength level → equipment → availability → weaknesses → interests → plan start → summary. Profile mapped into `OnboardingProfile` and persisted; plan generated via `generateTrainingPlan`.

### Main tabs
- **Today** — featured workout, week overview, plan insights, feed modules
- **Plan** — calendar / weekly structure
- **Activities** — completed session list and stat placeholders (partial)
- **Community** — shell / placeholder

### Other screens
- **Workout session** (`/workout/[date]`) — scheduled workout detail, completion, exercise list
- **Workout library** — browse templates by category; detail with coaching sections
- **Profile** — athlete settings and race info

### Coaching engine (`src/lib/coaching-engine/`)
End-to-end plan assembly: weekly template → slot resolve (category/variant) → template selection → week progression → fatigue management → assemble scheduled `Workout` with library template + blocks.

Supporting modules: strength assignment, upper-body minimum, beginner runner protection, weakness balancing (station focus), HYROX simulation exposure, recovery insertion (template pool only — not scheduled as training days), select-template scoring and repeat rules.

### Workout library
- **91 legacy workouts** across 7 category files (see below)
- **Generator templates** (`generator-templates.ts`) for scalable run/strength/hyrox variants
- **Tags**, **coaching metadata** (RPE guidance, progression notes, station cues, substitutions)
- **Legacy convert** — `mainSet` lines → stacked exercise blocks

---

## Workout library rewrite (7 files)

All `mainSet`, `warmup`, and `cooldown` fields in these files were reformatted to **real Hyrox-oriented content** with strict display rules:

| File | Workouts | Focus |
|------|----------|--------|
| `strength.ts` | 15 (STR-001–015) | Lower/upper/full-body, sled, goblet foundation |
| `aerobic.ts` | 15 (AER-001–015) | Easy/long/tempo/mixed aerobic runs |
| `hybrid.ts` | 20 (HYB-001–020) | Run + station circuits, race-density hybrids |
| `speed.ts` | 10 (SPD-001–010) | Intervals, strides, race-pace repeats |
| `skills.ts` | 15 (SKL-001–015) | Ski, sled, wall ball, burpee station prep |
| `engine.ts` | 10 (ENG-001–010) | Metcon engine, full race simulation (ENG-008) |
| `recovery.ts` | 6 (RCV-001–006) | Mobility, flush sessions (library only) |

### mainSet format rules (applied everywhere)
- **One exercise or effort per line** — no bullets, RPE, rest periods, block labels, or coach notes inside `mainSet`
- **Strength:** `Bench Press 4x8`, `Farmer Carry 4x45m`
- **Runs:** `2 miles easy pace`, `6 x 400m at race pace`, `5 x 1000m at race pace`
- **Hyrox / hybrid / engine:** `400m run`, `1000m SkiErg`, `50m Sled Push`, `20 Wall Balls`, etc.
- **Recovery:** mobility lines e.g. `Hip flexor stretch 60 sec each side`
- **warmup / cooldown:** single short summary line each

### Display pipeline
- `src/lib/workout-library/legacy-convert.ts` — each `mainSet` line becomes `{ name: '', detail: line }`; warm-up/cool-down keep labels
- `src/components/workout/workout-exercise-list.tsx` — empty `name` renders only `detail` as a clean stacked line (numbered list)
- Used on workout session screen and library detail screen

---

## Global races (onboarding)

- **`src/data/onboarding/races.ts`** — **61 global HYROX events** with real **dates**, cities, venues, and metadata for plan length / countdown
- **`src/app/(onboarding)/race.tsx`** — race screen **redesigned**:
  - **Vertical list** (`FlatList`) with `RaceEventCard` rows
  - **Search** (city, name, location)
  - **Region filters:** All, North America, Europe, Asia Pacific, Middle East (inferred from location text)
  - Upcoming races prioritized; optional previous-race time capture
- Supporting: `race-countdown.ts`, `race-location-display.ts`, `hyrox-race-time.ts`

---

## Plan generation & coaching changes

### Recovery sessions removed from all plans
- `refinedPrescription` in `recovery-prescription.ts` always returns **`'never'`** for proactive recovery weeks
- `applyRecoveryToTemplate` maps any **`recovery` slot → `skills`**
- `fatigue-management.ts` — recovery removed from swap targets; easy run used as fallback
- Generated plans should contain **zero `type: 'recovery'`** sessions (RCV templates remain in library for manual/browse use)

### Weekly templates fixed (`weekly-template.ts`)
- Goal-specific structures: HYROX race prep, endurance, strength, return-to-fitness, performance
- **Beginner** 5-day: `strength, run, skills, hyrox, run`
- **Beginner** 6-day: `strength, run, skills, hyrox, run, strength`
- **Intermediate** 5-day: `strength, run, speed, hyrox, skills`
- **Advanced** 6-day: includes `race_sim` in peak/taper sixth slot
- Recovery never appears as a training day type after template application

### Upper / lower strength alternation fixed (`strength-assignment.ts`)
- **Even plan weeks (0, 2, 4…):** first strength slot → **upper**; second → lower
- **Odd weeks:** first → **lower**; second → **upper**
- `applyStrengthIndexForWeek` wired in `plan-generator.ts` with `strengthOccurrenceInWeek`
- **`applyConsecutiveLowerBodyGuard`** — does not override a **planned lower** slot (preserves odd-week lower days)
- **`applyUpperBodyMinimum`** — early return when planned strength is already a **lower** slot (`!strengthSlotIsUpper`) so lower weeks are not steered to upper

### Beginner plan structure corrected
- Dedicated weekly templates for beginner athletes (see above)
- **`beginner-runner-protection.ts`** — caps run duration by week, blocks advanced/long/speed templates early, prefers easy and walk-run templates weeks 1–4
- Beginner hybrid/strength paths avoid race-density templates until progression allows

### Workout titles cleaned up
- Aerobic names stripped of embedded duration minutes (e.g. `Easy Run 45` → `Easy Run`)
- Generator naming aligned (e.g. walk-run builder → `Aerobic Builder`)
- Scheduled workout titles come from library template `name` + assembly, not raw `mainSet` prose

### Same-weekday template rotation (`select-template.ts`)
- **`wasTemplateUsedOnSameWeekdayPreviousWeek`** — blocks reusing the same template on the same weekday as 7–13 days ago
- Applied via **`excludeSameWeekdayRepeats`** before the existing 14-day repeat window

### Fatigue & swaps
- High-fatigue swaps prefer easy run / skills / reduced hybrid — not recovery sessions
- Integration tests updated for recovery removal and easy-run fallbacks

---

## UI & components (high level)

- Design system: `constants/tokens.ts` (palette, spacing, radius)
- Onboarding: containers, chips, continue button, plan summary hero, race event cards
- Calendar: month grid, week strip, day cells, sheet
- Workout: type badge, focus chips, exercise list, hero cards
- Today tab: featured workout, week overview, feed cards, plan insights

---

## Testing

Coaching engine test suites under `src/lib/coaching-engine/*.test.ts` plus `workout-scoring`, `week-phase`.

**Known issue:** `date-fns` `format()` throws under **Node 25** in this environment (`Cannot read properties of undefined (reading 'y')`); `formatISO` works. Several integration tests that call `generateTrainingPlan` fail until date formatting is patched or Node/date-fns alignment is fixed.

---

## What still needs to be done

1. **Verify workout display looks clean** — confirm stacked main-set lines on device/simulator for strength, run, and hyrox sessions; tune typography/spacing if needed
2. **Plan generation consistency** — fix date-fns formatting in plan generator; re-run full `npm test`; validate odd-week lower / even-week upper across 6-day plans end-to-end
3. **Activities screen** — flesh out weekly summary, avg pace, total time, and richer history (currently placeholders and basic completed list)
4. **UI polish** — community tab, empty states, loading states, haptics, final pass on onboarding and today/plan screens
5. **Paywall setup** — subscription product, entitlement gating, restore purchases (not started)
6. **App Store submission** — production app name/branding (Rox), screenshots, privacy policy, TestFlight, review assets, bundle IDs aligned with marketing name

---

## Quick reference paths

| Area | Path |
|------|------|
| Plan generator | `src/lib/plan-generator.ts` |
| Weekly templates | `src/lib/weekly-template.ts` |
| Legacy workouts | `src/data/workout-library/{strength,aerobic,hybrid,speed,skills,engine,recovery}.ts` |
| Library build | `src/data/workout-library/build-library.ts` |
| Legacy → blocks | `src/lib/workout-library/legacy-convert.ts` |
| Session UI | `src/app/workout/[date].tsx`, `src/components/workout/workout-exercise-list.tsx` |
| Races | `src/data/onboarding/races.ts`, `src/app/(onboarding)/race.tsx` |
| Strength logic | `src/lib/coaching-engine/strength-assignment.ts` |

---

*Last updated: build session covering workout library reformat, coaching engine fixes, race onboarding, and recovery removal from generated plans.*

---

## June 2026 — Phase 2 + Goal Consolidation + performance_training Removal

### Generator (v2) — now complete across the board
- All 12 weekly structures built and verified: beginner/intermediate/advanced × 3/4/5/6-day (elite folds into advanced upstream).
- All levels/day-counts route to v2 via `v2SupportsProfile` (any 3–6 day profile).
- Long runways: `PLAN_WEEKS_MAX` raised to 36; extra weeks pool into base (verified 32-week beginner = base16/build10/peak4/taper2).
- `scaleMovement` fixed: reps round to nearest 5, ergs (ski/row) to nearest 50m, sled stays fixed at base (progressed by load not distance — real coaching), farmers carry capped at 200m (race distance). Numbers now clean and coach-real; they scale UP from each piece's base instead of overwriting it.
- Ultra conditioning pieces added (were falling back to a weak placeholder).
- 3-day beginner made run-heavier (run_speed in middle slot) since limited days need compromised-running value.

### Two goals (consolidated from six)
- Onboarding now shows only **HYROX Race Prep** (`hyrox_race`) and **Hybrid Training** (`hybrid_fitness`).
- Race mode: base→build→peak→taper toward race date. Rolling mode (no race date): base→build sustained, never peaks/tapers.
- Wired via `weekPhase(…, mode)` + `mode` threaded through `generate-plan.ts` and `to-training-plan.ts` (computed from `profile.raceDate`).
- Strength progression is independent of mode — hybrid lifts still climb week to week.
- Onboarding session-duration question removed (plan shows an estimated time; user no longer picks). `preferredSessionMinutes` defaults to 45 so downstream code is safe.

### performance_training fully removed
- Goal value, `performance-training/` module, and `constants/performance-training.ts` deleted.
- All `isPerformanceTrainingGoal` branches removed across plan-generator, coaching-engine, plan-progression, weekly-template — they fall through to default.
- 2 obsolete tests retired (asserted old-generator template IDs / race_sim cadence on profiles that now route to v2).

### State at end of session
- `npx tsc --noEmit` → exit 0
- Tests: 57 pass / 0 fail / 1 skipped (documented)
- v2 generator verified rendering correctly in the app (sections, run/walk, clean numbers, HYROX labels).

### Open items / next session
- 3 vestigial goals (`endurance`, `strength`, `return_to_fitness`) still in the `Goal` type and route to the old engine, but are UNSELECTABLE in onboarding → harmless. Trim anytime.
- Old coaching-engine still present (used only by those 3 dead goals + as v2's entry router in plan-generator). Full deletion deferred.
- v2 has NO race-sim concept — race-prep plans don't rehearse the full 8-station event. Real future feature for serious racers.
- Session durations are rough estimates, not tied to actual volume.
- Add load/weight prescriptions to lifts/sled/carry (needs a real coach).
- Pre-existing strength-assignment test still skipped/failing (title regex doesn't count "Sled Pull Strength" as lower) — unrelated to this work.
- NON-GENERATOR launch work still pending: Activities screen, paywall/subscription, App Store submission (branding, screenshots, privacy policy, TestFlight, bundle IDs).

## Session: Onboarding cleanup + Equipment substitution layer

### COMPLETED & VERIFIED
- Race screen: removed "have you raced before" question; isComplete = race selection only
- Weaknesses: cut Recovery + Pacing; added Sled Pull + Wall Balls (now: running_endurance, ski_erg, sled_push, sled_pull, burpees, grip_fatigue, wall_balls, lunges, rowing) — type/mapper/summary updated
- Removed interests/add-ons step from onboarding flow (files kept, step removed; summary hides empty tags)
- Equipment options trimmed to 3 selectable: full_gym (Commercial), dumbbells_only (renamed "Dumbbells / Kettlebells"), hyrox_gym (CrossFit). Removed home_gym + bodyweight_only from options; types preserved.
- BUILT equipment substitution layer (src/lib/generator-v2/equipment-substitution.ts):
  - applyEquipmentSubstitutions(session, equipment) runs as final pass; gym tiers untouched; only dumbbells_only swaps
  - Threaded equipment: GeneratePlanV2Input → generate-plan.ts → preview script (5th CLI arg)
  - Name swaps: Back Squat→Goblet Squat, Bench→DB Bench Press, Deadlift→DB Romanian Deadlift, Wall Balls→DB Thrusters, SkiErg→Banded Pulldown, Row→DB Bent-over Row, Sled Push→DB Walking Lunges, Sled Pull→See-Saw Rows, Farmers Carry→DB Farmers Carry, Sandbag Lunges→DB Walking Lunges
  - Prescription swaps: erg/sled meters→"20 reps" (See-Saw "20 reps (10/side)"); "max meters"→"max reps"; DB Farmers Carry keeps distance
  - De-dupe: same-movement collisions in a block merge to one at 1.5x reps (two 20→30); "Walking Lunges" & "DB Walking Lunges" treated as same
  - VERIFIED: dumbbell swaps fire; full_gym fully untouched; tsc exit 0
- Committed + pushed to GitHub

### NEXT STEPS (in order)
1. Wire WEAKNESSES into generator — picking a weak station biases volume toward it (real generator change; currently display-only, applies to race + hybrid modes)
2. BUG: start-date card overlap ("Plan begins" text colliding with Next Monday/In one week cards)
3. BUG: clipped card text on weakness/multi-select grids + grid spacing pass
4. Activities screen (placeholders → real) — biggest UI gap
5. Profile polish
6. Community tab — build or hide "coming soon" for v1
7. Launch prep: app icon, screenshots, privacy policy, $99 Apple account, App Store submission (free, no paywall, gather Reddit feedback)

### PARKED
- Decouple strength/running levels (mixed-ability). Verified strength schemes barely differ by level (effort-cue based) → low priority.

### KEY FACTS
- Preview: npx tsx scripts/preview-plan-v2.ts <level> <days> <running> <equipment>
- v2 generator reads: level, days, runningExperience, raceDate, mode. Now also equipment (via final pass). Still does NOT read weaknesses or interests.
- Reddit: posted in r/hyrox asking about tailored plan apps (market signal test)

## Session continued: Weaknesses wired into generator (DONE)

COMPLETED & VERIFIED
- Weaknesses now affect the v2 plan (previously display-only). Two mechanisms, both fire only when user picks a weakness; empty weakStations = original plan untouched.
- New file src/lib/generator-v2/weakness-stations.ts: onboardingWeaknessesToStations maps onboarding weaknesses to HyroxStation tags (running_endurance/recovery/pacing skipped; deduped).
- Threaded weakStations: profile.onboardingWeaknesses (new field on OnboardingProfile, set in draftToOnboardingProfile from draft.weaknesses to preserve station-level picks past the lossy legacy Weakness type) -> to-training-plan.ts -> generatePlanV2 -> composeSession -> pickers + scaleMovement.
- Selection bias: pickConditioningPiece + pickStrengthHyroxPiece favor weak-station pieces on even weeks, normal rotation odd weeks (balanced, all stations still appear).
- Volume bump: scaleMovement applies 1.35x to a weak station's already-progressed prescription. Reps round to nearest 5; meters round to nearest 25 (so 50m sled -> 75m; nearest-50 was erasing the bump). Farmers carry still capped 200m. Sled push/pull DO get bumped for weakness even though normal progression leaves them flat. max reps/meters skipped.
- VERIFIED: sled-weak -> 75m sled; wall-ball-weak -> 55 reps; no-weakness plan unchanged at 50m. tsc exit 0.
- Preview now: npx tsx scripts/preview-plan-v2.ts <level> <days> <running> <equipment> <weaknesses-comma-separated>

NEXT STEPS (in order)
1. BUG: start-date card overlap ("Plan begins" text colliding with Next Monday/In one week cards)
2. BUG: clipped card text on weakness/multi-select grids + grid spacing pass
3. Activities screen (placeholders -> real) — biggest UI gap
4. Profile polish
5. Community tab — build or hide for v1
6. Launch prep: icon, screenshots, privacy policy, $99 Apple account, submission (free, no paywall)

PARKED
- Decouple strength/running level

## Session continued: UI bug fixes + dash voice pass (partial)

COMPLETED & VERIFIED
- Workout detail screen polished: removed "upper" focus pill, moved intensity indicator left (no nav-gear collision), grounded the coach note (removed glow, fixed doubled margins, more solid bg), removed "base phase" from subtitle (kept duration), fixed bottom cutoff (scroll paddingBottom 180->240), closed dead gap between coach note and exercises (sectionFade xl->md).
- Start-date screen (plan-start.tsx): removed redundant "Plan begins..." hint block + unused styles/imports (was overlapping cards). Cards already show dates.
- PAST-WORKOUTS BUG FIXED: generate-plan.ts skipped phantom pre-start sessions. Week 1 was snapping to Monday of start week (startOfWeek weekStartsOn:1), showing sessions before actual start. Now: startDateStr computed once, "if (date < startDateStr) continue" skips them. Verified: Thursday start -> week 1 begins Thursday, no pre-start days. (Note: mid-week start = fewer week-1 sessions, which is correct.)
- Equipment options trimmed earlier; substitution layer + weakness biasing done earlier this session (see prior entry).
- DASH VOICE PASS (PARTIAL - removing em-dashes that read as AI): DONE in abilities.ts, equipment-access.ts, runs.ts (notes), conditioning.ts (prescriptionNotes), compose-session.ts (5 coach notes), strength-progression.ts (4 effortCues, kept structural template dash on compose-session line 140).

NEXT STEP (do FIRST in new chat): FINISH THE DASH SWEEP. Remaining user-facing em-dashes to clean (replace with period/comma, keep wording):
- src/components/today/today-featured-workout.tsx:34 (rest day card "No session today — absorb...")
- src/app/(tabs)/plan.tsx:117 (subtitle "Built from your onboarding —...")
- src/app/(onboarding)/strength-level.tsx:25, running-level.tsx:25, equipment.tsx:26 (subtitles)
- src/app/workout/[date].tsx:105 ("Completed — nice work")
- src/constants/coaching-philosophy.ts:60
- src/constants/workout-substitution-guidance.ts (lines 5,19,21,25)
- src/constants/hyrox-station-cues.ts (many lines ~17-67 - all user-facing coaching cues)
- src/lib/plan-personalization.ts (lines 116,119,127,146,148 - phase labels/messages)
DO NOT touch: empty-data placeholders showing "—" (activities.tsx:33-34, plan.tsx:76, workout-library/[id].tsx:60), interests.tsx (removed/unreachable), placeholder-screen.tsx, structural string-builders (to-training-plan.ts:33, apply-to-template.ts:137). Keep rep ranges (10-12 etc).
After sweep, run final check: grep -rn "—" src/ --include="*.tsx" --include="*.ts" to confirm only structural/placeholder dashes remain.

THEN: BIG SCREEN BUILDS (real builds, not polish): Today, Plan, Activities (biggest gap, placeholders), Profile (basic sheet, needs real build), Community (build or hide for v1). Decide v1 scope per screen before building.

ALSO PENDING (polish/content):
- Richer coach notes (vary by type/phase/level - currently bland, central to "coach-written" feel)
- Beginner set-splitting guidance (e.g. "50 reps, break into sets")
- Onboarding summary/plan screen needs improvement
- Clipped grid card text RESOLVED (was the removed Recovery weakness)

PARKED: decouple strength/running levels (mixed-ability; strength schemes barely differ by level anyway)
LAUNCH: icon, screenshots, privacy policy, $99 Apple account, submission (free, no paywall, Reddit feedback first)
REDDIT: posted in r/hyrox asking about tailored plan apps (market signal test)

## Session continued: bug fixes, screen polish, dash pass (partial), next-up plan

COMPLETED & VERIFIED THIS SESSION
- Workout detail screen polished (removed "upper" pill, intensity moved left, grounded coach note, removed "base phase" kept duration, fixed bottom cutoff scroll paddingBottom 180->240, closed dead gap).
- Start-date screen: removed redundant "Plan begins" hint (overlap gone).
- PAST-WORKOUTS BUG FIXED (generate-plan.ts): skips sessions before startDate ("if (date < startDateStr) continue"). Was snapping week 1 to Monday of start week, showing phantom pre-start days. Verified.
- DASH VOICE PASS (PARTIAL): cleaned user-facing em-dashes in abilities.ts, equipment-access.ts, runs.ts, conditioning.ts, compose-session.ts (coach notes), strength-progression.ts (effortCues), today-featured-workout.tsx, plan.tsx subtitle, onboarding subtitles (strength/running/equipment-level), workout/[date].tsx, coaching-philosophy.ts, workout-substitution-guidance.ts, hyrox-station-cues.ts, plan-personalization.ts. All committed + pushed.

NEXT SESSION - START HERE:

1. FINISH DASH SWEEP (do first, but smartly): Remaining em-dashes are almost ALL in workout-library content: generator-templates.ts, coaching-metadata/overrides.ts + rpe.ts + resolve.ts, coaching-engine/assemble.ts, plan-generator.ts, data/workout-library/*.ts (engine/hybrid/speed/skills/aerobic/strength/recovery), data/today/feed-modules.ts. STEP ONE: determine which of these v2 actually RENDERS vs dead old-engine code (v2 generator is src/lib/generator-v2/ and does NOT use the old workout-library templates for plan generation). Only clean dashes in files that are actually shown to users. Don't waste effort on dead code. Keep "—" empty-data placeholders, en-dashes in ranges (6-7, 30-40%), and code comments.

2. BIG SCREEN BUILDS (real builds - the bulk of remaining work). Reference: Runna's onboarding/reveal flow (Noah likes it). 
   a. POST-GENERATE REVEAL FLOW (high value, Noah specifically wants this) - emulate Runna's sequence after "Generate my plan":
      - Loading screen: "Building your plan" + animation + progress bar (2-4 sec, makes plan feel crafted)
      - Reveal screen: "Welcome Noah, your plan is ready" + plan/race badge (celebratory payoff)
      - Then drop into Today screen
      (Runna does more: welcome details, estimated race times, "meet your coaching team", "types of run" guide, top tips. Decide how much to emulate for v1 - loading + reveal are the must-haves.)
   b. Today screen - build out (currently shows "0/0 sessions"/rest day when starting mid-week; check it doesn't feel empty for new users)
   c. Plan screen - build out
   d. Activities screen - build (biggest gap, currently placeholders)
   e. Profile screen - build (currently basic sheet, needs real profile: stats, race info, settings, connections)
   f. Community screen - build or hide "coming soon" for v1
   Decide v1 scope per screen before building (cut what's not needed for launch to hit competitor timing).

3. POLISH/CONTENT (lower priority):
   - Richer coach notes (vary by type/phase/level - currently bland; central to "coach-written" differentiator)
   - Beginner set-splitting guidance (e.g. "50 reps, break into sets as needed")
   - Onboarding summary/plan screen improvement

PARKED: decouple strength/running levels (mixed-ability; strength schemes barely differ by level anyway - low priority)

LAUNCH: app icon, screenshots, privacy policy, $99 Apple Developer account, App Store submission. Free, no paywall, gather Reddit feedback first.

REDDIT: posted in r/hyrox asking about tailored training plan apps (market signal test - check for replies).

KEY FACTS:
- Preview: npx tsx scripts/preview-plan-v2.ts <level> <days> <running> <equipment> <weaknesses-comma-separated>
- v2 generator (src/lib/generator-v2/) reads: level, days, runningExperience, raceDate, mode, equipment (substitution final pass), weaknesses (selection bias + 1.35x volume bump). Does NOT read interests/add-ons.
- Reset sim to test onboarding: npx expo start -c, then Erase All Content and Settings, re-onboard.
