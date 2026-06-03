import { StyleSheet, View } from 'react-native';

const HANDLE_HEIGHT = 14;

export function DragHandle() {
  return (
    <View style={styles.zone}>
      <View style={styles.bar} />
    </View>
  );
}

export const DRAG_HANDLE_HEIGHT = HANDLE_HEIGHT;

const styles = StyleSheet.create({
  zone: {
    height: HANDLE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
});
