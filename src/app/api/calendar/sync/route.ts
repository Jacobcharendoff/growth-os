import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';
import { createEvent, updateEvent, deleteEvent, CalendarEvent } from '@/lib/google-calendar';

const syncSchema = z.object({
  dealId: z.string().min(1),
  action: z.enum(['create', 'update', 'delete']),
});

/**
 * Sync a deal with Google Calendar
 * - create: Creates a new Google Calendar event for the deal
 * - update: Updates an existing Google Calendar event
 * - delete: Deletes the Google Calendar event
 *
 * Stores the Google event ID in deal metadata for future syncs
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Validate request body
    const validation = await validateRequest(request, syncSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { dealId, action } = validation.data;

    // Get the deal from database
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(
        `
        id,
        title,
        scheduled_date,
        contact_id,
        metadata,
        contacts (
          name,
          email,
          phone
        )
      `
      )
      .eq('id', dealId)
      .eq('org_id', user.orgId)
      .single();

    if (dealError || !deal) {
      return apiError('Deal not found', 404);
    }

    // Get org settings to retrieve Google access token
    const { data: settings, error: settingsError } = await supabase
      .from('org_settings')
      .select('integration_tokens, timezone')
      .eq('org_id', user.orgId)
      .single();

    if (settingsError) {
      return apiError(
        'Organization settings not found',
        500
      );
    }

    // Check if Google Calendar is connected
    const googleTokens = settings?.integration_tokens?.google_calendar;
    if (!googleTokens || !googleTokens.access_token) {
      return apiSuccess({
        success: false,
        message: 'Google Calendar is not connected. Skipping sync.',
        dealId,
        action,
      }, 200); // Return 200 to indicate graceful failure
    }

    const timezone = settings?.timezone || 'UTC';
    const metadata = deal.metadata || {};
    const googleEventId = metadata.google_calendar_event_id;

    try {
      if (action === 'delete') {
        // Delete event from Google Calendar
        if (googleEventId) {
          await deleteEvent(googleTokens.access_token, 'primary', googleEventId);

          // Clear the event ID from metadata
          const updatedMetadata = { ...metadata };
          delete updatedMetadata.google_calendar_event_id;

          await supabase
            .from('deals')
            .update({ metadata: updatedMetadata })
            .eq('id', dealId);
        }

        return apiSuccess({
          success: true,
          message: 'Google Calendar event deleted',
          dealId,
          action,
        });
      }

      // Prepare event data for create/update
      if (!deal.scheduled_date) {
        return apiSuccess({
          success: false,
          message: 'Deal has no scheduled date. Cannot sync to calendar.',
          dealId,
          action,
        }, 200); // Return 200 to indicate graceful failure
      }

      const startDate = new Date(deal.scheduled_date);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

      const contact = Array.isArray(deal.contacts) ? deal.contacts[0] : deal.contacts;
      const contactName = contact?.name || 'Unknown';
      const contactEmail = contact?.email;

      const calendarEvent: CalendarEvent = {
        summary: deal.title,
        description: `Deal ID: ${deal.id}\nContact: ${contactName}`,
        location: '',
        start: {
          dateTime: startDate.toISOString(),
          timeZone: timezone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: timezone,
        },
        attendees: contactEmail
          ? [
              {
                email: contactEmail,
                displayName: contactName,
              },
            ]
          : [],
      };

      let eventId = googleEventId;

      if (action === 'create' || !eventId) {
        // Create new event
        const createdEvent = await createEvent(googleTokens.access_token, 'primary', calendarEvent);
        eventId = createdEvent.id;

        // Store event ID in deal metadata
        const updatedMetadata = {
          ...metadata,
          google_calendar_event_id: eventId,
          google_calendar_synced_at: new Date().toISOString(),
        };

        await supabase
          .from('deals')
          .update({ metadata: updatedMetadata })
          .eq('id', dealId);

        return apiSuccess({
          success: true,
          message: 'Google Calendar event created',
          dealId,
          action,
          googleEventId: eventId,
        }, 201);
      } else if (action === 'update') {
        // Update existing event
        calendarEvent.id = eventId;
        await updateEvent(googleTokens.access_token, 'primary', eventId, calendarEvent);

        // Update sync timestamp in metadata
        const updatedMetadata = {
          ...metadata,
          google_calendar_synced_at: new Date().toISOString(),
        };

        await supabase
          .from('deals')
          .update({ metadata: updatedMetadata })
          .eq('id', dealId);

        return apiSuccess({
          success: true,
          message: 'Google Calendar event updated',
          dealId,
          action,
          googleEventId: eventId,
        });
      }
    } catch (syncError) {
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown error';

      // Log the error but don't fail the entire request - be graceful
      console.error(`Failed to sync deal ${dealId} with Google Calendar:`, errorMessage);

      return apiSuccess({
        success: false,
        message: `Failed to sync with Google Calendar: ${errorMessage}`,
        dealId,
        action,
      }, 200); // Return 200 to indicate graceful failure
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
