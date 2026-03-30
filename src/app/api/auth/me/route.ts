import { NextRequest } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase-server';
import { getCurrentUser, apiError, apiSuccess } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const user = await getCurrentUser(supabase);

    // Get user profile and org info
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, org_id')
      .eq('id', user.userId)
      .single();

    if (userError || !userData) {
      return apiError('User profile not found', 404);
    }

    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', user.orgId)
      .single();

    if (orgError || !orgData) {
      return apiError('Organization not found', 404);
    }

    return apiSuccess({
      user: {
        id: userData.id,
        email: userData.email,
      },
      org: {
        id: orgData.id,
        name: orgData.name,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return apiError(message, message === 'Not authenticated' ? 401 : 500);
  }
}
