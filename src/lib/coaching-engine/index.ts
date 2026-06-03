export { assembleFromResolvedSlot, assembleScheduledWorkout } from './assemble';
export type { AssembleContext, TemplateUsage } from './assemble';
export { applyTemplateProgression } from './progression';
export {
  selectWorkoutTemplate,
  TEMPLATE_REPEAT_WINDOW_DAYS,
  wasTemplateUsedWithinDays,
} from './select-template';
export type { TemplateSelectContext } from './select-template';
export {
  resolveSlot,
  strengthLowerVariant,
  type ResolvedSlot,
  type SlotResolveContext,
} from './slot-resolve';
export {
  applyHyroxSimulationExposure,
  buildRacePrepSimulationPool,
  isHyroxRacePrepGoal,
  PREFERRED_SIMULATION_TEMPLATE_IDS,
  preferRacePrepSimulationCandidates,
  shouldScheduleSimulationWeek,
  simulationTemplateBonus,
} from './hyrox-simulation-exposure';
export {
  buildFatigueHistoryEntry,
  classifySessionLoadTags,
  estimateSessionFatigue,
  FATIGUE_WINDOW_MAX,
  FATIGUE_WINDOW_DAYS,
  isPlannedLowerBodyDominant,
  resolveFatigueSafeSessionForDate,
  rollingWindowFatigueTotal,
  shouldProtectFromConsecutiveLowerLoad,
  type FatigueHistoryEntry,
  type SessionLoadTag,
} from './fatigue-management';
export {
  beginnerRunnerMaxDurationMinutes,
  beginnerRunnerRunVariant,
  filterBeginnerRunningCandidates,
  isBeginnerRunner,
} from './beginner-runner-protection';
export {
  ensureRecoverySlotInTemplate,
  isProactiveRecoveryWeek,
  PREFERRED_RECOVERY_TEMPLATE_IDS,
  preferProactiveRecoveryCandidates,
  recoveryTemplateBonus,
  shouldScheduleRecoveryWeek,
} from './recovery-insertion';
export {
  applyUpperBodyMinimum,
  daysSinceLastUpperBody,
  isUpperBodyResolvedSlot,
  UPPER_BODY_INTERVAL_DAYS,
  UPPER_BODY_STEER_DAYS,
} from './upper-body-minimum';
export {
  countStationWeaknessSlots,
  createStationFocusWeekState,
  createWeaknessExposureState,
  isStationWeaknessSlot,
  maxWeaknessExposurePerWeek,
  pickStationTargetWeakness,
  recordStationFocusForWeek,
  recordWeaknessExposure,
  stationWeaknessCandidates,
  type StationFocusWeekState,
  weaknessToStationVariant,
} from './weakness-balancing';
