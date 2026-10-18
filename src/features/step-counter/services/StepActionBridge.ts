// src/services/stepActionBridge.ts
import { updateStepNotification } from './stepNotificationService'

type StepActionHandlers = {
  getSteps: () => number
  getGoal: () => number
  isPaused: () => boolean
  togglePause: () => Promise<void>
  reset: () => Promise<void>
}

let handlers: StepActionHandlers | null = null

export const registerStepActionHandlers = (h: StepActionHandlers) => {
  handlers = h
}

export const getStepActionHandlers = () => handlers

/**
 * وقتی کاربر روی اکشن نوتیفیکیشن می‌زند، این تابع از index.js صدا زده می‌شود
 */
export const handleStepAction = async (actionId?: string) => {
  if (!handlers || !actionId) return

  switch (actionId) {
    case 'pause_tracking': {
      await handlers.togglePause()
      break
    }
    case 'reset_steps': {
      await handlers.reset()
      break
    }
    case 'open_app':
      break
  }

  await updateStepNotification(
    handlers.getSteps(),
    handlers.getGoal(),
    handlers.isPaused()
  )
}