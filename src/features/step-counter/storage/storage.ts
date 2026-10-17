import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  GOAL: '@step_counter/goal',
  TODAY_STEPS: '@step_counter/today_steps',
  LAST_RESET: '@step_counter/last_reset',
  STEP_OFFSET: '@step_counter/step_offset',
} as const

export const storage = {
  async getGoal(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.GOAL)
    return value ? Number(value) : 10000
  },
  async setGoal(goal: number) {
    await AsyncStorage.setItem(KEYS.GOAL, String(goal))
  },
  async getTodaySteps(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.TODAY_STEPS)
    return value ? Number(value) : 0
  },
  async setTodaySteps(steps: number) {
    await AsyncStorage.setItem(KEYS.TODAY_STEPS, String(steps))
  },
  async getStepOffset(): Promise<number> {
    const value = await AsyncStorage.getItem(KEYS.STEP_OFFSET)
    return value ? Number(value) : 0
  },
  async setStepOffset(offset: number) {
    await AsyncStorage.setItem(KEYS.STEP_OFFSET, String(offset))
  },
  async getLastReset(): Promise<string | null> {
    return AsyncStorage.getItem(KEYS.LAST_RESET)
  },
  async setLastReset(date: string) {
    await AsyncStorage.setItem(KEYS.LAST_RESET, date)
  },
  async clearToday() {
    await AsyncStorage.removeMany([KEYS.TODAY_STEPS, KEYS.LAST_RESET])
  },
}