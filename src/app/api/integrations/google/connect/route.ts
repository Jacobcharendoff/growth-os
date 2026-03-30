import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getCurrentUser, apiError } from '@/lib/api-helpers';

/**
 * Start the Google OAuth flow
 * Redirects to Google's consent screen
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!googleClientId || !googleRedirectUri) {
      return apiError(
        'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI environment variables.',
        500
      );
    }

    // Create state parameter for security (prevents CSRF)
    const state = Buffer.from(JSON.stringify({ orgId: user.orgId, timestamp: Date.now() })).toString(
      'base64'
    );

    const scope = encodeURIComponent('https://www.googleapis.com/auth/calendar.events');
    const redirectUri = encodeURIComponent(googleRedirectUri);
    const clientId = encodeURIComponent(googleClientId);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
