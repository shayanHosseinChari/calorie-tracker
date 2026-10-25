import type { ActivityLevel, Gender } from '@/shared/types/activity';

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
  gender: Gender;
  height: number;
  weight: number;
  name: string;
  birth_year: number;
  activity_level: ActivityLevel;
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
}