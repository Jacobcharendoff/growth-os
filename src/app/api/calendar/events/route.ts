import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getCurrentUser, apiError, apiSuccess } from '@/lib/api-helpers';
import { listEvents, CalendarEvent } from '@/lib/google-calendar';

/**
 * List calendar events within a date range
 * Query params:
 *   - start: ISO 8601 timestamp (required)
 *   - end: ISO 8601 timestamp (required)
 *   - calendarId: optional, defaults to 'primary'
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const calendarId = searchParams.get('calendarId') || 'primary';

    // Validate required parameters
    if (!start || !end) {
      return apiError('Missing required query parameters: start and end (ISO 8601 format)', 400);
    }

    // Validate ISO 8601 format
    if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return apiError('Invalid date format. Use ISO 8601 timestamps.', 400);
    }

    // Get org settings to retrieve Google access token
    const { data: settings, error: settingsError } = await supabase
      .from('org_settings')
      .select('integration_tokens')
      .eq('org_id', user.orgId)
      .single();

    if (settingsError) {
      return apiError(
        'Google Calendar is not connected. Please connect it in Settings > Integrations.',
        404
      );
    }

    const googleTokens = settings?.integration_tokens?.google_calendar;
    if (!googleTokens || !googleTokens.access_token) {
      return apiError(
        'Google Calendar access token not found. Please reconnect in Settings > Integrations.',
        404
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = googleTokens.access_token;
    if (googleTokens.expires_at && Date.now() >= googleTokens.expires_at && googleTokens.refresh_token) {
      try {
        accessToken = await refreshGoogleToken(googleTokens.refresh_token, user.orgId);
      } catch (refreshError) {
        console.error('Failed to refresh Google token:', refreshError);
        return apiError(
          'Google Calendar token expired. Please reconnect in Settings > Integrations.',
          401
        );
      }
    }

    // Fetch events from Google Calendar
    const response = await listEvents(accessToken, calendarId, start, end);

    // Map response to frontend format
    const events: CalendarEvent[] = response.items || [];

    return apiSuccess({
      events,
      total: events.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    // Provide helpful error messages for Google API errors
    if (message.includes('Google Calendar API error')) {
      return apiError(`Failed to fetch calendar events: ${message}`, 500);
    }

    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

/**
 * Refresh Google access token using refresh token
 */
async function refreshGoogleToken(refreshToken: string, orgId: string): Promise<string> {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth is not configured');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Google token');
  }

  const data = await response.json();

  // Update the access token in org_settings
  const supabase = await import('@/lib/supabase-server').then(m => m.createServerComponentClient());
  const { data: settings } = await supabase
    .from('org_settings')
    .select('integration_tokens')
    .eq('org_id', orgId)
    .single();

  if (settings?.integration_tokens?.google_calendar) {
    const updatedTokens = {
      ...settings.integration_tokens,
      google_calendar: {
        ...settings.integration_tokens.google_calendar,
        access_token: data.access_token,
        expires_at: Date.now() + data.expires_in * 1000,
      },
    };

    await supabase.from('org_settings').update({ integration_tokens: updatedTokens }).eq('org_id', orgId);
  }

  return data.access_token;
}
