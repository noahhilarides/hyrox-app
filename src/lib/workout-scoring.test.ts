import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { OnboardingProfile } from '@/types';
import type { WorkoutTemplate } from '@/types/workout';

import {
  GOAL_TAGS,
  scoreWorkout,
  scoreWorkoutBreakdown,
  WEAKNESS_STATION_TAGS,
  WORKOUT_SCORE_WEIGHTS,
} from './workout-scoring';

function mockTemplate(overrides: Partial<WorkoutTemplate> = {}): WorkoutTemplate {
  return {
    id: 'TEST-001',
    name: 'Test workout',
    category: 'hyrox',
    description: 'Test',
    difficulty: 'intermediate',
    duration: 45,
    equipment: ['running_only'],
    focus: ['Test'],
    workoutBlocks: [{ name: 'Main', detail: 'Test set' }],
    workoutType: 'hyrox',
    tags: [],
    progressionNotes: 'Test progression',
    coachingCues: [],
    substitutionGuidance: 'Test substitutions',
    ...overrides,
  };
}

function mockProfile(overrides: Partial<OnboardingProfile> = {}): OnboardingProfile {
  return {
    goal: 'hybrid_fitness',
    raceDate: null,
    fitnessLevel: 'intermediate',
    runningExperience: 'some',
    strengthExperience: 'some',
    daysPerWeek: 4,
    equipment: ['running_only'],
    weaknesses: [],
    workoutLength: '45',
    ...overrides,
  };
}

describe('scoreWorkout', () => {
  it('awards +30 when wall_ball tag matches wall_balls weakness', () => {
    const workout = mockTemplate({ tags: ['wall_ball', 'hyrox_station'] });
    const profile = mockProfile({ weaknesses: ['wall_balls'] });

    const breakdown = scoreWorkoutBreakdown(workout, profile, 'build');
    assert.equal(breakdown.weakStation, WORKOUT_SCORE_WEIGHTS.weakStation);
    assert.equal(scoreWorkout(workout, profile, 'build'), breakdown.total);
  });

  it('awards +30 when sled_push tag matches sleds weakness', () => {
    const workout = mockTemplate({ tags: ['sled_push', 'legs'] });
    const profile = mockProfile({ weaknesses: ['sleds'] });

    assert.equal(
      scoreWorkoutBreakdown(workout, profile, 'base').weakStation,
      WORKOUT_SCORE_WEIGHTS.weakStation
    );
    assert.ok(WEAKNESS_STATION_TAGS.sleds.includes('sled_push'));
  });

  it('does not award weak station when no weakness tag overlap', () => {
    const workout = mockTemplate({ tags: ['rowing'] });
    const profile = mockProfile({ weaknesses: ['wall_balls'] });

    assert.equal(scoreWorkoutBreakdown(workout, profile, 'build').weakStation, 0);
  });

  it('awards +50 when all equipment needs are satisfied', () => {
    const workout = mockTemplate({ equipment: ['running', 'bodyweight'] });
    const profile = mockProfile({ equipment: ['running_only'] });

    assert.equal(
      scoreWorkoutBreakdown(workout, profile, 'build').equipment,
      WORKOUT_SCORE_WEIGHTS.equipment
    );
  });

  it('does not award equipment when a required item is missing', () => {
    const workout = mockTemplate({ equipment: ['sled', 'running'] });
    const profile = mockProfile({ equipment: ['running_only'] });

    assert.equal(scoreWorkoutBreakdown(workout, profile, 'build').equipment, 0);
  });

  it('awards +50 for full_gym athletes on any template equipment list', () => {
    const workout = mockTemplate({ equipment: ['sled', 'barbell', 'rower'] });
    const profile = mockProfile({ equipment: ['full_gym'] });

    assert.equal(
      scoreWorkoutBreakdown(workout, profile, 'peak').equipment,
      WORKOUT_SCORE_WEIGHTS.equipment
    );
  });

  it('awards +25 when a goal tag matches', () => {
    const workout = mockTemplate({ tags: ['hyrox_simulation', 'race_specific'] });
    const profile = mockProfile({ goal: 'hyrox_race' });

    assert.equal(scoreWorkoutBreakdown(workout, profile, 'peak').goal, WORKOUT_SCORE_WEIGHTS.goal);
    assert.ok(GOAL_TAGS.hyrox_race.includes('hyrox_simulation'));
  });

  it('awards +20 when phase tag matches', () => {
    const workout = mockTemplate({ tags: ['base_phase', 'zone2'] });

    assert.equal(
      scoreWorkoutBreakdown(workout, mockProfile(), 'base').phase,
      WORKOUT_SCORE_WEIGHTS.phase
    );
    assert.equal(scoreWorkoutBreakdown(workout, mockProfile(), 'build').phase, 0);
  });

  it('awards +15 when duration is within 15 minutes of preference', () => {
    const workout = mockTemplate({ duration: 52 });
    const profile = mockProfile({ workoutLength: '45' });

    assert.equal(
      scoreWorkoutBreakdown(workout, profile, 'build').duration,
      WORKOUT_SCORE_WEIGHTS.duration
    );
  });

  it('does not award duration when outside tolerance', () => {
    const workout = mockTemplate({ duration: 75 });
    const profile = mockProfile({ workoutLength: '45' });

    assert.equal(scoreWorkoutBreakdown(workout, profile, 'build').duration, 0);
  });

  it('sums all criteria for a strong match', () => {
    const workout = mockTemplate({
      tags: ['wall_ball', 'hyrox_station', 'hyrox_simulation', 'race_specific', 'peak_phase'],
      equipment: ['running', 'wall_ball'],
      duration: 60,
    });
    const profile = mockProfile({
      goal: 'hyrox_race',
      weaknesses: ['wall_balls'],
      equipment: ['full_gym'],
      workoutLength: '60',
    });

    const expected =
      WORKOUT_SCORE_WEIGHTS.equipment +
      WORKOUT_SCORE_WEIGHTS.weakStation +
      WORKOUT_SCORE_WEIGHTS.goal +
      WORKOUT_SCORE_WEIGHTS.phase +
      WORKOUT_SCORE_WEIGHTS.duration;

    assert.equal(scoreWorkout(workout, profile, 'peak'), expected);
    assert.equal(scoreWorkoutBreakdown(workout, profile, 'peak').total, expected);
  });

  it('returns 0 when nothing matches', () => {
    const workout = mockTemplate({
      tags: ['advanced'],
      equipment: ['ski_erg'],
      duration: 90,
    });
    const profile = mockProfile({
      goal: 'strength',
      weaknesses: ['burpees'],
      equipment: ['running_only'],
      workoutLength: '30',
    });

    assert.equal(scoreWorkout(workout, profile, 'taper'), 0);
  });
});
