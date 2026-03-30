import { NextResponse } from 'next/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

export interface ApiSuccessResponse<T> {
  data: T;
  error: null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiErrorResponse {
  data: null;
  error: string;
  meta?: {
    code?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Get current authenticated user and their org_id
 */
export async function getCurrentUser(supabase: SupabaseClient) {
  // Get auth user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Not authenticated');
  }

  // Get org_id from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    throw new Error('User record not found');
  }

  return {
    userId: user.id,
    orgId: userData.org_id,
    email: user.email,
  };
}

/**
 * Return an error response
 */
export function apiError(message: string, status: number = 400) {
  return NextResponse.json(
    {
      data: null,
      error: message,
    } as ApiErrorResponse,
    { status }
  );
}

/**
 * Return a success response
 */
export function apiSuccess<T>(
  data: T,
  status: number = 200,
  meta?: { total?: number; page?: number; limit?: number }
) {
  const response: ApiSuccessResponse<T> = {
    data,
    error: null,
  };
  if (meta) {
    response.meta = meta;
  }
  return NextResponse.json(response, { status });
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ valid: true; data: T } | { valid: false; error: string }> {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    return { valid: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod v4 uses .issues instead of .errors
      const issues = (error as any).issues || [];
      const message = issues
        .map((e: any) => `${(e.path || []).join('.')}: ${e.message}`)
        .join('; ');
      return { valid: false, error: message || error.message };
    }
    return { valid: false, error: 'Invalid request body' };
  }
}
