import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import {
  isStepCountingSupported,
  startStepCounterUpdate,
  stopStepCounterUpdate,
  type StepCountData,
} from '@blife/rn-step-counter'
import {
  calculateActiveMinutes,
  calculateCalories,
  calculateDistance,
} from '../utils/stepCalculations'
import type { StepCounterStatus, StepData } from '../types'
import {
  startBackgroundStepCounter,
  stopBackgroundStepCounter,
} from '../services/backgroundService'
import { refreshStepWidget } from '../services/widgetService'
import {
  initStepNotificationChannel,
  requestNotificationPermission,
  updateStepNotification,
  cancelStepNotification,
} from '../services/stepNotificationService'
import { storage } from '../storage/storage'

export const useStepCounter = (goal: number) => {
  const [steps, setSteps] = useState(0)
  const [status, setStatus] = useState<StepCounterStatus>('loading')
  const isActiveRef = useRef(true)
  const goalRef = useRef(goal)
  const isBackgroundRef = useRef(false)

  useEffect(() => {
    goalRef.current = goal
  }, [goal])

  const applySteps = useCallback((newSteps: number) => {
    if (!isActiveRef.current) return
    setSteps(newSteps)
    storage.setTodaySteps(newSteps)
    refreshStepWidget(newSteps, goalRef.current)

    if (isBackgroundRef.current) {
      updateStepNotification(newSteps, goalRef.current)
    }
  }, [])

  useEffect(() => {
    isActiveRef.current = true

    const setup = async () => {
      const { supported, granted } = await isStepCountingSupported()

      if (!supported) {
        setStatus('unsupported')
        return
      }
      if (!granted) {
        setStatus('denied')
        return
      }

      // دریافت مجوز نوتیفیکیشن و راه‌اندازی کانال سیستمی
      await requestNotificationPermission()
      await initStepNotificationChannel()

      // بازیابی آخرین مقدار ثبت‌شده
      const saved = await storage.getTodaySteps()
      if (isActiveRef.current) setSteps(saved)
      setStatus('active')

      // ۱. راه‌اندازی سنسور زنده پیش‌زمینه (Foreground)
      startStepCounterUpdate(new Date(), (data: StepCountData) => {
        applySteps(data.steps)
      })

      await startBackgroundStepCounter((todaySteps, currentGoal) => {
        applySteps(todaySteps)
        refreshStepWidget(todaySteps, currentGoal)
      })
    }

    setup().catch(() => setStatus('unsupported'))

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        isBackgroundRef.current = false
        await cancelStepNotification()

        const latestSteps = await storage.getTodaySteps()
        if (isActiveRef.current) {
          setSteps(latestSteps)
          refreshStepWidget(latestSteps, goalRef.current)
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        isBackgroundRef.current = true
        const currentSteps = await storage.getTodaySteps()
        await updateStepNotification(currentSteps, goalRef.current)
      }
    }

    const appStateSub = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      isActiveRef.current = false
      appStateSub.remove()
      stopStepCounterUpdate()
      stopBackgroundStepCounter()
      cancelStepNotification()
    }
  }, [applySteps])

  useEffect(() => {
    if (status === 'active') {
      refreshStepWidget(steps, goal)
    }
  }, [goal, steps, status])

  const reset = useCallback(async () => {
    setSteps(0)
    await storage.setTodaySteps(0)
    await storage.setStepOffset(steps)
    await storage.clearToday()
    await refreshStepWidget(0, goal)
    if (isBackgroundRef.current) {
      await updateStepNotification(0, goal)
    }
  }, [steps, goal])

  const data: StepData = {
    steps,
    distanceKm: Number(calculateDistance(steps).toFixed(2)),
    calories: Math.round(calculateCalories(steps)),
    activeMinutes: calculateActiveMinutes(steps),
  }

  const progress = Math.min(steps / goal, 1)

  return { data, progress, status, reset }
}
