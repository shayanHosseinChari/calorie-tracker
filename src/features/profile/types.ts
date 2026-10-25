import type { ActivityLevel, Gender } from '@/shared/types/activity';

export interface Profile {
  id: number;
  phone: string;
  name: string;
  gender: Gender;
  height: number;
  weight: number;
  birth_year: number;
  age: number;
  activity_level: ActivityLevel;
}

export interface UpdateProfilePayload {
  height?: number;
  weight?: number;
  age?: number;
  gender?: Gender;
  activity_level?: ActivityLevel;
}