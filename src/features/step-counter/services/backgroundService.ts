import BackgroundService from 'react-native-background-actions'
import { startStepCounterUpdate } from '@blife/rn-step-counter'
import { refreshStepWidget } from './widgetService'
import { storage } from '../storage/storage'

const options = {
  taskName: 'StepCounter',
  taskTitle: 'قدم‌شمار فعال است',
  taskDesc: 'در حال شمارش قدم‌های شما...',
  taskIcon: { name: 'ic_launcher', type: 'mipmap' },
  color: '#FFA83F',
  linkingURI: 'yourapp://stepcounter',
}

export const startBackgroundStepCounter = async (
  onStepUpdate: (steps: number, goal: number) => void,
) => {
  await BackgroundService.start(async () => {
    const goal = await storage.getGoal()
    const offset = await storage.getStepOffset()

    startStepCounterUpdate(new Date(), async (data) => {
      // قدم‌های امروز = قدم‌های سنسور - آفست روز قبل
      const todaySteps = Math.max(0, data.steps - offset)

      await storage.setTodaySteps(todaySteps)
      await refreshStepWidget(todaySteps, goal)
      onStepUpdate(todaySteps, goal)
    })
  }, options)
}

export const stopBackgroundStepCounter = async () => {
  await BackgroundService.stop()
}