import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { ContactType, LeadSource } from '@/types';

const createContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['customer', 'lead'] as const),
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
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as ContactType | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .eq('org_id', user.orgId);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
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

    const validation = await validateRequest(request, createContactSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { data, error } = await supabase
      .from('contacts')
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
