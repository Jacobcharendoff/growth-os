import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';

// Twilio signature validation
async function validateTwilioSignature(
  request: NextRequest,
  requestBody: string
): Promise<boolean> {
  const signature = request.headers.get('x-twilio-signature');
  const url = new URL(request.url).toString();

  if (!signature || !process.env.TWILIO_AUTH_TOKEN) {
    return false;
  }

  try {
    const crypto = await import('crypto');
    const hmac = crypto.createHmac('sha1', process.env.TWILIO_AUTH_TOKEN);
    hmac.update(url + requestBody);
    const hash = hmac.digest('base64');
    return hash === signature;
  } catch (error) {
    console.error('Twilio signature validation error:', error);
    return false;
  }
}

// Generate TwiML response
function getTwiMLResponse(message?: string): string {
  const responseMessage = message || 'Thanks for your message!';
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(responseMessage)}</Message>
</Response>`;
}

// Escape special XML characters
function escapeXml(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    // Validate Twilio signature
    const isValid = await validateTwilioSignature(request, body);
    if (!isValid) {
      console.warn('Invalid Twilio signature');
      return new NextResponse(getTwiMLResponse(), {
        status: 403,
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    const from = params.get('From');
    const to = params.get('To');
    const messageBody = params.get('Body');
    const messageSid = params.get('MessageSid');

    if (!from || !messageBody || !messageSid) {
      return new NextResponse(getTwiMLResponse(), {
        status: 400,
        headers: { 'Content-Type': 'application/xml' },
      });
    }

    // Initialize Supabase
    const supabase = await createServerComponentClient();

    // Find contact by phone number
    const { data: contact } = await supabase
      .from('contacts')
      .select('id, org_id')
      .eq('phone', from)
      .single();

    // Log inbound SMS activity if contact found
    if (contact) {
      await supabase
        .from('activities')
        .insert({
          org_id: contact.org_id,
          contact_id: contact.id,
          type: 'note', // Log as note since SMS type may not exist
          description: `Inbound SMS: ${messageBody}`,
          metadata: {
            twilio_sid: messageSid,
            from: from,
            to: to,
            direction: 'inbound',
          },
        })
        .select()
        .single();
    } else {
      // Log unmatched inbound SMS to a default org context
      // This would need to be handled differently in production
      console.log(`Unmatched inbound SMS from ${from}: ${messageBody}`);
    }

    // Return TwiML response
    return new NextResponse(getTwiMLResponse(), {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return new NextResponse(getTwiMLResponse(), {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
