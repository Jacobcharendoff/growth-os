import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getCurrentUser, apiError } from '@/lib/api-helpers';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

/**
 * Handle Google OAuth2 callback
 * Exchanges auth code for access token and stores in org settings
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description') || error;
      console.error('Google OAuth error:', errorDescription);
      return NextResponse.redirect(
        `/settings?tab=integrations&error=${encodeURIComponent('Google authentication failed: ' + errorDescription)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(`/settings?tab=integrations&error=${encodeURIComponent('No authorization code received')}`);
    }

    if (!state) {
      return NextResponse.redirect(`/settings?tab=integrations&error=${encodeURIComponent('Invalid state parameter')}`);
    }

    // Decode and verify state
    let stateData: { orgId: string; timestamp: number };
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
    } catch {
      return NextResponse.redirect(`/settings?tab=integrations&error=${encodeURIComponent('Invalid state parameter')}`);
    }

    // Verify state is recent (within 10 minutes)
    if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
      return NextResponse.redirect(`/settings?tab=integrations&error=${encodeURIComponent('OAuth state expired')}`);
    }

    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Verify org matches
    if (user.orgId !== stateData.orgId) {
      return NextResponse.redirect(`/settings?tab=integrations&error=${encodeURIComponent('Organization mismatch')}`);
    }

    // Exchange code for tokens
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
      console.error('Google OAuth environment variables not configured');
      return NextResponse.redirect(
        `/settings?tab=integrations&error=${encodeURIComponent('Server is not properly configured')}`
      );
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Token exchange failed:', error);
      return NextResponse.redirect(
        `/settings?tab=integrations&error=${encodeURIComponent('Failed to exchange authorization code')}`
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    // Store tokens in org_settings
    const { data: settings, error: getError } = await supabase
      .from('org_settings')
      .select('*')
      .eq('org_id', user.orgId)
      .single();

    if (getError && getError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching org settings:', getError);
      return NextResponse.redirect(
        `/settings?tab=integrations&error=${encodeURIComponent('Failed to access organization settings')}`
      );
    }

    // Prepare integration tokens
    const integrationTokens = settings?.integration_tokens || {};
    integrationTokens.google_calendar = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expires_at: Date.now() + tokens.expires_in * 1000,
      scope: tokens.scope,
      token_type: tokens.token_type,
    };

    // Update or insert org_settings
    const { error: updateError } = settings
      ? await supabase
          .from('org_settings')
          .update({ integration_tokens: integrationTokens })
          .eq('org_id', user.orgId)
      : await supabase.from('org_settings').insert({
          org_id: user.orgId,
          integration_tokens: integrationTokens,
        });

    if (updateError) {
      console.error('Error saving tokens:', updateError);
      return NextResponse.redirect(
        `/settings?tab=integrations&error=${encodeURIComponent('Failed to save authentication tokens')}`
      );
    }

    // Success - redirect to settings
    return NextResponse.redirect(`/settings?tab=integrations&success=${encodeURIComponent('Google Calendar connected!')}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('OAuth callback error:', message);
    return NextResponse.redirect(
      `/settings?tab=integrations&error=${encodeURIComponent('An unexpected error occurred')}`
    );
  }
}
