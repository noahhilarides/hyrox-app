import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { templateEquipmentMatches } from '@/lib/workout-scoring';
import type { OnboardingProfile } from '@/types';

import {
  selectWorkoutTemplate,
  wasTemplateUsedOnSameWeekdayPreviousWeek,
  wasTemplateUsedWithinDays,
  type TemplateSelectContext,
} from './select-template';

function mockProfile(overrides: Partial<OnboardingProfile> = {}): OnboardingProfile {
  return {
    goal: 'hyrox_race',
    raceDate: null,
    fitnessLevel: 'intermediate',
    runningExperience: 'some',
    strengthExperience: 'some',
    daysPerWeek: 5,
    equipment: ['full_gym', 'sled', 'rower', 'ski_erg'],
    weaknesses: ['wall_balls'],
    workoutLength: '45',
    ...overrides,
  };
}

function mockCtx(overrides: Partial<TemplateSelectContext> = {}): TemplateSelectContext {
  return {
    weekIndex: 2,
    dayIndex: 1,
    phase: 'build',
    sessionDate: '2026-06-08',
    recentTemplateUsage: [],
    ...overrides,
  };
}

describe('wasTemplateUsedWithinDays', () => {
  it('blocks templates used within the last 14 days', () => {
    assert.equal(
      wasTemplateUsedWithinDays('AER-001', '2026-06-15', [
        { templateId: 'AER-001', date: '2026-06-08' },
      ]),
      true
    );
    assert.equal(
      wasTemplateUsedWithinDays('AER-001', '2026-06-15', [
        { templateId: 'AER-001', date: '2026-05-01' },
      ]),
      false
    );
  });
});

describe('selectWorkoutTemplate', () => {
  it('selects equipment-compatible templates only', () => {
    const profile = mockProfile({ equipment: ['running_only'] });
    const selected = selectWorkoutTemplate('running', 'easy', profile, mockCtx());
    assert.equal(templateEquipmentMatches(selected, profile), true);
  });

  it('favors weakness-aligned templates via scoreWorkout', () => {
    const profile = mockProfile({ weaknesses: ['wall_balls'] });
    const selected = selectWorkoutTemplate('hyrox', 'stations', profile, mockCtx());
    assert.ok(
      selected.tags.includes('wall_ball'),
      `expected wall_ball tag, got ${selected.id} tags=${selected.tags.join(',')}`
    );
  });

  it('does not repeat the same template within 14 days when alternatives exist', () => {
    const profile = mockProfile();
    const first = selectWorkoutTemplate('hyrox', 'stations', profile, mockCtx({
      sessionDate: '2026-06-01',
    }));
    const second = selectWorkoutTemplate(
      'hyrox',
      'stations',
      profile,
      mockCtx({
        sessionDate: '2026-06-08',
        recentTemplateUsage: [{ templateId: first.id, date: '2026-06-01' }],
      })
    );
    assert.notEqual(second.id, first.id);
  });

  it('does not repeat the same template on the same weekday two weeks in a row', () => {
    const profile = mockProfile();
    const mondayCtx = mockCtx({ sessionDate: '2026-06-09', dayIndex: 0 });
    const first = selectWorkoutTemplate('hyrox', 'stations', profile, mondayCtx);
    assert.equal(
      wasTemplateUsedOnSameWeekdayPreviousWeek(first.id, '2026-06-16', [
        { templateId: first.id, date: '2026-06-09' },
      ]),
      true
    );
    const second = selectWorkoutTemplate(
      'hyrox',
      'stations',
      profile,
      mockCtx({
        sessionDate: '2026-06-16',
        dayIndex: 0,
        recentTemplateUsage: [{ templateId: first.id, date: '2026-06-09' }],
      })
    );
    assert.notEqual(second.id, first.id);
  });
});
