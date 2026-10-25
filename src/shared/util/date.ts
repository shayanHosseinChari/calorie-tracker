/**
 * تبدیل Date به فرمت YYYY-MM-DD که سرور FastAPI انتظار دارد.
 * از toISOString استفاده نمی‌کنیم چون UTC برمی‌گرداند و ممکن است
 * برای کاربرانی که در timezone دیگری هستند، روز اشتباه شود.
 */
export function toApiDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * معکوس: رشته YYYY-MM-DD را به Date محلی تبدیل می‌کند.
 */
export function fromApiDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}