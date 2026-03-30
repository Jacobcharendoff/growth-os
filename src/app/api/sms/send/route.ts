import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { getTwilio, getTwilioPhoneNumber } from '@/lib/twilio';

const sendSmsSchema = z.object({
  to: z.string(),
  body: z.string().min(1),
  contactId: z.string().optional(),
});

// Validate phone number format
function isValidPhoneNumber(phone: string): boolean {
  // Must start with + or be 10-digit North American format
  const internationalPattern = /^\+\d{10,15}$/;
  const northAmericanPattern = /^\d{10}$/;
  return internationalPattern.test(phone) || northAmericanPattern.test(phone);
}

// Normalize phone number for Twilio
function normalizePhoneNumber(phone: string): string {
  if (phone.startsWith('+')) {
    return phone;
  }
  // Add North American country code if not present
  return `+1${phone}`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, sendSmsSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { to, body, contactId } = validation.data;

    // Validate phone number
    if (!isValidPhoneNumber(to)) {
      return apiError(
        'Invalid phone number format. Must be +[country code][number] or 10-digit North American format.',
        400
      );
    }

    // Check if Twilio is configured
    const twilioClient = getTwilio();
    const twilioPhoneNumber = getTwilioPhoneNumber();

    if (!twilioClient || !twilioPhoneNumber) {
      return apiError('SMS service is not configured', 503);
    }

    const normalizedPhone = normalizePhoneNumber(to);

    // Send SMS via Twilio
    let twilioSid: string | null = null;
    try {
      const message = await twilioClient.messages.create({
        body,
        from: twilioPhoneNumber,
        to: normalizedPhone,
      });
      twilioSid = message.sid;
    } catch (twilioError) {
      const errorMessage = twilioError instanceof Error ? twilioError.message : 'Failed to send SMS';
      return apiError(`Failed to send SMS: ${errorMessage}`, 503);
    }

    // Log as activity
    const activityData: any = {
      org_id: user.orgId,
      type: 'sms',
      description: body,
      metadata: {
        to: normalizedPhone,
        twilio_sid: twilioSid,
        direction: 'outbound',
      },
    };

    if (contactId) {
      activityData.contact_id = contactId;
    }

    // Insert activity record (if sms type is supported; if not, fall back to 'note')
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();

    // If SMS type is not supported, try as a note
    if (activityError && activityError.message.includes('sms')) {
      activityData.type = 'note';
      await supabase.from('activities').insert(activityData).select().single();
    }

    return apiSuccess(
      {
        twilio_sid: twilioSid,
        to: normalizedPhone,
        body,
        sent_at: new Date().toISOString(),
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
