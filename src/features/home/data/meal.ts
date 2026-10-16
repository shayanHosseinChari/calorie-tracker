import { palette } from '../../../shared/theme';
import type { Meal } from '../../../shared/components/MealCard';

export const MEALS: Meal[] = [
  {
    id: 'breakfast',
    title: 'صبحانه',
    calories: '۴۵۰',
    icon: '🍳',
    color: palette.peach,
  },
  {
    id: 'lunch',
    title: 'ناهار',
    calories: '۶۸۰',
    icon: '🥙',
    color: palette.green,
  },
  {
    id: 'dinner',
    title: 'شام',
    calories: '۳۲۰',
    icon: '🥗',
    color: palette.green,
  },
  {
    id: 'snack',
    title: 'میان‌وعده',
    calories: '۴۰۰',
    icon: '🍎',
    color: palette.peach,
  },
];