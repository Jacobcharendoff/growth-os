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

const updateInvoiceSchema = z.object({
  customer_name: z.string().min(1).optional(),
  customer_email: z.string().email().optional(),
  customer_address: z.string().optional(),
  line_items: z.array(lineItemSchema).optional(),
  tax_rate: z.number().min(0).max(1).optional(),
  status: z.enum(['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue']).optional(),
  notes: z.string().optional(),
  due_date: z.number().optional(),
  province: z.string().optional(),
  tax_type: z.string().optional(),
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
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('org_id', user.orgId)
      .single();

    if (error) {
      return apiError(error.message, 404);
    }

    if (!data) {
      return apiError('Invoice not found', 404);
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

    const validation = await validateRequest(request, updateInvoiceSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const updates: Record<string, any> = { ...validation.data };

    // Recalculate totals if line items or tax rate changed
    if (validation.data.line_items || validation.data.tax_rate) {
      const { data: currentInvoice } = await supabase
        .from('invoices')
        .select('line_items, tax_rate')
        .eq('id', id)
        .eq('org_id', user.orgId)
        .single();

      const lineItems = validation.data.line_items || currentInvoice?.line_items || [];
      const taxRate = validation.data.tax_rate ?? currentInvoice?.tax_rate ?? 0;

      const subtotal = lineItems.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unit_price,
        0
      );
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount;

      updates.subtotal = subtotal;
      updates.tax_amount = taxAmount;
      updates.total = total;
    }

    // Handle status transitions
    if (validation.data.status === 'sent' && !updates.sent_at) {
      updates.sent_at = new Date().toISOString();
    }
    if (validation.data.status === 'viewed' && !updates.viewed_at) {
      updates.viewed_at = new Date().toISOString();
    }
    if ((validation.data.status === 'paid' || validation.data.status === 'partial') && !updates.paid_at) {
      updates.paid_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError('Invoice not found', 404);
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
      .from('invoices')
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
