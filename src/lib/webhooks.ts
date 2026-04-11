import crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, unknown>;
  orgId: string;
}

export interface WebhookConfig {
  id: string;
  orgId: string;
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

export const SUPPORTED_EVENTS = [
  'contact.created',
  'deal.created',
  'deal.updated',
  'deal.stage_changed',
  'invoice.created',
  'invoice.paid',
  'estimate.created',
  'estimate.approved',
] as const;

const webhookRegistry = new Map<string, WebhookConfig[]>();

export function registerWebhook(
  orgId: string,
  url: string,
  events: string[],
  secret?: string
): WebhookConfig {
  const config: WebhookConfig = {
    id: crypto.randomUUID(),
    orgId,
    url,
    events,
    secret,
    active: true,
    createdAt: new Date().toISOString(),
  };

  if (!webhookRegistry.has(orgId)) {
    webhookRegistry.set(orgId, []);
  }

  const orgWebhooks = webhookRegistry.get(orgId)!;
  orgWebhooks.push(config);

  return config;
}

export function getWebhooks(orgId: string): WebhookConfig[] {
  return webhookRegistry.get(orgId) || [];
}

export function removeWebhook(orgId: string, webhookId: string): boolean {
  const webhooks = webhookRegistry.get(orgId);
  if (!webhooks) return false;

  const index = webhooks.findIndex((w) => w.id === webhookId);
  if (index === -1) return false;

  webhooks.splice(index, 1);
  return true;
}

export function generateSignature(payload: WebhookPayload, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

export async function dispatchWebhooks(
  orgId: string,
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const webhooks = getWebhooks(orgId).filter((w) => w.active && w.events.includes(event));

  if (webhooks.length === 0) {
    return;
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
    orgId,
  };

  webhooks.forEach((webhook) => {
    dispatchWebhook(webhook, payload).catch((error) => {
      console.error(`Failed to dispatch webhook ${webhook.id}:`, error);
    });
  });
}

async function dispatchWebhook(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Staybookt/1.0',
  };

  if (webhook.secret) {
    const signature = generateSignature(payload, webhook.secret);
    headers['X-Staybookt-Signature'] = signature;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn(
          `Webhook ${webhook.id} returned status ${response.status}: ${await response.text()}`
        );
      }

      updateWebhookLastTriggered(webhook.orgId, webhook.id);
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error(`Error dispatching webhook ${webhook.id}:`, error);
    throw error;
  }
}

function updateWebhookLastTriggered(orgId: string, webhookId: string): void {
  const webhooks = webhookRegistry.get(orgId);
  if (!webhooks) return;

  const webhook = webhooks.find((w) => w.id === webhookId);
  if (webhook) {
    webhook.lastTriggeredAt = new Date().toISOString();
  }
}
