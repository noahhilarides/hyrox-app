import { parseISO, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { OnboardingSection } from '@/components/onboarding/onboarding-section';
import { RaceEventCard } from '@/components/onboarding/race-event-card';
import { SelectionChip } from '@/components/onboarding/selection-chip';
import { AppText } from '@/components/ui/text';
import { HYROX_RACE_EVENTS, type HyroxRaceEvent } from '@/data/onboarding/races';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import { isRaceUpcoming } from '@/lib/race-countdown';
import { formatHyroxFinishTime, parseHyroxFinishTime } from '@/lib/hyrox-race-time';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

type RaceRegionFilter =
  | 'all'
  | 'north_america'
  | 'europe'
  | 'asia_pacific'
  | 'middle_east';

const REGION_OPTIONS: { id: RaceRegionFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'north_america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia_pacific', label: 'Asia Pacific' },
  { id: 'middle_east', label: 'Middle East' },
];

const US_STATE_PATTERN =
  /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;

function inferRaceRegion(event: HyroxRaceEvent): Exclude<RaceRegionFilter, 'all'> {
  const haystack = `${event.city} ${event.location} ${event.name}`.toLowerCase();

  if (
    /dubai|abu dhabi|qatar|bahrain|saudi|riyadh|kuwait|israel|tel aviv|oman|jeddah|doha|uae/.test(
      haystack
    )
  ) {
    return 'middle_east';
  }

  if (
    /australia|sydney|melbourne|brisbane|perth|singapore|hong kong|tokyo|osaka|seoul|bangkok|malaysia|kuala|new zealand|auckland|wellington|shanghai|beijing|taipei|manila|jakarta|indonesia|india|mumbai|delhi|hangzhou|chengdu|shenzhen|guangzhou|sanya|chiba|philippines|vietnam|taiwan|korea|japan|china|thailand/.test(
      haystack
    )
  ) {
    return 'asia_pacific';
  }

  if (
    /united kingdom|\buk\b|london|manchester|birmingham|paris|berlin|amsterdam|barcelona|madrid|rome|milan|vienna|zurich|stockholm|copenhagen|dublin|brussels|munich|hamburg|frankfurt|lyon|nice|warsaw|prague|lisbon|porto|oslo|helsinki|gent|athens|greece|istanbul|izmir|turkey|tenerife|maastricht|utrecht|gdansk|poznan|valencia|geneva|switzerland|karlsruhe|bordeaux|dusseldorf|norway|finland|belgium|netherlands|europe|germany|france|spain|italy|denmark|poland|portugal|scotland|england/.test(
      haystack
    )
  ) {
    return 'europe';
  }

  if (
    US_STATE_PATTERN.test(event.location) ||
    /usa|u\.s\.|united states|canada|toronto|vancouver|montreal|calgary|mexico|cdmx|guadalajara/.test(
      haystack
    )
  ) {
    return 'north_america';
  }

  return 'north_america';
}

function raceSearchHaystack(event: HyroxRaceEvent): string {
  return `${event.city} ${event.location} ${event.name}`.toLowerCase();
}

function sortRacesByDate(events: HyroxRaceEvent[]): HyroxRaceEvent[] {
  return [...events].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );
}

function filterUpcomingRaces(events: HyroxRaceEvent[]): HyroxRaceEvent[] {
  const today = startOfDay(new Date());
  return events.filter((event) => isRaceUpcoming(event.date, today));
}

export default function RaceScreen() {
  const { goNext } = useOnboardingNavigation();
  const race = useOnboardingStore((s) => s.race);
  const setRace = useOnboardingStore((s) => s.setRace);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<RaceRegionFilter>('all');
  const [timeInput, setTimeInput] = useState(() =>
    race.previousTimeSeconds != null
      ? formatHyroxFinishTime(race.previousTimeSeconds)
      : ''
  );

  const parsedTime = useMemo(() => parseHyroxFinishTime(timeInput), [timeInput]);
  const timeError =
    race.hasRacedBefore === true && timeInput.trim().length > 0 && parsedTime == null;

  const sortedRaces = useMemo(
    () => sortRacesByDate(filterUpcomingRaces(HYROX_RACE_EVENTS)),
    []
  );

  const filteredRaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedRaces.filter((event) => {
      if (regionFilter !== 'all' && inferRaceRegion(event) !== regionFilter) {
        return false;
      }
      if (!q) return true;
      return raceSearchHaystack(event).includes(q);
    });
  }, [sortedRaces, searchQuery, regionFilter]);

  const handleSelect = (event: HyroxRaceEvent) => {
    setRace({
      eventId: event.id,
      date: event.date,
      name: event.name,
      city: event.city,
      location: event.location,
    });
  };

  const setHasRacedBefore = (hasRacedBefore: boolean) => {
    if (!hasRacedBefore) {
      setTimeInput('');
      setRace({ hasRacedBefore, previousTimeSeconds: null });
      return;
    }
    setRace({ hasRacedBefore });
  };

  const handleTimeChange = (text: string) => {
    setTimeInput(text);
    const seconds = parseHyroxFinishTime(text);
    setRace({ previousTimeSeconds: seconds });
  };

  const isComplete =
    race.eventId != null &&
    race.hasRacedBefore != null &&
    (race.hasRacedBefore === false || parsedTime != null);

  const listHeader = (
    <>
      <Animated.View entering={FadeIn.duration(500)}>
        <OnboardingScreenIntro
          title="Choose your race"
          subtitle="Train toward a real HYROX weekend. We'll build your taper and peak around this date."
        />
      </Animated.View>

      <View style={styles.searchBlock}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search city or country"
          placeholderTextColor={onboardingTheme.textSubtle}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionRow}
        style={styles.regionScroll}>
        {REGION_OPTIONS.map((option) => (
          <SelectionChip
            key={option.id}
            label={option.label}
            selected={regionFilter === option.id}
            onPress={() => setRegionFilter(option.id)}
            compact
            style={styles.regionChip}
          />
        ))}
      </ScrollView>

      {filteredRaces.length === 0 ? (
        <View style={styles.emptyState}>
          <AppText style={styles.emptyTitle}>No races match</AppText>
          <AppText style={styles.emptyBody}>
            Try another city, country, or region filter.
          </AppText>
        </View>
      ) : null}
    </>
  );

  const listFooter = (
    <>
      <Animated.View entering={FadeInDown.delay(120).duration(400)}>
        <OnboardingSection
          title="HYROX experience"
          subtitle="This helps us set realistic pacing targets for your plan.">
          <View style={styles.chipRow}>
            <SelectionChip
              label="Yes, I've raced"
              selected={race.hasRacedBefore === true}
              onPress={() => setHasRacedBefore(true)}
              style={styles.chip}
            />
            <SelectionChip
              label="No, first race"
              selected={race.hasRacedBefore === false}
              onPress={() => setHasRacedBefore(false)}
              style={styles.chip}
            />
          </View>

          {race.hasRacedBefore === true ? (
            <View style={styles.timeBlock}>
              <AppText style={styles.timeLabel}>Previous finish time</AppText>
              <TextInput
                value={timeInput}
                onChangeText={handleTimeChange}
                placeholder="e.g. 1:24:30 or 84:30"
                placeholderTextColor={onboardingTheme.textSubtle}
                style={[styles.timeInput, timeError && styles.timeInputError]}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {timeError ? (
                <AppText style={styles.timeError}>
                  Use H:MM:SS, MM:SS, or total minutes (e.g. 90)
                </AppText>
              ) : parsedTime != null ? (
                <AppText style={styles.timeOk}>
                  Recorded as {formatHyroxFinishTime(parsedTime)}
                </AppText>
              ) : (
                <AppText style={styles.timeHint}>
                  Open, doubles, or pro — your most recent full race time
                </AppText>
              )}
            </View>
          ) : null}
        </OnboardingSection>
      </Animated.View>

      <View style={styles.hintRow}>
        <AppText style={styles.hint}>
          {race.name ? `Selected · ${race.name}` : 'Tap a race to select your event'}
        </AppText>
      </View>
    </>
  );

  return (
    <OnboardingContainer
      scroll={false}
      footer={
        <ContinueButton label="Continue" onPress={goNext} disabled={!isComplete} />
      }>
      <FlatList
        data={filteredRaces}
        keyExtractor={(item) => item.id}
        style={styles.raceList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        ListFooterComponent={listFooter}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeIn.delay(Math.min(index, 6) * 50).duration(400)}>
            <RaceEventCard
              event={item}
              selected={race.eventId === item.id}
              onPress={() => handleSelect(item)}
            />
          </Animated.View>
        )}
      />
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  raceList: {
    flex: 1,
    marginHorizontal: -onboardingSpacing.lg,
    paddingHorizontal: onboardingSpacing.lg,
  },
  listContent: {
    paddingBottom: onboardingSpacing.xl,
    flexGrow: 1,
  },
  separator: {
    height: onboardingSpacing.sm + 2,
  },
  searchBlock: {
    marginTop: onboardingSpacing.md,
    marginBottom: onboardingSpacing.sm,
  },
  searchInput: {
    backgroundColor: onboardingTheme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    paddingHorizontal: onboardingSpacing.md,
    paddingVertical: onboardingSpacing.sm + 4,
    fontSize: 16,
    color: onboardingTheme.text,
  },
  regionScroll: {
    marginBottom: onboardingSpacing.md,
    marginHorizontal: -onboardingSpacing.lg,
  },
  regionRow: {
    paddingHorizontal: onboardingSpacing.lg,
    gap: onboardingSpacing.sm,
    paddingBottom: onboardingSpacing.xs,
  },
  regionChip: {
    minWidth: undefined,
  },
  emptyState: {
    paddingVertical: onboardingSpacing.lg,
    alignItems: 'center',
    gap: onboardingSpacing.xs,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
  emptyBody: {
    fontSize: 13,
    color: onboardingTheme.textSubtle,
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: onboardingSpacing.sm,
    marginBottom: onboardingSpacing.md,
  },
  chip: {
    flexGrow: 1,
    minWidth: '45%',
  },
  timeBlock: {
    gap: onboardingSpacing.sm,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: onboardingTheme.text,
  },
  timeInput: {
    backgroundColor: onboardingTheme.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: onboardingTheme.borderSoft,
    paddingHorizontal: onboardingSpacing.md,
    paddingVertical: onboardingSpacing.sm + 4,
    fontSize: 18,
    fontWeight: '600',
    color: onboardingTheme.text,
    fontVariant: ['tabular-nums'],
  },
  timeInputError: {
    borderColor: onboardingTheme.danger,
  },
  timeHint: {
    fontSize: 13,
    lineHeight: 18,
    color: onboardingTheme.textSubtle,
  },
  timeOk: {
    fontSize: 13,
    fontWeight: '600',
    color: onboardingTheme.accent,
  },
  timeError: {
    fontSize: 13,
    color: onboardingTheme.danger,
  },
  hintRow: {
    paddingTop: onboardingSpacing.sm,
    alignItems: 'center',
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: onboardingTheme.textSubtle,
    textAlign: 'center',
  },
});
