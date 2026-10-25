export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export interface CalorieInput {
  gender: Gender;
  weightKg: number;
  heightCm: number;
  age: number;
  activityLevel: ActivityLevel;
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  dailyGoal: number; // همان tdee، ولی می‌توانی هدف کاهش/افزایش هم اضافه کنی
}

export function calculateDailyCalories(input: CalorieInput): CalorieResult {
  const { gender, weightKg, heightCm, age, activityLevel } = input;

  // BMR بر اساس Mifflin-St Jeor
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * ACTIVITY_FACTORS[activityLevel];

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyGoal: Math.round(tdee), 
  };
}