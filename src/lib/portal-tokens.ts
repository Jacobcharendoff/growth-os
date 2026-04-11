import crypto from 'crypto';

// Initialize PORTAL_SECRET based on environment
const PORTAL_SECRET = (() => {
  const envSecret = process.env.PORTAL_SECRET;

  // Production: secret must be set
  if (process.env.NODE_ENV === 'production') {
    if (!envSecret) {
      throw new Error('PORTAL_SECRET environment variable is required in production');
    }
    return envSecret;
  }

  // Development: generate random per-process secret if not set
  if (!envSecret) {
    return crypto.randomBytes(32).toString('hex');
  }

  return envSecret;
})();

/**
 * Generate a portal token for a customer
 * Token = SHA256 hash of contactId:orgId:PORTAL_SECRET, first 32 chars
 */
export function generatePortalToken(contactId: string, orgId: string): string {
  const hash = crypto.createHash('sha256').update(`${contactId}:${orgId}:${PORTAL_SECRET}`).digest('hex');
  return hash.slice(0, 32);
}

/**
 * Validate a portal token
 */
export function validatePortalToken(token: string, contactId: string, orgId: string): boolean {
  const expectedToken = generatePortalToken(contactId, orgId);
  return token === expectedToken;
}

/**
 * Generate a full portal URL
 */
export function generatePortalUrl(contactId: string, orgId: string, baseUrl: string = 'https://staybookt-pied.vercel.app'): string {
  const token = generatePortalToken(contactId, orgId);
  return `${baseUrl}/portal/${token}`;
}
