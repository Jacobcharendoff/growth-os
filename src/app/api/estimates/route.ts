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

const createEstimateSchema = z.object({
  contact_id: z.string().min(1),
  deal_id: z.string().optional(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string(),
  service: z.string().min(1),
  description: z.string(),
  tiers: z.array(tierSchema).min(1),
  notes: z.string().optional(),
  valid_days: z.number().min(1).default(30),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const contactId = searchParams.get('contact_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('estimates')
      .select('*', { count: 'exact' })
      .eq('org_id', user.orgId);

    if (status) {
      query = query.eq('status', status);
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

    const validation = await validateRequest(request, createEstimateSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { data, error } = await supabase
      .from('estimates')
      .insert({
        org_id: user.orgId,
        status: 'draft',
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
