import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { ActivityType } from '@/types';

const createActivitySchema = z.object({
  deal_id: z.string().optional(),
  contact_id: z.string().optional(),
  type: z.enum(['call', 'email', 'meeting', 'note', 'estimate', 'payment'] as const),
  description: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const searchParams = request.nextUrl.searchParams;
    const dealId = searchParams.get('deal_id');
    const contactId = searchParams.get('contact_id');
    const type = searchParams.get('type') as ActivityType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('activities')
      .select('*', { count: 'exact' })
      .eq('org_id', user.orgId);

    if (dealId) {
      query = query.eq('deal_id', dealId);
    }

    if (contactId) {
      query = query.eq('contact_id', contactId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(data || [], 200, {
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, createActivitySchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    // At least one of deal_id or contact_id must be provided
    if (!validation.data.deal_id && !validation.data.contact_id) {
      return apiError('Either deal_id or contact_id is required', 400);
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        org_id: user.orgId,
        ...validation.data,
      })
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(data, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
