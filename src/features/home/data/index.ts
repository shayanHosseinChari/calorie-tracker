import { palette } from '../../../shared/theme';
import type { Meal } from '../../../shared/components/MealCard';

export const MEALS: Meal[] = [
  { id: 'breakfast', title: 'صبحانه',    calories: '۴۵۰', icon: '🍳', color: palette.peach },
  { id: 'lunch',     title: 'ناهار',     calories: '۶۸۰', icon: '🥙', color: palette.green },
  { id: 'dinner',    title: 'شام',       calories: '۳۲۰', icon: '🥗', color: palette.green },
  { id: 'snack',     title: 'میان‌وعده', calories: '۴۰۰', icon: '🍎', color: palette.peach },
];

export const CALORIE_SUMMARY = {
  consumed: 1850,
  target: 2200,
  consumedLabel: '۱٬۸۵۰',
  targetLabel: '۲٬۲۰۰',
  remainingLabel: '۳۵۰',
  unit: 'کیلوکالری',
};

export const MACROS = [
  { id: 'fat',      title: 'چربی',         value: '۴۵ گرم',  progress: 45, colorKey: 'yellow' },
  { id: 'carbs',    title: 'کربوهیدرات',   value: '۲۱۰ گرم', progress: 72, colorKey: 'green'  },
  { id: 'protein',  title: 'پروتئین',      value: '۸۵ گرم',  progress: 60, colorKey: 'peach'  },
] as const;

export const HOME_TEXT = {
  greeting: 'سلام، روز بخیر',
  subtitle: 'امروز هم مراقب خودت باش',
  sectionTitle: 'وعده‌های امروز',
  sectionHint: '۴ وعده',
  bottomHint: 'هر وعده، یک قدم به هدفت نزدیک‌تر',
};