import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native'
import { calculateCalories, calculateDistance } from '../utils/stepCalculations'

const STEP_NOTIFICATION_ID = 'live_step_counter_notification'
const CHANNEL_ID = 'step_tracker_channel'

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const settings = await notifee.requestPermission()
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    )
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return false
  }
}

export const initStepNotificationChannel = async () => {
  try {
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'شمارنده گام زنده',
      importance: AndroidImportance.LOW,
      vibration: false,
      lights: false,
    })
  } catch (error) {
    console.error('Error creating channel:', error)
  }
}

export const updateStepNotification = async (steps: number, goal: number) => {
  try {
    const safeGoal = goal > 0 ? goal : 10000
    const safeSteps = typeof steps === 'number' && !isNaN(steps) ? steps : 0

    const distance = calculateDistance(safeSteps).toFixed(2)
    const calories = Math.round(calculateCalories(safeSteps))
    const percentage = Math.min(Math.round((safeSteps / safeGoal) * 100), 100)

    await notifee.displayNotification({
      id: STEP_NOTIFICATION_ID,
      title: `🏃‍♂️ ${safeSteps.toLocaleString('fa-IR')} / ${safeGoal.toLocaleString('fa-IR')} گام`,
      body: `📍 ${distance} کیلومتر   |   🔥 ${calories} کالری   (${percentage}٪)`,
      android: {
        channelId: CHANNEL_ID,
        ongoing: true,
        autoCancel: false,
        colorized:true,
        onlyAlertOnce: true,
        asForegroundService:true,
        
        color: '#4F46E5',
        smallIcon:"ic_notification", 
        progress: {
          max: safeGoal,
          current: Math.min(safeSteps, safeGoal),
          indeterminate: false,
        },
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        summaryArgument: `${safeSteps} گام`,
      },
    })
  } catch (error) {
    console.error('Failed to display step notification:', error)
  }
}

export const cancelStepNotification = async () => {
  try {
    await notifee.cancelNotification(STEP_NOTIFICATION_ID)
  } catch (error) {
    console.error('Failed to cancel notification:', error)
  }
}
