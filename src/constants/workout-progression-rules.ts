/**
 * Week-over-week progression rules for plan generation.
 * Kept separate from workout library definitions in `src/data/workout-library/`.
 */

/** Long aerobic runs — add duration on a 1–2 week cadence. */
export const LONG_RUN_PROGRESSION = {
  baseMinutes: 40,
  incrementMinutesMin: 5,
  incrementMinutesMax: 10,
  /** Bump every 1–2 weeks: odd weeks +min, even weeks +max (cumulative). */
  cadenceWeeks: 2,
  maxMinutes: 95,
} as const;

/** Wall ball reps in skills / hybrid / station blocks. */
export const WALL_BALL_PROGRESSION = {
  baseReps: 20,
  repsIncrement: 2,
  incrementEveryWeeks: 1,
  maxReps: 40,
} as const;

/** SkiErg — distance per interval and/or round count. */
export const SKI_ERG_PROGRESSION = {
  baseMeters: 500,
  metersIncrement: 100,
  maxMeters: 1000,
  baseRounds: 4,
  roundsIncrement: 1,
  /** Add a round every N weeks after week 0. */
  roundsIncrementEveryWeeks: 2,
  maxRounds: 8,
} as const;

/**
 * Sled work — increase sets / distance first; shift load cues later in the block.
 * Weeks 0–1 of each mesocycle = volume emphasis; weeks 2+ = intensity emphasis.
 */
export const SLED_PROGRESSION = {
  baseSets: 4,
  maxSets: 8,
  setIncrementEveryWeeks: 2,
  baseDistanceM: 50,
  distanceIncrementM: 10,
  maxDistanceM: 75,
  /** 0–1 volume, 2+ intensity within a 4-week block (unless recovery week). */
  intensityAfterBlockWeek: 2,
} as const;

/** Scheduled deload / recovery weeks — reduce training volume. */
export const RECOVERY_WEEK_RULES = {
  cycleWeeks: 4,
  volumeReductionMin: 0.3,
  volumeReductionMax: 0.4,
  /** Applied reduction target (midpoint of range). */
  volumeMultiplier: 0.65,
} as const;
