import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';

const tierSchema = z.object({
  name: z.enum(['Good', 'Better', 'Best']),
  description: z.string(),
  price: z.number().min(0),
  features: z.array(z.string()),
});

const updateEstimateSchema = z.object({
  customer_name: z.string().min(1).optional(),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().optional(),
  service: z.string().min(1).optional(),
  description: z.string().optional(),
  tiers: z.array(tierSchema).optional(),
  selected_tier: z.enum(['Good', 'Better', 'Best']).optional().nullable(),
  status: z.enum(['draft', 'sent', 'viewed', 'approved', 'rejected', 'expired']).optional(),
  notes: z.string().optional(),
  valid_days: z.number().min(1).optional(),
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
      .from('estimates')
      .select('*')
      .eq('id', id)
      .eq('org_id', user.orgId)
      .single();

    if (error) {
      return apiError(error.message, 404);
    }

    if (!data) {
      return apiError('Estimate not found', 404);
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

    const validation = await validateRequest(request, updateEstimateSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const updates: Record<string, unknown> = { ...validation.data };

    if (validation.data.status === 'sent' && !updates.sent_at) {
      updates.sent_at = new Date().toISOString();
    }
    if (validation.data.status === 'viewed' && !updates.viewed_at) {
      updates.viewed_at = new Date().toISOString();
    }
    if (validation.data.status === 'approved' && !updates.responded_at) {
      updates.responded_at = new Date().toISOString();
    }
    if (validation.data.status === 'rejected' && !updates.responded_at) {
      updates.responded_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('estimates')
      .update(updates)
      .eq('id', id)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError('Estimate not found', 404);
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
      .from('estimates')
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
