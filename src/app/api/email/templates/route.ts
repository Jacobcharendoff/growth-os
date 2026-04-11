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
import { getEmailTemplate, renderTemplate } from '@/lib/email-templates';

const fromDomain = process.env.EMAIL_FROM_DOMAIN || 'resend.dev';

const sendTemplateSchema = z.object({
  templateId: z.string().min(1),
  contactId: z.string().min(1),
  variables: z.record(z.string(), z.string()).optional(),
  dealId: z.string().optional(),
});

type SendTemplateRequest = z.infer<typeof sendTemplateSchema>;

interface ResendResponse {
  data?: { id: string };
  error?: { message: string };
}

interface ActivityInsert {
  org_id: string;
  contact_id: string;
  type: string;
  description: string;
  deal_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, sendTemplateSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { templateId, contactId, variables: customVariables, dealId } = validation.data;

    const template = getEmailTemplate(templateId);
    if (!template) {
      return apiError(`Template "${templateId}" not found`, 404);
    }

    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('email, name, phone')
      .eq('id', contactId)
      .eq('org_id', user.orgId)
      .single();

    if (contactError || !contact) {
      return apiError('Contact not found', 404);
    }

    const { data: orgSettings } = await supabase
      .from('org_settings')
      .select('company_name, company_phone')
      .eq('org_id', user.orgId)
      .single();

    const companyName = orgSettings?.company_name || 'Staybookt';
    const companyPhone = orgSettings?.company_phone || '';

    const firstName = contact.name.split(' ')[0];

    const variables = {
      firstName,
      companyName,
      companyPhone,
      ...customVariables,
    };

    const renderedTemplate = renderTemplate(template, variables);

    const resend = getResend();
    let emailSent = false;
    let resendResponse: ResendResponse | null = null;

    if (resend) {
      try {
        resendResponse = await resend.emails.send({
          from: `notifications@${fromDomain}`,
          to: contact.email,
          subject: renderedTemplate.subject,
          html: renderedTemplate.html,
        });

        if (resendResponse.error) {
          console.error('Resend error:', resendResponse.error);
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

    const activityData: ActivityInsert = {
      org_id: user.orgId,
      contact_id: contactId,
      type: 'email',
      description: `Email template "${templateId}" sent to ${contact.email}`,
    };

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

    if (emailSent && resendResponse) {
      return apiSuccess(
        {
          id: resendResponse.data?.id,
          templateId,
          contactId,
          to: contact.email,
          subject: renderedTemplate.subject,
          sent: true,
          activityId: activity?.id,
        },
        200
      );
    } else if (!resend) {
      return apiSuccess(
        {
          templateId,
          contactId,
          to: contact.email,
          subject: renderedTemplate.subject,
          sent: false,
          warning: 'Email not sent - Resend API key not configured',
          activityId: activity?.id,
        },
        200
      );
    } else {
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
