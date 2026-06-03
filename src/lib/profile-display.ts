export function getProfileInitials(
  raceCity?: string | null,
  raceName?: string | null
): string {
  const source = raceCity?.trim() || raceName?.trim() || 'HY';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}
