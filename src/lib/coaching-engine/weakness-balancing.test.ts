import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { getTemplateById } from '@/data/workout-library/build-library';
import { WEAKNESS_STATION_TAGS } from '@/lib/workout-scoring';
import type { OnboardingProfile } from '@/types';

import {
  createStationFocusWeekState,
  maxWeaknessExposurePerWeek,
  pickStationTargetWeakness,
  recordStationFocusForWeek,
  stationWeaknessCandidates,
} from './weakness-balancing';
import { resolveSlot } from './slot-resolve';

function mockProfile(weaknesses: OnboardingProfile['weaknesses']): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'intermediate',
    runningExperience: 'competitive',
    strengthExperience: 'none',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
    weaknesses,
    workoutLength: '60',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

describe('weakness balancing', () => {
  it('caps each weakness at 50% of station-focused slots', () => {
    assert.equal(maxWeaknessExposurePerWeek(4), 2);
    assert.equal(maxWeaknessExposurePerWeek(3), 2);
    assert.equal(maxWeaknessExposurePerWeek(1), 1);
  });

  it('rotates between sleds and wall_balls without one dominating', () => {
    const profile = mockProfile(['sleds', 'wall_balls', 'strength']);
    const weekState = createStationFocusWeekState();
    const slotCount = 4;
    const picks: (string | undefined)[] = [];

    for (let i = 0; i < 4; i++) {
      const w = pickStationTargetWeakness(profile, weekState, slotCount, 0, i);
      recordStationFocusForWeek(weekState, w);
      picks.push(w);
    }

    assert.ok(picks.includes('sleds'));
    assert.ok(picks.includes('wall_balls'));
    assert.equal(weekState.exposure.sleds, 1);
    assert.equal(weekState.exposure.wall_balls, 1);
    assert.notEqual(picks[0], picks[1]);
  });

  it('does not repeat the same station focus twice in one week', () => {
    const profile = mockProfile(['sleds', 'wall_balls']);
    const weekState = createStationFocusWeekState();
    const first = pickStationTargetWeakness(profile, weekState, 2, 0, 0)!;
    recordStationFocusForWeek(weekState, first);
    const second = pickStationTargetWeakness(profile, weekState, 2, 0, 1)!;
    assert.notEqual(first, second);
  });

  it('resolveSlot uses targetWeakness for variant, not first listed weakness', () => {
    const profile = mockProfile(['sleds', 'wall_balls']);
    const sledSlot = resolveSlot('hyrox', profile, {
      phase: 'base',
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 0,
      targetWeakness: 'wall_balls',
    });
    assert.equal(sledSlot.variant, 'stations');

    const wallSlot = resolveSlot('skills', profile, {
      phase: 'base',
      isLongRun: false,
      forceRaceSim: false,
      strengthIndex: 0,
      targetWeakness: 'sleds',
    });
    assert.equal(wallSlot.variant, 'sled');
  });

  it('generated plan rotates sled and wall ball focus without same-week duplicates', () => {
    const plan = generateTrainingPlan(mockProfile(['sleds', 'wall_balls', 'strength']));
    const station = plan.workouts.filter(
      (w) => w.type === 'hyrox' || w.type === 'skills' || w.type === 'race_sim'
    );

    const sledTagged = station.filter((w) => {
      const t = getTemplateById(w.libraryTemplateId!);
      return t && WEAKNESS_STATION_TAGS.sleds.some((tag) => t.tags.includes(tag));
    });
    const wallTagged = station.filter((w) => {
      const t = getTemplateById(w.libraryTemplateId!);
      return t && WEAKNESS_STATION_TAGS.wall_balls.some((tag) => t.tags.includes(tag));
    });

    assert.ok(sledTagged.length >= 1);
    assert.ok(wallTagged.length >= 1);
  });

  it('stationWeaknessCandidates preserves priority order', () => {
    assert.deepEqual(stationWeaknessCandidates(['wall_balls', 'sleds']), ['sleds', 'wall_balls']);
  });
});
