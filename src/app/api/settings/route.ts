import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createServerComponentClient } from '@/lib/supabase-server';
import {
  getCurrentUser,
  apiError,
  apiSuccess,
  validateRequest,
} from '@/lib/api-helpers';

const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  color: z.string(),
});

const pipelineStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

const updateSettingsSchema = z.object({
  company_name: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().email().optional(),
  company_address: z.string().optional(),
  industry: z.string().optional(),
  timezone: z.string().optional(),
  team_members: z.array(teamMemberSchema).optional(),
  pipeline_stages: z.array(pipelineStageSchema).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const { data, error } = await supabase
      .from('org_settings')
      .select('*')
      .eq('org_id', user.orgId)
      .single();

    if (error) {
      return apiError(error.message, 404);
    }

    if (!data) {
      return apiError('Settings not found', 404);
    }

    return apiSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    const validation = await validateRequest(request, updateSettingsSchema);
    if (!validation.valid) {
      return apiError(validation.error, 400);
    }

    const { data, error } = await supabase
      .from('org_settings')
      .update(validation.data)
      .eq('org_id', user.orgId)
      .select()
      .single();

    if (error) {
      return apiError(error.message, 500);
    }

    if (!data) {
      return apiError('Settings not found', 404);
    }

    return apiSuccess(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, error instanceof Error && message === 'Not authenticated' ? 401 : 500);
  }
}
