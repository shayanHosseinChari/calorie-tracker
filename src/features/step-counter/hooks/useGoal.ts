import { useCallback, useEffect, useState } from 'react'
import { storage } from '../storage/storage'

export const useGoal = () => {
  const [goal, setGoalState] = useState(10000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    storage.getGoal().then(g => {
      setGoalState(g)
      setLoading(false)
    })
  }, [])

  const setGoal = useCallback(async (value: number) => {
    const safe = Math.max(100, Math.min(100000, Math.round(value)))
    setGoalState(safe)
    await storage.setGoal(safe)
  }, [])

  return { goal, setGoal, loading }
}