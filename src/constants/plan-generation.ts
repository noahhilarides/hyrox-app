/**
 * Plan calendar shape — separate from workout library content.
 */

/** Standard race / hybrid plans target an 8–12 week mesocycle. */
export const PLAN_WEEKS_MIN = 8;
export const PLAN_WEEKS_MAX = 12;
export const PLAN_WEEKS_DEFAULT = 12;

/** When race is sooner than min weeks, still produce a plan (floor). */
export const PLAN_WEEKS_ABSOLUTE_MIN = 4;
