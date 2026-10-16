import { useMemo } from 'react';
import { getCurrentWeek } from '../utils';

export function useWeekDays() {
  return useMemo(() => {
    const today = new Date();
    return {
      today,
      weekDays: getCurrentWeek(today),
    };
  }, []);
}