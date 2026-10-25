import type { ActivityLevel, Gender } from '@/shared/types/activity';

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  1: 1.2,
  2: 1.375,
  3: 1.55,
  4: 1.725,
  5: 1.9,
};

export type GoalType = 'lose' | 'maintain' | 'gain';

export interface CalorieInput {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: ActivityLevel;
}

export interface CalorieTargets {
  bmr: number;
  tdee: number;
  lose: number;
  maintain: number;
  gain: number;
}

export function calculateCalorieTargets(input: CalorieInput): CalorieTargets {
  const { gender, weightKg, heightCm, age, activityLevel } = input;

  const bmr =
    gender === 1
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * ACTIVITY_FACTORS[activityLevel];

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    lose: Math.round(tdee - 500),
    maintain: Math.round(tdee),
    gain: Math.round(tdee + 400),
  };
}