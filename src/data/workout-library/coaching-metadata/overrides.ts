/** Per-workout coaching enhancements — merged on top of category defaults. */
export interface CoachingOverride {
  progressionNotes?: string;
  rpeGuidance?: string;
  extraCues?: string[];
  substitutionGuidance?: string;
}

export const COACHING_OVERRIDES: Record<string, CoachingOverride> = {
  // —— Aerobic ——
  'AER-001': {
    progressionNotes:
      'Treat this as your weekly anchor easy run. Add 5 min only after two consecutive weeks at RPE 6 with no walk breaks.',
    extraCues: ['If you cannot nose-breathe, slow down — that is your Zone 2 ceiling today.'],
  },
  'AER-004': {
    progressionNotes:
      'Success = finishing smiling. Extend the jog segments by 30 sec before shortening walks. Never skip the walk breaks early — they build volume safely.',
  },
  'AER-010': {
    progressionNotes:
      'When 2 min jog / 1 min walk feels easy (RPE 5–6), try 3 min jog / 1 min walk for two weeks before dropping walks entirely.',
  },
  'AER-013': {
    progressionNotes:
      'Row aerobic base for HYROX: add 3 min per week max. Grip should stay relaxed — tense forearms predict farmer carry fatigue.',
  },
  'AER-014': {
    progressionNotes:
      '1000 m repeats should land within 5 sec — then add a 6th rep or trim rest by 15 sec, not both.',
  },
  // —— Speed ——
  'SPD-003': {
    progressionNotes:
      'Strides are neuromuscular skill, not a workout. Keep easy run truly easy (RPE 5). Add one stride per week up to 8 before increasing stride duration.',
  },
  'SPD-005': {
    progressionNotes:
      'HYROX 1 km pace: log splits. Progress when all four reps are within 5 sec — then add 1 rep or 15 sec faster average, not both.',
  },
  // —— Strength ——
  'STR-004': {
    progressionNotes:
      'Master goblet depth and RDL hinge before adding weight. Add 2 reps per set when RPE 6, then load. This session should feel doable every week.',
  },
  'STR-005': {
    progressionNotes:
      'HYROX upper prep: keep bench and row sets equal. Progress bench only if rows stay within 1 rep of press performance. Face pulls every session protect ski pull shoulders.',
    extraCues: ['Ski pull is a horizontal pull under fatigue — rows at RPE 7 are race-specific.'],
  },
  'STR-008': {
    progressionNotes:
      'Wall ball sets: add 3 reps per week before load. Pair every push-heavy set with scapular work — add 1×12 band pull-aparts if shoulders feel tight.',
    rpeGuidance: 'Push press RPE 7–8; wall balls RPE 7 (unbroken sets); get-ups RPE 6 technique focus.',
  },
  'STR-011': {
    progressionNotes:
      'Circuit habit > load. When 3 rounds feel easy at RPE 6, add a 4th round before heavier dumbbells. Rows and press stay equal reps.',
  },
  'STR-015': {
    progressionNotes:
      'Complexes are race rehearsal: log time per complex. Progress by 2.5 kg on squat or −15 sec rest, never both in one week.',
  },
  // —— Skills ——
  'SKL-005': {
    progressionNotes:
      '8×15 m sled push: when last rep matches rep 1 split, add 2.5 kg or one rep. Low hips every step — film rep 1 and rep 8.',
  },
  'SKL-006': {
    progressionNotes:
      'Sled pull: progress load when you can walk backward without rope slack for full 12.5 m. Substitute rows must be heavy RPE 8.',
  },
  'SKL-007': {
    progressionNotes:
      'Track wall ball break points. When round 5 matches round 1 breaks, add 5 reps per round or −15 sec rest.',
  },
  'SKL-008': {
    progressionNotes:
      'Technique day only — no redline. When step-back burpees are smooth, progress to full burpees for the final 3×10 only.',
  },
  'SKL-010': {
    progressionNotes:
      'Carry skill: add 10 m per week before load. Tall posture beats speed — dropped implements cost more than 5 sec.',
  },
  // —— Hybrid ——
  'HYB-003': {
    progressionNotes:
      'Beginner hybrid: same round times matter more than speed. When burpees stay unbroken in sets of 5, try sets of 7 next block.',
  },
  'HYB-011': {
    progressionNotes:
      'Confidence circuit — incline push-ups and walk/jog are wins. Add one round only when RPE never exceeds 7.',
  },
  'HYB-016': {
    progressionNotes:
      'DB + run intro: add 1 rep per movement before shortening rest. Keep runs at conversational RPE 6.',
  },
  'HYB-008': {
    progressionNotes:
      'Mini race simulation — log total time. Progress by −30 sec rest between legs or +1 station round after two even efforts.',
  },
  'HYB-017': {
    progressionNotes:
      'Race-pace brick: sled push 50 m at competition load before adding run volume.',
  },
  // —— Engine ——
  'ENG-001': {
    progressionNotes:
      'Full simulation density: progress by −30 sec between-round rest when run splits stay within 10 sec.',
  },
  'ENG-002': {
    progressionNotes:
      'Station brick at race intent — log 1 km run splits. Progress sled load 2.5 kg when run split does not slow >5 sec.',
  },
  'ENG-004': {
    progressionNotes:
      'Engine base for beginners: finish all rounds at RPE 6–7 for two weeks before removing one rest period.',
  },
  'ENG-008': {
    progressionNotes:
      'Full race order rehearsal — fueling at 45 min is mandatory practice. Do not add stations; sharpen transitions.',
  },
  // —— Recovery ——
  'RCV-002': {
    progressionNotes:
      'Active recovery only — if HR drifts above easy jog, walk 2 min. No progression except +5 min when sleep and soreness are green.',
  },
  // —— Generator — running ——
  'GEN-RUN-BEG-EASY': {
    progressionNotes:
      'Run-walk is the product — add 30 sec to each jog interval before dropping a walk. Strides are optional skill, not fitness.',
  },
  'GEN-RUN-BEG-TEMPO': {
    progressionNotes:
      'First tempo exposure: all reps at RPE 6–7. Add 1 min to tempo only when walk recoveries feel easy.',
  },
  'GEN-RUN-SPD-1K': {
    progressionNotes:
      'HYROX 1 km repeats at RPE 8 — match race fueling. Progress when 4 reps land within 5 sec.',
  },
  // —— Generator — strength ——
  'GEN-STR-LOWER-BASE': {
    progressionNotes:
      'Foundation lower: add 2 reps before load on goblet and RDL. Sled optional — walking lunges substitute at same RPE.',
  },
  'GEN-STR-UPPER-STANDARD': {
    progressionNotes:
      'Balance push and pull weekly. If bench progresses, row must progress the same week — 1:1 set count is non-negotiable for HYROX.',
    extraCues: ['SkiErg pull is lat-driven — rows and face pulls are race-specific, not accessory.'],
  },
  'PERF-STR-UPPER': {
    progressionNotes:
      'Performance upper: prioritize pull volume equal to press. Add a back-off row set before increasing press load.',
  },
  // —— Generator — HYROX ——
  'GEN-HYROX-SIM': {
    progressionNotes:
      'Simulation at RPE 8–9 on stations. Progress by shaving transition time or −30 sec rest, not extra rounds, until splits are even.',
  },
  'GEN-HYROX-SIM-HEAVY': {
    progressionNotes:
      'Heavy simulation: sled at race load minimum. Progress load 2.5 kg only when 1 km run after sled is within 5 sec of fresh run.',
  },
  'GEN-HYROX-SKL-SLED': {
    progressionNotes:
      'Sled skill combo: when push and pull splits match week 1, add one rep per week or 2.5 kg — one variable only.',
  },
  'GEN-HYROX-SKL-GENERAL': {
    progressionNotes:
      'General station day: even pacing round to round. Add 5 wall balls or 10 m lunges per week before shortening rest.',
  },
  'GEN-COND-BURPEE': {
    progressionNotes:
      'Burpee density: hold cycle time round 1 vs 4 within 3 sec before adding reps or removing rest.',
  },
};
