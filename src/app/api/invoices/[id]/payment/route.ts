import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { getStripe } from '@/lib/stripe';

const recordPaymentSchema = z.object({
  amount: z.number().min(0.01),
  notes: z.string().optional(),
  useStripe: z.boolean().optional(),
  currency: z.enum(['cad', 'usd']).default('cad').optional(),
});

interface PaymentResponse {
  invoice?: Record<string, unknown>;
  clientSecret?: string;
  paymentIntentId?: string;
}

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

    const { data: invoice, error: getError } = await supabase
      .from('invoices')
      .select('amount_paid, total, status')
      .eq('id', id)
      .eq('org_id', user.orgId)
      .single();

    if (getError || !invoice) {
      return apiError('Invoice not found', 404);
    }

    const stripe = getStripe();
    if (validation.data.useStripe && stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(validation.data.amount * 100),
        currency: (validation.data.currency || 'cad').toLowerCase(),
        metadata: {
          invoiceId: id,
          orgId: user.orgId,
        },
      });

      const response: PaymentResponse = {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      };

      return apiSuccess(response, 200);
    }

    const newAmountPaid = parseFloat(invoice.amount_paid.toString()) + validation.data.amount;
    let newStatus = invoice.status;

    if (newAmountPaid >= parseFloat(invoice.total.toString())) {
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

    const response: PaymentResponse = { invoice: data };
    return apiSuccess(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
