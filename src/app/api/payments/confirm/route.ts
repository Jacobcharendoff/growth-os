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

const confirmPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  paymentIntentId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, confirmPaymentSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const stripe = getStripe();
    if (!stripe) {
      return apiError('Stripe is not configured', 503);
    }

    const { invoiceId, paymentIntentId } = validation.data;

    // Retrieve the PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return apiError('Payment intent has not succeeded', 400);
    }

    // Get current invoice from Supabase
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('amount_paid, total')
      .eq('id', invoiceId)
      .eq('org_id', user.orgId)
      .single();

    if (invoiceError || !invoice) {
      return apiError('Invoice not found', 404);
    }

    // Calculate the payment amount from the PaymentIntent
    const paymentAmount = paymentIntent.amount / 100; // Convert from cents
    const newAmountPaid = parseFloat(invoice.amount_paid.toString()) + paymentAmount;
    let newStatus = 'partial';

    // Update status if fully paid
    if (newAmountPaid >= parseFloat(invoice.total.toString())) {
      newStatus = 'paid';
    }

    // Update invoice in Supabase
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({
        amount_paid: newAmountPaid,
        status: newStatus,
        stripe_payment_intent_id: paymentIntentId,
        paid_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (updateError) {
      return apiError(updateError.message, 500);
    }

    return apiSuccess(updatedInvoice, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
