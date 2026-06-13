import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { palette, radius, spacing } from '@/constants/tokens';
import { useWeather } from '@/hooks/use-weather';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const metaIconColor = 'rgba(255,255,255,0.85)';

function MetaRow({
  prefix,
  label,
}: {
  prefix: React.ReactNode;
  label: string;
}) {
  return (
    <View style={styles.metaRow}>
      {prefix}
      <AppText style={styles.metaText}>{label}</AppText>
    </View>
  );
}

function getWeatherIconName(weatherCode: number, isDay: boolean): IoniconName {
  if (weatherCode === 0 || weatherCode === 1) {
    return isDay ? 'sunny' : 'moon';
  }
  if (weatherCode === 2 || weatherCode === 3) return 'partly-sunny';
  if (weatherCode === 45 || weatherCode === 48) return 'cloud';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return 'rainy';
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) {
    return 'snow';
  }
  if (weatherCode >= 95 && weatherCode <= 99) return 'thunderstorm';
  return 'partly-sunny';
}

function getBackgroundColor(weatherCode: number): string {
  if (weatherCode === 0 || weatherCode === 1) return '#3B82C4';
  if (weatherCode === 2 || weatherCode === 3 || weatherCode === 45 || weatherCode === 48) {
    return '#5B6470';
  }
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    return '#3A5A78';
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86) {
    return '#6B7A8F';
  }
  if (weatherCode >= 95 && weatherCode <= 99) return '#2D3A4A';
  return '#3B82C4';
}

export function TodayWeatherTile() {
  const { weather, loading, error, permissionDenied } = useWeather();
  const todayLabel = format(new Date(), 'MMM d');

  if (loading) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <Pressable style={[styles.card, styles.mutedCard]}>
        <AppText style={styles.mutedText}>Enable location for weather</AppText>
      </Pressable>
    );
  }

  if (error || !weather) {
    return (
      <View style={[styles.card, styles.mutedCard]}>
        <AppText style={styles.mutedText}>Weather unavailable</AppText>
      </View>
    );
  }

  const backgroundColor = getBackgroundColor(weather.weatherCode);
  const iconName = getWeatherIconName(weather.weatherCode, weather.isDay);
  const sunriseTime = format(parseISO(weather.sunrise), 'HH:mm');
  const sunsetTime = format(parseISO(weather.sunset), 'HH:mm');

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View>
        <View style={styles.topRow}>
          <View style={styles.dateColumn}>
            <AppText style={styles.dateLabel}>{todayLabel}</AppText>
            <Ionicons name={iconName} size={32} color="#fff" style={styles.weatherIcon} />
          </View>
          <View style={styles.metaColumn}>
            <MetaRow
              prefix={
                <Ionicons name="umbrella-outline" size={11} color={metaIconColor} />
              }
              label={`${weather.precipProb}%`}
            />
            <MetaRow
              prefix={
                <MaterialCommunityIcons
                  name="weather-sunset-up"
                  size={12}
                  color={metaIconColor}
                />
              }
              label={sunriseTime}
            />
            <MetaRow
              prefix={
                <MaterialCommunityIcons
                  name="weather-sunset-down"
                  size={12}
                  color={metaIconColor}
                />
              }
              label={sunsetTime}
            />
          </View>
        </View>
      </View>

      <View>
        <AppText style={styles.cityLabel}>{weather.city}</AppText>
        <AppText style={styles.tempLabel}>{weather.temp}°</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  loadingCard: {
    backgroundColor: '#3B82C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mutedCard: {
    backgroundColor: palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  mutedText: {
    fontSize: 13,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateColumn: {
    flexShrink: 1,
  },
  dateLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  weatherIcon: {
    marginTop: 8,
  },
  metaColumn: {
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    lineHeight: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  cityLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  tempLabel: {
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 38,
    color: '#fff',
  },
});
