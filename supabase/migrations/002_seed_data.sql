-- GrowthOS CRM Seed Data Migration
-- Initializes demo organization and default pipeline stages

-- ==================== DEMO ORGANIZATION ====================

INSERT INTO organizations (
  id,
  name,
  slug,
  industry,
  phone,
  email,
  timezone,
  settings
) VALUES (
  gen_random_uuid(),
  'Demo Plumbing Co',
  'demo-plumbing-co',
  'Plumbing',
  '+1-555-0100',
  'info@demoplumbingco.com',
  'America/Denver',
  jsonb_build_object(
    'currency', 'CAD',
    'invoicePrefix', 'INV',
    'estimatePrefix', 'EST',
    'defaultTaxRate', 0.05,
    'companyLegalName', 'Demo Plumbing Co Ltd',
    'addressLine1', '123 Main Street',
    'addressLine2', 'Suite 100',
    'city', 'Calgary',
    'province', 'AB',
    'postalCode', 'T2P 4B1',
    'country', 'Canada'
  )
);

-- ==================== DEMO DATA INSERTION ====================
-- Note: These inserts reference the demo organization created above
-- To use this properly, you'll need to:
-- 1. Run the organization creation first
-- 2. Get the org_id
-- 3. Create users linked to Supabase Auth
-- 4. Then insert demo contacts, deals, etc.

-- ==================== DEFAULT PIPELINE STAGE LABELS ====================
-- This is for reference and documentation purposes
-- Pipeline stages are defined in the enum type and available globally

-- Pipeline Stages (from enum definition):
-- - new_lead: Initial contact, not yet reached out
-- - contacted: Initial contact made with the prospect
-- - estimate_scheduled: Estimate appointment is scheduled
-- - estimate_sent: Estimate has been sent to customer
-- - booked: Customer has accepted and job is booked
-- - in_progress: Work is actively being performed
-- - completed: Work is finished
-- - invoiced: Invoice has been sent to customer

-- ==================== SAMPLE CONTACT DATA (to be inserted after org setup) ====================
-- Uncomment and customize after obtaining org_id from demo organization

-- WITH demo_org AS (
--   SELECT id as org_id FROM organizations WHERE slug = 'demo-plumbing-co' LIMIT 1
-- )
-- INSERT INTO contacts (org_id, name, email, phone, city, state, type, source, notes)
-- SELECT
--   demo_org.org_id,
--   'John Smith',
--   'john.smith@example.com',
--   '+1-403-555-0101',
--   'Calgary',
--   'AB',
--   'lead',
--   'google_lsa',
--   'Initial contact via Google LSA campaign'
-- FROM demo_org
-- UNION ALL
-- SELECT
--   demo_org.org_id,
--   'Sarah Johnson',
--   'sarah.j@example.com',
--   '+1-403-555-0102',
--   'Edmonton',
--   'AB',
--   'customer',
--   'existing_customer',
--   'Repeat customer, previous bathroom renovation'
-- FROM demo_org
-- UNION ALL
-- SELECT
--   demo_org.org_id,
--   'Mike Williams',
--   'mike.williams@example.com',
--   '+1-403-555-0103',
--   'Calgary',
--   'AB',
--   'lead',
--   'referral',
--   'Referred by Sarah Johnson'
-- FROM demo_org;

-- ==================== ONBOARDING HELPERS ====================

-- Helper comment for creating the first user after auth signup
/*
To create the first user and add them to the demo organization:

1. Get the org_id from the demo organization:
   SELECT id FROM organizations WHERE slug = 'demo-plumbing-co';

2. Sign up a user through Supabase Auth with metadata:
   email: admin@demoplumbingco.com
   password: [secure password]
   user_metadata: {
     "name": "Admin User",
     "role": "owner",
     "org_id": "[org_id_from_step_1]"
   }

3. The trigger 'on_auth_user_created' will automatically create the user record

4. Verify the user was created:
   SELECT * FROM users WHERE email = 'admin@demoplumbingco.com';
*/

-- ==================== SETUP VERIFICATION QUERIES ====================

-- Verify enum types exist
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'pipeline_stage'::regtype;

-- Verify tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Verify RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- ==================== NOTES ====================
/*
Default Values and Recommendations:

PIPELINE STAGES:
- new_lead: When a contact first enters the system
- contacted: After initial phone call or email outreach
- estimate_scheduled: Meeting scheduled to provide estimate
- estimate_sent: Quote delivered to customer
- booked: Customer approved estimate and job is confirmed
- in_progress: Technician is actively working on the job
- completed: All work finished, ready to invoice
- invoiced: Invoice sent to customer

LEAD SOURCES:
- existing_customer: Previous customer coming back
- reactivation: Contacted existing customer who hasn't used in 12+ months
- cross_sell: Existing customer buying new service
- referral: Referred by another customer
- review: Found via review site (Google Reviews, Yelp, etc)
- neighborhood: Canvassing or door-to-door
- google_lsa: Google Local Service Ads
- seo: Organic search (SEO)
- gbp: Google Business Profile

USER ROLES:
- owner: Company owner with full access
- admin: Can manage users, settings, all financial docs
- manager: Can assign jobs, view all deals, limited settings
- technician: Can only see assigned deals and update status

DEFAULT TAX RATES (Canada):
- Alberta: 5% (GST only)
- British Columbia: 5% (GST only)
- Saskatchewan: 5% (GST only)
- Manitoba: 5% (GST only)
- Ontario: 13% (HST)
- Quebec: 14.975% (GST + QST)
- Atlantic Provinces: 15% (HST)

INVOICE STATUS WORKFLOW:
draft -> sent -> viewed -> paid
         └─────> overdue (if due date passed)
         └─────> cancelled (if no longer needed)

ESTIMATE STATUS WORKFLOW:
draft -> sent -> viewed -> approved -> [converted to invoice]
                       └─> rejected
                       └─> expired
*/
