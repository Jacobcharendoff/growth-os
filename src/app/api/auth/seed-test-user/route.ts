import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

/**
 * POST /api/auth/seed-test-user
 *
 * Creates a pre-confirmed test user for demo/testing purposes.
 * Uses the Supabase Admin API (service role key) to bypass email confirmation.
 *
 * This route should be disabled or protected in production.
 */
export async function POST() {
  try {
    const supabase = createServiceClient();

    const testEmail = 'demo@staybooktapp.com';
    const testPassword = 'Staybookt2026!';
    const testName = 'Demo User';

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === testEmail);

    if (existingUser) {
      // Update password in case it was changed
      await supabase.auth.admin.updateUserById(existingUser.id, {
        password: testPassword,
        email_confirm: true,
      });

      return NextResponse.json({
        message: 'Test user already exists — password reset.',
        credentials: { email: testEmail, password: testPassword },
      });
    }

    // Create new user with email pre-confirmed
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: testName,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also set trial flags on the users table
    if (data.user) {
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('users').upsert({
        id: data.user.id,
        email: testEmail,
        first_name: 'Demo',
        is_trial: true,
        trial_started_at: new Date().toISOString(),
        trial_ends_at: trialEndsAt,
      });
    }

    return NextResponse.json({
      message: 'Test user created successfully.',
      credentials: { email: testEmail, password: testPassword },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
