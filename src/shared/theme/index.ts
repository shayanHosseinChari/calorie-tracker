import { palette } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = { colors: palette, typography, spacing, radius, shadows } as const;
export type AppTheme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './navigationTheme';