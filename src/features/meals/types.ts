// features/meals/types.ts
export type MealType = 1 | 2 | 3 | 4;
export type MealName = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealFoodInput {
  food_id: number;
  amount: number;
  calories?: number;
  name?: string;
  unit?: string;
}

export interface AddMealPayload {
  meal_id: MealType;
  foods: MealFoodInput[];
  date?: string;
}

export interface MealFood {
  id: number;
  meal_id: number;
  food_id: number;
  food_name: string;
  calories: number;
  amount: number;
  unit: string;
}

export interface Meal {
  id: number;
  user_id: number;
  date: string;
  meal_id: MealType;
  meal_name: MealName;
  foods: MealFood[];
  created_at: string;
  updated_at: string;
  total_calories: number;
}

export interface MealsResponse {
  date: string | null;
  meals: Meal[];
}