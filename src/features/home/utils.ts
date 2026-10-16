import { WEEK_DAYS } from './constants';

export function formatCalories(value?: number): string {
  if (value === undefined || !Number.isFinite(value)) {
    return '—';
  }
  return value.toLocaleString('fa-IR', {
    maximumFractionDigits: 0,
  });
}

export function getCurrentWeek(today: Date) {
  const saturday = new Date(today);
  saturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));

  return WEEK_DAYS.map((label, index) => {
    const date = new Date(saturday);
    date.setDate(saturday.getDate() + index);

    return {
      label,
      date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export function getConsumedProgress(
  consumed?: number,
  goal?: number,
): number | null {
  if (
    consumed === undefined ||
    goal === undefined ||
    !Number.isFinite(consumed) ||
    !Number.isFinite(goal) ||
    goal <= 0
  ) {
    return null;
  }
  return Math.min(1, Math.max(0, consumed / goal));
}