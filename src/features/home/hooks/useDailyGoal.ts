import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileContext } from '@/features/profile/context/ProfileContext';
import { calculateDailyCalories, type ActivityLevel } from '../utils/calorieCalculator';

const DAILY_GOAL_KEY = '@home/dailyGoal';
const ACTIVITY_KEY = '@home/activityLevel';

export function useDailyGoal() {
  const { profile } = useProfileContext();
  const [dailyGoal, setDailyGoal] = useState<number | undefined>();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // بارگذاری از AsyncStorage
  useEffect(() => {
    (async () => {
      const [savedGoal, savedActivity] = await Promise.all([
        AsyncStorage.getItem(DAILY_GOAL_KEY),
        AsyncStorage.getItem(ACTIVITY_KEY),
      ]);
      if (savedGoal) setDailyGoal(Number(savedGoal));
      if (savedActivity) setActivityLevel(savedActivity as ActivityLevel);
    })();
  }, []);

  // اگر goal ذخیره نشده و profile داریم، محاسبه کن
  useEffect(() => {
    if (dailyGoal != null || !profile) return;

    const result = calculateDailyCalories({
      gender: profile.gender === 1 ? 'male' : 'female',
      weightKg: profile.weight,
      heightCm: profile.height,
      age: profile.age,
      activityLevel,
    });

    setDailyGoal(result.dailyGoal);
    AsyncStorage.setItem(DAILY_GOAL_KEY, String(result.dailyGoal));
  }, [profile, dailyGoal, activityLevel]);

  // تغییر سطح فعالیت (از UI) → دوباره محاسبه و ذخیره
  const updateActivityLevel = async (level: ActivityLevel) => {
    setActivityLevel(level);
    await AsyncStorage.setItem(ACTIVITY_KEY, level);

    if (!profile) return;
    const result = calculateDailyCalories({
      gender: profile.gender === 1 ? 'male' : 'female',
      weightKg: profile.weight,
      heightCm: profile.height,
      age: profile.age,
      activityLevel: level,
    });
    setDailyGoal(result.dailyGoal);
    await AsyncStorage.setItem(DAILY_GOAL_KEY, String(result.dailyGoal));
  };

  return { dailyGoal, activityLevel, updateActivityLevel };
}