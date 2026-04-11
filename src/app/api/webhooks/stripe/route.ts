import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getStripe } from '@/lib/stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

interface StripeMetadata {
  invoiceId?: string;
  orgId?: string;
}

interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, string>;
  last_payment_error?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    if (!STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Stripe webhook secret not configured' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 }
      );
    }

    if (event.type === 'payment_intent.succeeded') {
      await handlePaymentIntentSucceeded(event.data.object);
    } else if (event.type === 'payment_intent.payment_failed') {
      await handlePaymentIntentFailed(event.data.object);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Webhook processing error: ${message}` },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: StripePaymentIntent
): Promise<void> {
  const metadata = paymentIntent.metadata as StripeMetadata;

  if (!metadata.invoiceId || !metadata.orgId) {
    throw new Error('Payment intent missing required metadata');
  }

  const supabase = await createServerComponentClient();

  const { data: invoice, error: getError } = await supabase
    .from('invoices')
    .select('amount_paid, total')
    .eq('id', metadata.invoiceId)
    .eq('org_id', metadata.orgId)
    .single();

  if (getError || !invoice) {
    throw new Error(`Invoice not found: ${metadata.invoiceId}`);
  }

  const paymentAmount = paymentIntent.amount / 100;
  const newAmountPaid = parseFloat(invoice.amount_paid.toString()) + paymentAmount;
  const invoiceTotal = parseFloat(invoice.total.toString());
  let newStatus = 'partial';

  if (newAmountPaid >= invoiceTotal) {
    newStatus = 'paid';
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({
      amount_paid: newAmountPaid,
      status: newStatus,
      stripe_payment_intent_id: paymentIntent.id,
      paid_at: new Date().toISOString(),
    })
    .eq('id', metadata.invoiceId)
    .eq('org_id', metadata.orgId);

  if (updateError) {
    throw new Error(`Failed to update invoice: ${updateError.message}`);
  }
}

async function handlePaymentIntentFailed(
  paymentIntent: StripePaymentIntent
): Promise<void> {
  const metadata = paymentIntent.metadata as StripeMetadata;

  if (!metadata.invoiceId || !metadata.orgId) {
    throw new Error('Payment intent missing required metadata');
  }

  console.error(`Payment failed for invoice ${metadata.invoiceId}:`, {
    paymentIntentId: paymentIntent.id,
    lastPaymentError: paymentIntent.last_payment_error,
  });
}
