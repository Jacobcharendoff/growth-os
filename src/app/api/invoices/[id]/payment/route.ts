import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';

const recordPaymentSchema = z.object({
  amount: z.number().min(0.01),
  notes: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);
    const { id } = await params;

    const validation = await validateRequest(request, recordPaymentSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    // Get current invoice
    const { data: invoice, error: getError } = await supabase
      .from('invoices')
      .select('amount_paid, total, status')
      .eq('id', id)
      .eq('org_id', user.orgId)
      .single();

    if (getError || !invoice) {
      return apiError('Invoice not found', 404);
    }

    const newAmountPaid = invoice.amount_paid + validation.data.amount;
    let newStatus = invoice.status;

    // Auto-update status
    if (newAmountPaid >= invoice.total) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partial';
    }

    const { data, error } = await supabase
      .from('invoices')
      .update({
        amount_paid: newAmountPaid,
        status: newStatus,
        paid_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    return apiSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
