// backend/src/lib/appError.ts
export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
export const notFound = (msg = "NotFound") => new AppError(404, msg, "NOT_FOUND");
export const badRequest = (msg = "BadRequest", details?: unknown) => new AppError(400, msg, "BAD_REQUEST", details);
