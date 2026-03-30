import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';

const updateContactSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['customer', 'lead'] as const).optional(),
  source: z.enum([
    'existing_customer',
    'reactivation',
    'cross_sell',
    'referral',
    'review',
    'neighborhood',
    'google_lsa',
    'seo',
    'gbp',
  ] as const).optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id } = await params;

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .eq('org_id', user.orgId)
      .single();

    if (error) {
      return apiError(error.message, 404);
    }

    if (!data) {
      return apiError('Contact not found', 404);
    }

    return apiSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id } = await params;

    const validation = await validateRequest(request, updateContactSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(validation.data)
      .eq('id', id)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError('Contact not found', 404);
    }

    return apiSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id } = await params;

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('org_id', user.orgId);

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(null, 204);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
