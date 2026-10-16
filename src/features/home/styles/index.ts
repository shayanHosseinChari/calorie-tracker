import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  appFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    position: 'relative',
  },
  scrollContent: { flexGrow: 1 },
  hero: { paddingBottom: 20 },
  summaryArea: { justifyContent: 'center', paddingVertical: 20 },
  summaryContent: { width: '100%' },
});