import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  isStepCountingSupported,
  startStepCounterUpdate,
  stopStepCounterUpdate,
  type StepCountData,
} from '@blife/rn-step-counter';
import {
  calculateActiveMinutes,
  calculateCalories,
  calculateDistance,
} from '../utils/stepCalculations';
import type { StepCounterStatus, StepData } from '../types';
import {
  startBackgroundStepCounter,
  stopBackgroundStepCounter,
} from '../services/backgroundService';
import { refreshStepWidget } from '../services/widgetService';
import {
  initStepNotificationChannel,
  requestNotificationPermission,
  updateStepNotification,
  cancelStepNotification,
} from '../services/stepNotificationService';
import { storage } from '../storage/storage';

export const useStepCounter = (goal: number) => {
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState<StepCounterStatus>('loading');
  const isActiveRef = useRef(true);
  const goalRef = useRef(goal);
  const isBackgroundRef = useRef(false);

  const stepsRef = useRef(0);   // مقدار نمایشی (خام - آفست)
  const rawRef = useRef(0);     // آخرین مقدار خام سنسور (از ابتدای امروز)
  const offsetRef = useRef(0);  // مقدار خام در لحظه‌ی آخرین ریست

  const notifBusyRef = useRef(false);
  const notifPendingRef = useRef<number | null>(null);

  useEffect(() => {
    goalRef.current = goal;
  }, [goal]);

  // آپدیت‌های نوتیفیکیشن سریالی؛ همیشه آخرین مقدار ارسال می‌شود
  const pushNotification = useCallback(async (value: number) => {
    if (notifBusyRef.current) {
      notifPendingRef.current = value;
      return;
    }
    notifBusyRef.current = true;
    try {
      let next: number | null = value;
      while (next !== null) {
        notifPendingRef.current = null;
        try {
          await updateStepNotification(next, goalRef.current);
        } catch (e) {
          console.log('[step-counter] updateStepNotification failed', e);
        }
        next = notifPendingRef.current;
      }
    } finally {
      notifBusyRef.current = false;
    }
  }, []);

  // ورودی: مقدار خام سنسور (هم از فورگراند هم از بک‌گراند)
  const applyRaw = useCallback(
    (raw: number) => {
      if (!isActiveRef.current) return;

      // مقدار خام تجمعی نباید کم شود؛ مقدار قدیمی/نامرتب را نادیده بگیر
      if (raw < rawRef.current) return;
      rawRef.current = raw;

      // اگر آفست از مقدار خام بیشتر شد (روز جدید/ریبوت)، آفست را صفر کن
      if (offsetRef.current > raw) {
        offsetRef.current = 0;
        storage.setStepOffset(0);
      }

      const value = Math.max(0, raw - offsetRef.current);
      if (value === stepsRef.current) return;

      stepsRef.current = value;
      setSteps(value);
      storage.setTodaySteps(value);
      refreshStepWidget(value, goalRef.current);

      if (isBackgroundRef.current) {
        pushNotification(value);
      }
    },
    [pushNotification],
  );

  useEffect(() => {
    isActiveRef.current = true;

    const setup = async () => {
      const { supported, granted } = await isStepCountingSupported();

      if (!supported) {
        setStatus('unsupported');
        return;
      }
      if (!granted) {
        setStatus('denied');
        return;
      }

      try {
        const notifGranted = await requestNotificationPermission();
        if (!notifGranted) {
          console.log('[step-counter] notification permission denied');
        }
        await initStepNotificationChannel();
      } catch (e) {
        console.log('[step-counter] notification setup failed', e);
      }

     let savedOffset = 0;
try {
  const fn = (storage as any).getStepOffset;
  savedOffset = typeof fn === 'function' ? Number(await fn.call(storage)) || 0 : 0;
} catch (e) {
  console.log('[step-counter] getStepOffset failed', e);
}
offsetRef.current = savedOffset;
      stepsRef.current = savedOffset;
      if (isActiveRef.current) setSteps(savedOffset);
      setStatus('active');

      // شروع از ابتدای امروز تا مقدار خام با آفست هم‌خوان باشد
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

     startStepCounterUpdate(new Date(), (data: StepCountData) => {
  console.log('[step-counter] raw', data.steps, 'offset', offsetRef.current);
  applyRaw(data.steps);
});

      await startBackgroundStepCounter((todaySteps) => {
        applyRaw(todaySteps);
      });
    };

    setup().catch((e) => {
      console.log('[step-counter] setup failed', e);
      setStatus('unsupported');
    });

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        isBackgroundRef.current = false;
        try {
          await cancelStepNotification();
        } catch (e) {
          console.log('[step-counter] cancelStepNotification failed', e);
        }
        if (isActiveRef.current) {
          setSteps(stepsRef.current);
          refreshStepWidget(stepsRef.current, goalRef.current);
        }
      } else if (nextAppState === 'background') {
        isBackgroundRef.current = true;
        pushNotification(stepsRef.current);
      }
    };

    const appStateSub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isActiveRef.current = false;
      appStateSub.remove();
      stopStepCounterUpdate();
      stopBackgroundStepCounter();
      cancelStepNotification();
    };
  }, [applyRaw, pushNotification]);

  // فقط وقتی هدف یا وضعیت عوض شد ویجت رفرش شود
  useEffect(() => {
    if (status === 'active') {
      refreshStepWidget(stepsRef.current, goal);
    }
  }, [goal, status]);

  const reset = useCallback(async () => {
    // همگام (قبل از هر await) تا رویدادهای در راه، عدد قبلی را برنگردانند
    offsetRef.current = rawRef.current;
    stepsRef.current = 0;
    setSteps(0);

    await storage.setTodaySteps(0);
    await storage.clearToday();
    await storage.setStepOffset(offsetRef.current); // بعد از clearToday تا پاک نشود
    await refreshStepWidget(0, goal);

    if (isBackgroundRef.current) pushNotification(0);
  }, [goal, pushNotification]);

  const data: StepData = {
    steps,
    distanceKm: Number(calculateDistance(steps).toFixed(2)),
    calories: Math.round(calculateCalories(steps)),
    activeMinutes: calculateActiveMinutes(steps),
  };

  const progress = goal > 0 ? Math.min(steps / goal, 1) : 0;

  return { data, progress, status, reset };
};
