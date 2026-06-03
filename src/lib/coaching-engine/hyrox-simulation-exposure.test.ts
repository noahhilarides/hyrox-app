import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { PREFERRED_SIMULATION_TEMPLATE_IDS } from '@/lib/coaching-engine/hyrox-simulation-exposure';
import type { OnboardingProfile } from '@/types';

import {
  applyHyroxSimulationExposure,
  shouldScheduleSimulationWeek,
  simulationTemplateBonus,
} from './hyrox-simulation-exposure';
import { selectWorkoutTemplate } from './select-template';
import { getTemplateById } from '@/data/workout-library/build-library';

function racePrepProfile(): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'intermediate',
    runningExperience: 'regular',
    strengthExperience: 'regular',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
    weaknesses: ['sleds'],
    workoutLength: '60',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

describe('HYROX simulation exposure', () => {
  it('schedules zero simulations in weeks 1-3', () => {
    const profile = racePrepProfile();
    for (let w = 0; w <= 2; w++) {
      assert.equal(shouldScheduleSimulationWeek(w, 12, profile), false);
      const template = applyHyroxSimulationExposure(
        ['strength', 'speed', 'race_sim', 'skills', 'run'],
        w,
        12,
        profile
      );
      assert.ok(!template.includes('race_sim'));
    }
  });

  it('schedules simulations every two weeks in weeks 4-7', () => {
    const profile = racePrepProfile();
    assert.equal(shouldScheduleSimulationWeek(3, 12, profile), true);
    assert.equal(shouldScheduleSimulationWeek(4, 12, profile), false);
    assert.equal(shouldScheduleSimulationWeek(5, 12, profile), true);
    assert.equal(shouldScheduleSimulationWeek(6, 12, profile), false);
  });

  it('schedules weekly simulations in weeks 8-10', () => {
    const profile = racePrepProfile();
    for (let w = 7; w <= 9; w++) {
      assert.equal(shouldScheduleSimulationWeek(w, 12, profile), true);
    }
  });

  it('reduces simulations in weeks 11-12', () => {
    const profile = racePrepProfile();
    assert.equal(shouldScheduleSimulationWeek(10, 12, profile), true);
    assert.equal(shouldScheduleSimulationWeek(11, 12, profile), false);
  });

  it('injects race_sim into hyrox slot when prescribed', () => {
    const profile = racePrepProfile();
    const template = applyHyroxSimulationExposure(
      ['strength', 'speed', 'hyrox', 'skills', 'run'],
      7,
      12,
      profile
    );
    assert.equal(template.filter((t) => t === 'race_sim').length, 1);
  });

  it('prefers named simulation templates when selecting', () => {
    const profile = racePrepProfile();
    const selected = selectWorkoutTemplate('hyrox', 'simulation', profile, {
      weekIndex: 7,
      dayIndex: 2,
      phase: 'peak',
      sessionDate: '2026-07-21',
      recentTemplateUsage: [],
    });
    assert.ok(PREFERRED_SIMULATION_TEMPLATE_IDS.includes(selected.id as never));
  });

  it('generated 12-week race prep plan follows simulation cadence', () => {
    const plan = generateTrainingPlan(racePrepProfile());
    assert.equal(plan.weeksTotal, 12);

    const simWeeks: number[] = [];
    for (let w = 0; w < 12; w++) {
      const weekSessions = plan.workouts.slice(w * 5, w * 5 + 5);
      if (weekSessions.some((s) => s.type === 'race_sim')) {
        simWeeks.push(w + 1);
      }
    }

    assert.deepEqual(simWeeks, [4, 6, 8, 9, 10, 11]);
  });

  it('boosts preferred simulation templates in ranking', () => {
    const hyb = getTemplateById('HYB-008')!;
    const bonus = simulationTemplateBonus(hyb, 8, 'peak');
    assert.ok(bonus >= 40);
  });
});
