import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { getResend } from '@/lib/resend';

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
});

type SendEmailRequest = z.infer<typeof sendEmailSchema>;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, sendEmailSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { to, subject, html, from, replyTo, contactId, dealId } = validation.data;

    // Get org settings for default from address
    const { data: orgSettings } = await supabase
      .from('org_settings')
      .select('company_name')
      .eq('org_id', user.orgId)
      .single();

    const companyName = orgSettings?.company_name || 'GrowthOS';
    const fromAddress = from || `${companyName} <notifications@growthos.app>`;

    // Try to send via Resend
    const resend = getResend();
    let emailSent = false;
    let resendResponse: any = null;

    if (resend) {
      try {
        resendResponse = await resend.emails.send({
          from: fromAddress,
          to,
          subject,
          html,
          ...(replyTo && { reply_to: replyTo }),
        });

        if (resendResponse.error) {
          console.error('Resend error:', resendResponse.error);
          // Still log the activity, but note it failed
          emailSent = false;
        } else {
          emailSent = true;
        }
      } catch (resendError) {
        console.error('Resend API error:', resendError);
        emailSent = false;
      }
    } else {
      console.warn('Resend API key not configured, email not sent');
      emailSent = false;
    }

    // Log as activity
    const activityData: any = {
      org_id: user.orgId,
      type: 'email',
      description: `Email sent to ${to}: ${subject}`,
    };

    if (contactId) {
      activityData.contact_id = contactId;
    }
    if (dealId) {
      activityData.deal_id = dealId;
    }

    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();

    if (activityError) {
      console.error('Failed to log email activity:', activityError);
    }

    // Return response
    if (emailSent && resendResponse) {
      return apiSuccess(
        {
          id: resendResponse.data?.id,
          to,
          subject,
          sent: true,
          activityId: activity?.id,
        },
        200
      );
    } else if (!resend) {
      // Resend not configured, but activity was logged
      return apiSuccess(
        {
          to,
          subject,
          sent: false,
          warning: 'Email not sent - Resend API key not configured',
          activityId: activity?.id,
        },
        200
      );
    } else {
      // Resend error
      return apiError(
        `Failed to send email: ${resendResponse?.error?.message || 'Unknown error'}`,
        500
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
