import * as Sentry from '@sentry/nextjs';

export function captureApiError(error: unknown, context?: Record<string, unknown>) {
  console.error('[API Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}

export function captureValidationError(error: unknown, context?: Record<string, unknown>) {
  console.warn('[Validation Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'validation' },
      extra: context
    });
  }
}

export function captureAuthError(error: unknown, context?: Record<string, unknown>) {
  console.error('[Auth Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'authentication' },
      extra: context
    });
  }
}

export function captureDatabaseError(error: unknown, context?: Record<string, unknown>) {
  console.error('[Database Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'database' },
      extra: context
    });
  }
}

export function capturePaymentError(error: unknown, context?: Record<string, unknown>) {
  console.error('[Payment Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'payment' },
      extra: context
    });
  }
}

export function captureWebhookError(error: unknown, context?: Record<string, unknown>) {
  console.error('[Webhook Error]', error);

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: { errorType: 'webhook' },
      extra: context
    });
  }
}

export function createErrorResponse(message: string, status: number = 500) {
  return {
    data: null,
    error: message,
    meta: {
      code: `ERROR_${status}`,
    },
  };
}

export function extractErrorContext(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }

  if (typeof error === 'object' && error !== null) {
    return {
      ...error,
    };
  }

  return {
    error: String(error),
  };
}
