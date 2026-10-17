export type StepData = {
  steps: number
  distanceKm: number
  calories: number
  activeMinutes: number
}

export type StepCounterStatus = 'idle' | 'loading' | 'active' | 'denied' | 'unsupported'