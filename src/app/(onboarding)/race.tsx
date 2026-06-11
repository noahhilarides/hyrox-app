import { parseISO, startOfDay } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ContinueButton } from '@/components/onboarding/continue-button';
import { OnboardingContainer } from '@/components/onboarding/onboarding-container';
import { OnboardingScreenIntro } from '@/components/onboarding/onboarding-screen-intro';
import { RaceEventCard } from '@/components/onboarding/race-event-card';
import { SelectionChip } from '@/components/onboarding/selection-chip';
import { AppText } from '@/components/ui/text';
import { HYROX_RACE_EVENTS, type HyroxRaceEvent } from '@/data/onboarding/races';
import { onboardingSpacing, onboardingTheme } from '@/data/onboarding/theme';
import { isRaceUpcoming } from '@/lib/race-countdown';
import { useOnboardingNavigation } from '@/hooks/use-onboarding-navigation';
import { useOnboardingStore } from '@/store/onboarding-store';

type RaceRegionFilter =
  | 'all'
  | 'united_states'
  | 'north_america'
  | 'europe'
  | 'asia'
  | 'south_america'
  | 'australia'
  | 'africa'
  | 'middle_east';

const REGION_OPTIONS: { id: RaceRegionFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'united_states', label: 'United States' },
  { id: 'north_america', label: 'North America' },
  { id: 'europe', label: 'Europe' },
  { id: 'asia', label: 'Asia' },
  { id: 'south_america', label: 'South America' },
  { id: 'australia', label: 'Australia' },
  { id: 'africa', label: 'Africa' },
  { id: 'middle_east', label: 'Middle East' },
];

function raceMatchesRegionFilter(event: HyroxRaceEvent, filter: RaceRegionFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'united_states') return event.country === 'United States';
  const map: Record<string, string> = {
    north_america: 'North America',
    europe: 'Europe',
    asia: 'Asia',
    south_america: 'South America',
    australia: 'Australia',
    africa: 'Africa',
    middle_east: 'Middle East',
  };
  return event.region === map[filter];
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

  const sortedRaces = useMemo(
    () => sortRacesByDate(filterUpcomingRaces(HYROX_RACE_EVENTS)),
    []
  );

  const visibleRegionOptions = useMemo(
    () =>
      REGION_OPTIONS.filter(
        (option) =>
          option.id === 'all' ||
          option.id === 'united_states' ||
          sortedRaces.some((event) => raceMatchesRegionFilter(event, option.id))
      ),
    [sortedRaces]
  );

  const filteredRaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sortedRaces.filter((event) => {
      if (regionFilter !== 'all' && !raceMatchesRegionFilter(event, regionFilter)) {
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

  const isComplete = race.eventId != null;

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
        {visibleRegionOptions.map((option) => (
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
