import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { PipelineStage, LeadSource } from '@/types';

const createDealSchema = z.object({
  contact_id: z.string().min(1),
  title: z.string().min(1),
  value: z.number().min(0),
  stage: z.enum([
    'new_lead',
    'contacted',
    'estimate_scheduled',
    'estimate_sent',
    'booked',
    'in_progress',
    'completed',
    'invoiced',
  ] as const),
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
  ] as const),
  assigned_to: z.string().optional(),
  notes: z.string().optional(),
  scheduled_date: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const stage = searchParams.get('stage') as PipelineStage | null;
    const contactId = searchParams.get('contact_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' })
      .eq('org_id', user.orgId);

    if (stage) {
      query = query.eq('stage', stage);
    }

    if (contactId) {
      query = query.eq('contact_id', contactId);
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

    const validation = await validateRequest(request, createDealSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { data, error } = await supabase
      .from('deals')
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
