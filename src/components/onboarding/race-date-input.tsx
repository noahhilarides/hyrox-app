import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { isoToMonthDayYear, monthDayYearToIso } from '@/lib/date-format';
import { palette, radius, spacing } from '@/constants/tokens';

interface RaceDateInputProps {
  value: string | null;
  onChange: (isoDate: string | null) => void;
}

function digitsOnly(text: string, maxLen: number): string {
  return text.replace(/\D/g, '').slice(0, maxLen);
}

export function RaceDateInput({ value, onChange }: RaceDateInputProps) {
  const initial = isoToMonthDayYear(value);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [year, setYear] = useState(initial.year);

  useEffect(() => {
    const parsed = isoToMonthDayYear(value);
    setMonth(parsed.month);
    setDay(parsed.day);
    setYear(parsed.year);
  }, [value]);

  const sync = (m: string, d: string, y: string) => {
    if (!m && !d && !y) {
      onChange(null);
      return;
    }
    onChange(monthDayYearToIso(m, d, y));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.field}>
          <AppText variant="caption" muted style={styles.label}>
            Month
          </AppText>
          <TextInput
            placeholder="MM"
            placeholderTextColor={palette.textMuted}
            value={month}
            onChangeText={(t) => {
              const next = digitsOnly(t, 2);
              setMonth(next);
              sync(next, day, year);
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="next"
          />
        </View>
        <AppText variant="headline" muted style={styles.sep}>
          /
        </AppText>
        <View style={styles.field}>
          <AppText variant="caption" muted style={styles.label}>
            Day
          </AppText>
          <TextInput
            placeholder="DD"
            placeholderTextColor={palette.textMuted}
            value={day}
            onChangeText={(t) => {
              const next = digitsOnly(t, 2);
              setDay(next);
              sync(month, next, year);
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="next"
          />
        </View>
        <AppText variant="headline" muted style={styles.sep}>
          /
        </AppText>
        <View style={[styles.field, styles.fieldYear]}>
          <AppText variant="caption" muted style={styles.label}>
            Year
          </AppText>
          <TextInput
            placeholder="YYYY"
            placeholderTextColor={palette.textMuted}
            value={year}
            onChangeText={(t) => {
              const next = digitsOnly(t, 4);
              setYear(next);
              sync(month, day, next);
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={4}
            returnKeyType="done"
          />
        </View>
      </View>
      <AppText variant="caption" muted style={styles.hint}>
        e.g. 09 / 15 / 2026
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  field: {
    flex: 1,
  },
  fieldYear: {
    flex: 1.4,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: palette.bgCard,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: palette.text,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  sep: {
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  hint: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
