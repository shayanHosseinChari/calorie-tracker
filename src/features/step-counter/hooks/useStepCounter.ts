import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isStepCountingSupported,
  stopStepCounterUpdate,
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
import { storage } from '../storage/storage'

export const useStepCounter = (goal: number) => {
  const [steps, setSteps] = useState(0)
  const [status, setStatus] = useState<StepCounterStatus>('loading')
  const isActiveRef = useRef(true)

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

      const saved = await storage.getTodaySteps()
      if (isActiveRef.current) setSteps(saved)

      setStatus('active')

      await startBackgroundStepCounter((todaySteps, currentGoal) => {
        
        if (isActiveRef.current) setSteps(todaySteps)
        refreshStepWidget(todaySteps, currentGoal)
      })
    }

    setup().catch(() => setStatus('unsupported'))

    return () => {
      isActiveRef.current = false
      stopStepCounterUpdate()
      stopBackgroundStepCounter()
    }
  }, [])

  useEffect(() => {
    if (status === 'active') {
      refreshStepWidget(steps, goal)
    }
  }, [goal, steps, status])

 const reset = useCallback(async () => {
  // ۱. متوقف کردن شمارش فعلی
  stopStepCounterUpdate()
  
  // ۲. صفر کردن state و استوریج
  setSteps(0)
  await storage.clearToday()
  await storage.setTodaySteps(0)
  await refreshStepWidget(0, goal)
  
  // ۳. شروع مجدد شمارش از همین لحظه
  // این کار باعث میشه baseline جدیدی در سطح نیتیو ست بشه
  await startBackgroundStepCounter((todaySteps, currentGoal) => {
    if (isActiveRef.current) setSteps(todaySteps)
    refreshStepWidget(todaySteps, currentGoal)
  })
}, [goal])

  const data: StepData = {
    steps,
    distanceKm: Number(calculateDistance(steps).toFixed(2)),
    calories: Math.round(calculateCalories(steps)),
    activeMinutes: calculateActiveMinutes(steps),
  }

  const progress = Math.min(steps / goal, 1)

  return { data, progress, status, reset }
}