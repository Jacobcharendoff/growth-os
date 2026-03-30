import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';

const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
});

const createInvoiceSchema = z.object({
  contact_id: z.string().min(1),
  deal_id: z.string().optional(),
  estimate_id: z.string().optional(),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_address: z.string(),
  line_items: z.array(lineItemSchema).min(1),
  tax_rate: z.number().min(0).max(1),
  notes: z.string().optional(),
  due_date: z.number(),
  province: z.string(),
  tax_type: z.string(),
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
      .from('invoices')
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

    const validation = await validateRequest(request, createInvoiceSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    // Calculate totals
    const subtotal = validation.data.line_items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const taxAmount = subtotal * validation.data.tax_rate;
    const total = subtotal + taxAmount;

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        org_id: user.orgId,
        status: 'draft',
        subtotal,
        tax_amount: taxAmount,
        total,
        amount_paid: 0,
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
