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

const createPaymentIntentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().min(1),
  currency: z.enum(['cad', 'usd']).default('cad'),
});

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, createPaymentIntentSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const stripe = getStripe();
    if (!stripe) {
      return apiError('Stripe is not configured', 503);
    }

    const { invoiceId, amount, currency } = validation.data;

    // Get invoice from Supabase to verify it exists and belongs to this org
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, org_id, total, amount_paid')
      .eq('id', invoiceId)
      .eq('org_id', user.orgId)
      .single();

    if (invoiceError || !invoice) {
      return apiError('Invoice not found', 404);
    }

    // Verify the amount matches what's expected (remaining balance)
    const remainingBalance = parseFloat(invoice.total.toString()) - parseFloat(invoice.amount_paid.toString());
    if (Math.abs(amount - remainingBalance) > 0.01) {
      // Allow small floating point differences
      return apiError('Payment amount does not match invoice balance', 400);
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        invoiceId,
        orgId: user.orgId,
      },
    });

    const response: CreatePaymentIntentResponse = {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };

    return apiSuccess(response, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
