/**
 * Workout library templates (Phase 2 — single source of truth).
 * Scheduled calendar workouts use `Workout` in `types/index.ts`.
 */

import type { WorkoutType } from '@/types';

export type WorkoutCategory =
  | 'running'
  | 'strength_upper'
  | 'strength_lower'
  | 'full_body_strength'
  | 'hyrox'
  | 'conditioning'
  | 'recovery';

export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutBlock {
  name: string;
  detail: string;
}

/** Library source shape — coaching fields attached in build-library.ts. */
export type WorkoutTemplateDraft = {
  id: string;
  name: string;
  category: WorkoutCategory;
  /** One-line intent for coaches and plan selection. */
  description: string;
  difficulty: WorkoutDifficulty;
  /** Target session length in minutes. */
  duration: number;
  equipment: string[];
  focus: string[];
  workoutBlocks: WorkoutBlock[];
  /** UI badge type on the calendar. */
  workoutType: WorkoutType;
  /**
   * Selection hint within category (e.g. easy, long, tempo, speed, stations, simulation).
   * New templates only need category + variant metadata for the coaching engine.
   */
  variant?: string;
  /** Coaching-engine filters (phase, modality, station, level, etc.) */
  tags?: string[];
};

export interface WorkoutTemplate extends WorkoutTemplateDraft {
  tags: string[];
  /** How to progress this session week over week (coach-written). */
  progressionNotes: string;
  /** HYROX station cues inferred from tags — shown on detail / session screens. */
  coachingCues: string[];
  /** Standardized equipment swaps for this session. */
  substitutionGuidance: string;
  /** Session-level RPE targets when not already spelled out in blocks. */
  rpeGuidance?: string;
}

export type WorkoutLibrary = Record<WorkoutCategory, WorkoutTemplate[]>;

/** Phase 1 catalog shape — converted when building the library. */
/** @deprecated Use WorkoutTemplate — Phase 1 shape retained for legacy catalog files. */
export type LibraryWorkout = LegacyLibraryWorkout;

export interface LegacyLibraryWorkout {
  id: string;
  name: string;
  category: 'strength' | 'aerobic' | 'speed' | 'skills' | 'hybrid' | 'engine' | 'recovery';
  description: string;
  difficulty: WorkoutDifficulty;
  duration: number;
  equipment: string[];
  focusAreas: string[];
  workoutType: string;
  warmup: string;
  mainSet: string;
  cooldown: string;
  /** Populated from tag registry when the catalog is built — omit in source files. */
  tags?: string[];
  /** Populated from coaching metadata when the catalog is built — omit in source files. */
  progressionNotes?: string;
  coachingCues?: string[];
  substitutionGuidance?: string;
  rpeGuidance?: string;
}
