import React, { createContext, useContext, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import type { Profile } from '../types';
import { calculateCalorieTargets, CalorieTargets } from '../utils/caloriesCalculator';

type ProfileContextValue = {
  profile: Profile | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  calorieTargets: CalorieTargets | null;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, error, refetch } = useProfile();

  const calorieTargets = useMemo<CalorieTargets | null>(() => {
    if (!data) return null;
    return calculateCalorieTargets({
      gender: data.gender,
      weightKg: data.weight,
      heightCm: data.height,
      age: data.age,
      activityLevel: data.activity_level,
    });
  }, [data]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile: data ?? null,
      isLoading,
      isError,
      error,
      refetch,
      calorieTargets,
    }),
    [data, isLoading, isError, error, refetch, calorieTargets]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used within ProfileProvider');
  return ctx;
}