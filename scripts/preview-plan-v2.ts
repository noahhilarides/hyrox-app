import { generatePlanV2 } from '../src/lib/generator-v2/generate-plan';
import { onboardingWeaknessesToStations } from '../src/lib/generator-v2/weakness-stations';
import type { OnboardingWeakness } from '../src/types/onboarding';

const level = (process.argv[2] ?? 'beginner') as 'beginner' | 'intermediate' | 'advanced';
const daysPerWeek = Number(process.argv[3] ?? 5);
const runningExperience = (process.argv[4] ?? 'none') as 'none' | 'some' | 'regular' | 'competitive';
const equipment = (process.argv[5] ?? 'full_gym') as 'full_gym' | 'dumbbells_only' | 'hyrox_gym';
const weaknessArg = process.argv[6];
const onboardingWeaknesses = weaknessArg
  ? (weaknessArg.split(',').map((w) => w.trim()) as OnboardingWeakness[])
  : [];
const weakStations = onboardingWeaknessesToStations(onboardingWeaknesses);

const dayIndices: Record<number, number[]> = {
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
};

const plan = generatePlanV2({
  level,
  daysPerWeek,
  totalWeeks: 12,
  trainingDayIndices: dayIndices[daysPerWeek] ?? [1, 2, 3, 4, 5],
  startDate: new Date(),
  runningExperience,
  equipment,
  weakStations,
});

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
console.log(
  `\n### ${level.toUpperCase()} / ${daysPerWeek}-day / running:${runningExperience} / equip:${equipment} / weak:${weaknessArg ?? '-'} ###`
);

for (const week of plan.weeks) {
  console.log(`\n===== WEEK ${week.weekIndex + 1} (${week.phase.toUpperCase()}) =====`);
  for (const s of week.sessions) {
    const d = new Date(s.date + 'T00:00:00');
    console.log(`\n${WEEKDAY[d.getDay()]} — ${s.title} [${s.durationMinutes}min]`);
    for (const b of s.blocks) {
      const note = b.prescriptionNote ? ` (${b.prescriptionNote})` : '';
      console.log(`  ${b.label}${note}:`);
      for (const m of b.movements) console.log(`    - ${m.name}: ${m.prescription}`);
    }
  }
}
