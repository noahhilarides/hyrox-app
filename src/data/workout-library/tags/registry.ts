import { AEROBIC_TAGS } from './aerobic-tags';
import { ENGINE_TAGS } from './engine-tags';
import { GENERATOR_TAGS } from './generator-tags';
import { HYBRID_TAGS } from './hybrid-tags';
import { RECOVERY_TAGS } from './recovery-tags';
import { SKILLS_TAGS } from './skills-tags';
import { SPEED_TAGS } from './speed-tags';
import { STRENGTH_TAGS } from './strength-tags';

/** Master tag lookup — keyed by workout template id. */
export const WORKOUT_TAG_REGISTRY: Record<string, string[]> = {
  ...AEROBIC_TAGS,
  ...SPEED_TAGS,
  ...STRENGTH_TAGS,
  ...SKILLS_TAGS,
  ...HYBRID_TAGS,
  ...ENGINE_TAGS,
  ...RECOVERY_TAGS,
  ...GENERATOR_TAGS,
};
