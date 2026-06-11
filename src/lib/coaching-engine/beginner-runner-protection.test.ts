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

  it('week 1 keeps a true-beginner on run/walk and strides (no long continuous run)', () => {
    // Beginner/5-day routes to the v2 generator, which prescribes run/walk
    // intervals and strides for a never-run athlete instead of continuous runs.
    const plan = generateTrainingPlan(beginnerProfile());
    const week1Runs = plan.workouts.slice(0, 5).filter((w) => w.type === 'run' || w.type === 'speed');
    assert.ok(week1Runs.length >= 1, 'expected at least one run/speed session in week 1');
    for (const w of week1Runs) {
      const runText = w.exercises.map((e) => e.detail).join(' ');
      assert.ok(
        /Run\/Walk|Walk|Strides/i.test(runText),
        `${w.title} should be run/walk or strides for a true beginner, got: ${runText}`
      );
      assert.ok(
        !/\b([6-9]\d|\d{3,})\s*min\b/.test(runText),
        `${w.title} should not prescribe a 60+ min continuous run, got: ${runText}`
      );
    }
  });
});
