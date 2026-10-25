import axios from 'axios';
import { API_BASE_URL } from './config';
import { tokenStorage } from '@/shared/auth/tokenStorage';
import { emitUnauthorized } from '@/shared/auth/authEvents';
import type { ApiError } from './types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── نگاشت پیام‌های سرور به پیام‌های دوستانه ──────────────
const STATUS_FALLBACK: Record<number, string> = {
  400: 'درخواست نامعتبر است.',
  401: 'نشست شما منقضی شده است. دوباره وارد شوید.',
  403: 'اجازه دسترسی به این بخش را ندارید.',
  404: 'موردی که دنبالش بودید پیدا نشد.',
  409: 'این اطلاعات قبلاً ثبت شده است.',
  422: 'اطلاعات وارد شده معتبر نیست.',
  500: 'خطای سرور. لطفاً بعداً تلاش کنید.',
};

function parseDetail(detail: unknown): {
  message: string;
  fields?: Record<string, string>;
} {
  // حالت ۱: رشته (400, 401, 404, 409, ...)
  if (typeof detail === 'string') {
    return { message: detail };
  }

  // حالت ۲: آرایه (422 FastAPI validation)
  if (Array.isArray(detail)) {
    const fields: Record<string, string> = {};
    const messages: string[] = [];

    for (const item of detail) {
      if (!item || typeof item !== 'object') continue;
      const msg = (item as any).msg as string | undefined;
      const loc = (item as any).loc as (string | number)[] | undefined;

      // آخرین عضو loc معمولاً نام فیلد است
      const fieldName =
        Array.isArray(loc) && loc.length > 0 ? String(loc[loc.length - 1]) : undefined;

      if (fieldName && msg) {
        fields[fieldName] = msg;
      }
      if (msg) messages.push(msg);
    }

    return {
      message: messages.length
        ? messages.join(' • ')
        : 'اطلاعات وارد شده معتبر نیست.',
      fields: Object.keys(fields).length ? fields : undefined,
    };
  }

  // حالت ۳: آبجکت نامشخص
  if (detail && typeof detail === 'object') {
    const anyDetail = detail as any;
    if (typeof anyDetail.message === 'string') {
      return { message: anyDetail.message };
    }
  }

  return { message: '' };
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!error.response) {
      if (axios.isCancel(error)) {
        return Promise.reject({
          message: 'درخواست لغو شد.',
          code: 'CANCELLED',
          raw: error,
        } satisfies ApiError);
      }

      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          message: 'زمان پاسخ‌گویی سرور به پایان رسید.',
          code: 'TIMEOUT',
          raw: error,
        } satisfies ApiError);
      }

      return Promise.reject({
        message: 'اتصال به سرور برقرار نشد. اینترنت را بررسی کنید.',
        code: 'NETWORK_ERROR',
        raw: error,
      } satisfies ApiError);
    }

    const status: number = error.response.status;
    const data = error.response.data;

    // ─── 401 → logout خودکار ─────────────────────────────
    if (status === 401) {
      await tokenStorage.clearToken();
      emitUnauthorized();
    }

    // ─── استخراج پیام از detail ───────────────────────────
    const detail = data?.detail;
    const parsed = parseDetail(detail);

    const message =
      parsed.message ||
      (data?.message as string | undefined) ||
      STATUS_FALLBACK[status] ||
      'خطای ناشناخته‌ای رخ داد.';

    const apiError: ApiError = {
      message,
      status,
      code: data?.code as string | undefined,
      fields: parsed.fields,
      raw: data,
    };

    return Promise.reject(apiError);
  }
);