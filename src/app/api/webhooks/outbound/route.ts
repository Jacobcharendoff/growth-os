import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import {
  registerWebhook,
  getWebhooks,
  removeWebhook,
  SUPPORTED_EVENTS,
} from '@/lib/webhooks';

const registerWebhookSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum(SUPPORTED_EVENTS as readonly [string, ...string[]])),
  secret: z.string().optional(),
});

const deleteWebhookSchema = z.object({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const webhooks = getWebhooks(user.orgId);

    return apiSuccess(webhooks, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, registerWebhookSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { url, events, secret } = validation.data;

    // Register the webhook
    const webhook = registerWebhook(user.orgId, url, events, secret);

    return apiSuccess(webhook, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, deleteWebhookSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { id } = validation.data;

    // Remove the webhook
    const removed = removeWebhook(user.orgId, id);

    if (!removed) {
      return apiError('Webhook not found', 404);
    }

    return apiSuccess({ id }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
