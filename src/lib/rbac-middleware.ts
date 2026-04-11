/**
 * RBAC Middleware Utilities
 *
 * Helper functions for protecting API routes with permission checks.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Role, Resource, Action, hasPermission as checkPermission } from '@/lib/rbac';

export interface AuthenticatedUser {
  userId: string;
  orgId: string;
  email: string;
  role: Role;
}

export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

/**
 * Middleware to check if a user has permission to perform an action.
 * Throws an error with status code if permission is denied.
 *
 * @throws Error with specific message for permission denied
 *
 * @example
 * ```ts
 * export async function PATCH(request, { params }) {
 *   const supabase = await createServerComponentClient();
 *   const user = await getCurrentUser(supabase);
 *   await requirePermission(user, 'invoices', 'update');
 *   // ... rest of handler
 * }
 * ```
 */
export async function requirePermission(
  user: AuthenticatedUser,
  resource: Resource,
  action: Action
): Promise<void> {
  if (!checkPermission(user.role as Role, resource, action)) {
    const message = `You do not have permission to ${action} ${resource}`;
    throw new HttpError(message, 403);
  }
}

/**
 * Middleware to check if a user has at least read access to a resource.
 * Throws an error with status code if access is denied.
 *
 * @throws Error with specific message for access denied
 */
export async function requireAccess(
  user: AuthenticatedUser,
  resource: Resource
): Promise<void> {
  if (!checkPermission(user.role as Role, resource, 'read')) {
    const message = `You do not have permission to access ${resource}`;
    throw new HttpError(message, 403);
  }
}

/**
 * Higher-order function to wrap an API route handler with permission checks.
 * Returns a new handler that validates permissions before calling the original.
 *
 * @example
 * ```ts
 * const deleteInvoiceHandler = withPermissionCheck(
 *   async (req, res, user) => {
 *     // ... delete logic
 *   },
 *   'invoices',
 *   'delete'
 * );
 * ```
 */
export function withPermissionCheck<T, Args extends unknown[]>(
  handler: (user: AuthenticatedUser, ...args: Args) => Promise<T>,
  resource: Resource,
  action: Action
) {
  return async (user: AuthenticatedUser, ...args: Args): Promise<T> => {
    await requirePermission(user, resource, action);
    return handler(user, ...args);
  };
}

/**
 * Type guard to check if an error has a status code.
 */
export function isAuthError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}
