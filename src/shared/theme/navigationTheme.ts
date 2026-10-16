import {
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import { palette } from './colors';
import { fontFamily } from './typography';

export const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.orange,
    background: palette.background,
    card: palette.white,
    text: palette.text,
    border: 'transparent',
    notification: palette.orange,
  },
  fonts: {
    regular: { fontFamily, fontWeight: '400' },
    medium: { fontFamily, fontWeight: '500' },
    bold: { fontFamily, fontWeight: '700' },
    heavy: { fontFamily, fontWeight: '800' },
  },
};