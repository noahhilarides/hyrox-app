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
