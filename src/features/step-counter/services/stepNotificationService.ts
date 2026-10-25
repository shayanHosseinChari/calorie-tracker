import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';

const CHANNEL_ID = 'step-counter';
const NOTIFICATION_ID = 'step-progress';

// ساخت کانال (فقط اندروید)
export async function initStepNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'شمارش قدم',
    importance: AndroidImportance.LOW,
  });
}

// درخواست مجوز — روی اندروید ۱۳+ واقعاً دیالوگ نشون میده، پایین‌تر خودکار AUTHORIZED برمی‌گرده
export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  // روی اندروید ۱۳+ اگه کاربر قبول کنه AUTHORIZED میشه
  // روی اندروید پایین‌تر همیشه AUTHORIZED (چون مجوز runtime وجود نداره)
  return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
}

// نمایش یا آپدیت نوتیفیکیشن
export async function updateStepNotification(steps: number, goal: number) {
  if (Platform.OS !== 'android') return;

  // اگه مجوز نداریم، بی‌صدا برگرد (روی اندروید ۱۳+ ممکنه کاربر رد کرده باشه)
  const settings = await notifee.getNotificationSettings();
  if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
    console.log('[step-notif] permission not granted, skipping');
    return;
  }

  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title: 'پیشرفت قدم‌های امروز',
    body: `${steps.toLocaleString('fa-IR')} از ${goal.toLocaleString('fa-IR')} قدم`,
    android: {
      channelId: CHANNEL_ID,
      ongoing: true,          
      onlyAlertOnce: true,   
      showTimestamp: false,
      smallIcon: 'ic_notification', 
      pressAction: { id: 'default' },
    },
  });
}

// حذف نوتیفیکیشن
export async function cancelStepNotification() {
  if (Platform.OS !== 'android') return;
  await notifee.cancelNotification(NOTIFICATION_ID);
}