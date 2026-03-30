export interface EmailTemplate {
  subject: string;
  html: string;
}

export const emailTemplates: Record<string, EmailTemplate> = {
  welcome: {
    subject: 'Welcome to {{companyName}}!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">Welcome, {{firstName}}!</h1>

        <p>Thank you for reaching out to {{companyName}}. We're excited to work with you!</p>

        <p>Our team is committed to providing exceptional service and will be in touch shortly to discuss your needs.</p>

        <p style="margin-bottom: 10px;">If you have any questions in the meantime, feel free to reach out:</p>
        <p style="margin: 0;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },

  estimate_followup: {
    subject: 'Following Up: Your {{companyName}} Estimate',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">Following Up on Your Estimate</h1>

        <p>Hi {{firstName}},</p>

        <p>We wanted to check in and see if you had a chance to review your estimate from {{companyName}}.</p>

        <p>If you have any questions about the proposal or would like to discuss the details further, we'd be happy to help!</p>

        <p style="margin-bottom: 10px;">Let's get your project started:</p>
        <p style="margin: 0;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },

  review_request: {
    subject: 'Share Your Experience with {{companyName}}',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">We'd Love Your Feedback!</h1>

        <p>Hi {{firstName}},</p>

        <p>Thank you for choosing {{companyName}}! We hope you're thrilled with the work we completed for you.</p>

        <p>If you had a great experience, we'd be incredibly grateful if you could share a Google review. Your feedback helps us serve our community better and allows other homeowners to make informed decisions.</p>

        <p style="margin-bottom: 10px;">Questions or concerns? We're here to help:</p>
        <p style="margin: 0;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },

  payment_reminder: {
    subject: 'Payment Reminder: Invoice from {{companyName}}',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626; margin-bottom: 20px;">Payment Reminder</h1>

        <p>Hi {{firstName}},</p>

        <p>This is a friendly reminder that we have an outstanding invoice awaiting payment.</p>

        <p>If you've already sent payment, please disregard this notice. If you need to discuss payment terms or have questions about the invoice, please contact us:</p>

        <p style="margin-bottom: 10px;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          We appreciate your prompt attention to this matter.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },

  appointment_reminder: {
    subject: 'Reminder: Your Appointment with {{companyName}} Tomorrow',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">Appointment Reminder</h1>

        <p>Hi {{firstName}},</p>

        <p>This is a friendly reminder that {{companyName}} has a service appointment scheduled for you tomorrow!</p>

        <p>If you need to reschedule or have any questions, please let us know as soon as possible:</p>

        <p style="margin-bottom: 10px;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
          We look forward to seeing you tomorrow!
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },

  reactivation: {
    subject: 'We Miss You, {{firstName}}!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; margin-bottom: 20px;">We'd Love to Work with You Again!</h1>

        <p>Hi {{firstName}},</p>

        <p>We noticed it's been a while since we last worked together, and we wanted to reach out. {{companyName}} has continued to improve our services, and we'd love the opportunity to help you with your next project.</p>

        <p>Whether you have a quick maintenance need or a larger project in mind, we're here to help with the same quality service you remember.</p>

        <p style="margin-bottom: 10px;">Get in touch to schedule a consultation:</p>
        <p style="margin: 0;">
          <strong>Phone:</strong> {{companyPhone}}<br>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          {{companyName}}<br>
          {{companyPhone}}
        </p>
      </div>
    `,
  },
};

export function getEmailTemplate(templateId: string): EmailTemplate | null {
  return emailTemplates[templateId] || null;
}

export function renderTemplate(template: EmailTemplate, variables: Record<string, string>): EmailTemplate {
  let subject = template.subject;
  let html = template.html;

  // Replace all {{variable}} placeholders with values
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    html = html.replace(new RegExp(placeholder, 'g'), value);
  });

  return { subject, html };
}
