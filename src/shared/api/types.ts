export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  fields?: Record<string, string>; // برای خطاهای validation
  raw?: unknown;
}

// ساختار detail در FastAPI
type FastApiDetail =
  | string
  | Array<{ loc: (string | number)[]; msg: string; type: string }>;