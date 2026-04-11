/**
 * Google Calendar API Client
 * Uses REST API directly via fetch() instead of heavyweight SDK
 * Minimal bundle size, full control
 */

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
}

export interface CalendarEventListResponse {
  items: CalendarEvent[];
  nextPageToken?: string;
}

export interface GoogleCalendarErrorResponse {
  error?: {
    message: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * List calendar events within a time range
 */
export async function listEvents(
  accessToken: string,
  calendarId: string = 'primary',
  timeMin: string,
  timeMax: string
): Promise<CalendarEventListResponse> {
  const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`);
  url.searchParams.append('timeMin', timeMin);
  url.searchParams.append('timeMax', timeMax);
  url.searchParams.append('singleEvents', 'true');
  url.searchParams.append('orderBy', 'startTime');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as GoogleCalendarErrorResponse;
    throw new Error(`Google Calendar API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json() as CalendarEventListResponse;
  return data;
}

/**
 * Create a new calendar event
 */
export async function createEvent(
  accessToken: string,
  calendarId: string = 'primary',
  event: CalendarEvent
): Promise<CalendarEvent> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as GoogleCalendarErrorResponse;
    throw new Error(`Google Calendar API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json() as CalendarEvent;
  return data;
}

/**
 * Update an existing calendar event (PATCH for partial updates)
 */
export async function updateEvent(
  accessToken: string,
  calendarId: string = 'primary',
  eventId: string,
  event: Partial<CalendarEvent>
): Promise<CalendarEvent> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as GoogleCalendarErrorResponse;
    throw new Error(`Google Calendar API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json() as CalendarEvent;
  return data;
}

/**
 * Delete a calendar event
 */
export async function deleteEvent(
  accessToken: string,
  calendarId: string = 'primary',
  eventId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } })) as GoogleCalendarErrorResponse;
    throw new Error(`Google Calendar API error: ${error.error?.message || response.statusText}`);
  }
}
