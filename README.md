# HYROX Hybrid Training

Runna-inspired hybrid training platform for HYROX athletes. React Native · Expo · TypeScript.

## Navigation

| Tab | Purpose |
|-----|---------|
| **Today** | Daily habit loop — workout hero, start CTA, streak, upcoming |
| **Plan** | Calendar, phases, weekly structure, race prep |
| **Activities** | Completed sessions, stats placeholders, history |
| **Profile** | Goals, connections, preferences (placeholders) |

Onboarding opens as a modal from **Start new plan** (not a gate before the app).

## Run

```bash
npm install
npm start
```

## Structure

```
src/
  app/
    (tabs)/            # Main app (Today, Plan, Activities, Profile)
    (onboarding)/      # Onboarding stack + placeholder screens
    workout/[date].tsx
  components/onboarding/  # Reusable onboarding UI
  data/onboarding/        # Flow config + theme tokens
  hooks/                  # useOnboardingNavigation, useOnboardingProgress
  store/                  # Zustand onboarding draft state
  types/onboarding.ts     # Onboarding types
  components/
    calendar/        # Week calendar
    layout/          # Section headers, stat pills
    plan/            # Phase banner, action cards
    today/           # Workout hero
    activities/      # Activity cards
    profile/         # Settings groups
    ui/              # Button, text, screen
  context/           # App state + persistence
  hooks/
  lib/               # Plan generator, insights, progress
  types/
  constants/
```
