import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { generateTrainingPlan } from '@/lib/plan-generator';
import { getTemplateById } from '@/data/workout-library/build-library';
import type { OnboardingProfile } from '@/types';

import {
  beginnerRunnerMaxDurationMinutes,
  beginnerRunnerRunVariant,
  isTemplateAllowedForBeginnerRunner,
} from './beginner-runner-protection';
import { selectWorkoutTemplate } from './select-template';

function beginnerProfile(): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: '2026-09-01',
    fitnessLevel: 'beginner',
    runningExperience: 'none',
    strengthExperience: 'some',
    daysPerWeek: 5,
    equipment: ['full_gym', 'rower', 'ski_erg', 'sled'],
    weaknesses: ['running', 'endurance'],
    workoutLength: '45',
    planStartDate: '2026-06-02',
    trainingDayIndices: [1, 2, 3, 5, 6],
    hasRacedBefore: false,
    previousRaceTimeSeconds: null,
  };
}

describe('beginner runner protection', () => {
  it('caps duration by week band', () => {
    assert.equal(beginnerRunnerMaxDurationMinutes(0), 35);
    assert.equal(beginnerRunnerMaxDurationMinutes(1), 35);
    assert.equal(beginnerRunnerMaxDurationMinutes(2), 45);
    assert.equal(beginnerRunnerMaxDurationMinutes(3), 45);
    assert.equal(beginnerRunnerMaxDurationMinutes(8), 60);
  });

  it('maps long-run slot to easy variant in weeks 1-4', () => {
    assert.equal(beginnerRunnerRunVariant('long', true, 0), 'easy');
    assert.equal(beginnerRunnerRunVariant('long', true, 3), 'easy');
    assert.equal(beginnerRunnerRunVariant('long', true, 4), 'long');
  });

  it('blocks Long Run 60 in week 1', () => {
    const aer002 = getTemplateById('AER-002')!;
    assert.equal(isTemplateAllowedForBeginnerRunner(aer002, 0), false);
    const aer004 = getTemplateById('AER-004')!;
    assert.equal(isTemplateAllowedForBeginnerRunner(aer004, 0), true);
    const aer010 = getTemplateById('AER-010')!;
    assert.equal(isTemplateAllowedForBeginnerRunner(aer010, 0), true);
  });

  it('selects beginner run for long slot in week 1', () => {
    const profile = beginnerProfile();
    const selected = selectWorkoutTemplate('running', 'long', profile, {
      weekIndex: 0,
      dayIndex: 4,
      phase: 'base',
      sessionDate: '2026-06-09',
      recentTemplateUsage: [],
    });
    assert.notEqual(selected.id, 'AER-002');
    assert.ok(selected.duration <= 35, `expected <=35 min, got ${selected.id} ${selected.duration}`);
    assert.ok(
      ['AER-004', 'AER-010', 'GEN-RUN-BEG-EASY', 'AER-001'].includes(selected.id) ||
        selected.tags.includes('beginner') ||
        selected.tags.includes('walk_run'),
      `unexpected template ${selected.id}`
    );
  });

  it('week 1 plan has no 60+ min runs for beginner runner', () => {
    const plan = generateTrainingPlan(beginnerProfile());
    const week1Runs = plan.workouts.slice(0, 5).filter((w) => w.type === 'run' || w.type === 'speed');
    for (const w of week1Runs) {
      assert.ok(
        w.durationMinutes <= 35,
        `${w.title} (${w.libraryTemplateId}) is ${w.durationMinutes} min`
      );
      const t = getTemplateById(w.libraryTemplateId!);
      assert.notEqual(t?.id, 'AER-002');
    }
  });
});
