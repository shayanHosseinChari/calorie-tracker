const STEP_TO_METER = 0.762
const STEP_TO_CALORIE = 0.04
const STEPS_PER_ACTIVE_MINUTE = 100

export const calculateDistance = (steps: number): number => {
  return (steps * STEP_TO_METER) / 1000
}

export const calculateCalories = (steps: number, weightKg = 70): number => {
  return steps * STEP_TO_CALORIE * (weightKg / 70)
}

export const calculateActiveMinutes = (steps: number): number => {
  return Math.floor(steps / STEPS_PER_ACTIVE_MINUTE)
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR')
}