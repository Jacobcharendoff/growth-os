-- GrowthOS CRM Initial Schema Migration
-- Comprehensive Supabase PostgreSQL schema with RLS for multi-tenant CRM

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== ENUMS ====================

CREATE TYPE pipeline_stage AS ENUM (
  'new_lead',
  'contacted',
  'estimate_scheduled',
  'estimate_sent',
  'booked',
  'in_progress',
  'completed',
  'invoiced'
);

CREATE TYPE lead_source AS ENUM (
  'existing_customer',
  'reactivation',
  'cross_sell',
  'referral',
  'review',
  'neighborhood',
  'google_lsa',
  'seo',
  'gbp'
);

CREATE TYPE contact_type AS ENUM (
  'customer',
  'lead'
);

CREATE TYPE activity_type AS ENUM (
  'call',
  'email',
  'meeting',
  'note',
  'estimate',
  'payment',
  'sms',
  'status_change'
);

CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'manager',
  'technician'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'viewed',
  'paid',
  'overdue',
  'cancelled'
);

CREATE TYPE estimate_status AS ENUM (
  'draft',
  'sent',
  'viewed',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE job_priority AS ENUM (
  'low',
  'normal',
  'high',
  'emergency'
);

-- ==================== TABLES ====================

-- Organizations (multi-tenant root)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT DEFAULT 'general',
  phone TEXT,
  email TEXT,
  address TEXT,
  logo TEXT,
  website TEXT,
  timezone TEXT DEFAULT 'America/Denver',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT org_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$')
);

CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Users (team members, tied to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  role user_role DEFAULT 'technician' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_user_per_org UNIQUE(org_id, email)
);

CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(org_id, role);

-- Contacts (customers and leads)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  type contact_type DEFAULT 'lead' NOT NULL,
  source lead_source DEFAULT 'seo' NOT NULL,
  tags TEXT[],
  notes TEXT,
  property_type TEXT,
  service_area TEXT,
  preferred_contact TEXT DEFAULT 'phone',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contacts_org_id ON contacts(org_id);
CREATE INDEX idx_contacts_email ON contacts(org_id, email);
CREATE INDEX idx_contacts_phone ON contacts(org_id, phone);
CREATE INDEX idx_contacts_type ON contacts(org_id, type);
CREATE INDEX idx_contacts_source ON contacts(org_id, source);

-- Deals (pipeline items)
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC(12, 2) DEFAULT 0,
  stage pipeline_stage DEFAULT 'new_lead' NOT NULL,
  source lead_source DEFAULT 'seo' NOT NULL,
  priority job_priority DEFAULT 'normal' NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  scheduled_time_start TEXT,
  scheduled_time_end TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  tags TEXT[],
  service_type TEXT,
  job_address TEXT,
  stage_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deals_org_id ON deals(org_id);
CREATE INDEX idx_deals_contact_id ON deals(org_id, contact_id);
CREATE INDEX idx_deals_assigned_to_id ON deals(org_id, assigned_to_id);
CREATE INDEX idx_deals_stage ON deals(org_id, stage);
CREATE INDEX idx_deals_stage_date ON deals(org_id, stage, stage_changed_at DESC);
CREATE INDEX idx_deals_priority ON deals(org_id, priority);
CREATE INDEX idx_deals_created_at ON deals(org_id, created_at DESC);

-- Activities (timeline events)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type activity_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_org_id ON activities(org_id);
CREATE INDEX idx_activities_deal_id ON activities(org_id, deal_id);
CREATE INDEX idx_activities_contact_id ON activities(org_id, contact_id);
CREATE INDEX idx_activities_user_id ON activities(org_id, user_id);
CREATE INDEX idx_activities_type ON activities(org_id, type);
CREATE INDEX idx_activities_created_at ON activities(org_id, created_at DESC);

-- Estimates
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  estimate_number TEXT NOT NULL,
  status estimate_status DEFAULT 'draft' NOT NULL,
  line_items JSONB DEFAULT '[]'::jsonb NOT NULL,
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 4) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  signature_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_estimate_number UNIQUE(org_id, estimate_number)
);

CREATE INDEX idx_estimates_org_id ON estimates(org_id);
CREATE INDEX idx_estimates_deal_id ON estimates(org_id, deal_id);
CREATE INDEX idx_estimates_contact_id ON estimates(org_id, contact_id);
CREATE INDEX idx_estimates_status ON estimates(org_id, status);
CREATE INDEX idx_estimates_created_by_id ON estimates(org_id, created_by_id);
CREATE INDEX idx_estimates_created_at ON estimates(org_id, created_at DESC);

-- Invoices (CRA-compliant)
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status invoice_status DEFAULT 'draft' NOT NULL,
  line_items JSONB DEFAULT '[]'::jsonb NOT NULL,
  subtotal NUMERIC(12, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 4) DEFAULT 0,
  tax_amount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) DEFAULT 0,
  amount_paid NUMERIC(12, 2) DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  province TEXT,
  tax_type TEXT,
  gst_hst_registration_number TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_invoice_number UNIQUE(org_id, invoice_number),
  CONSTRAINT valid_amount_paid CHECK (amount_paid >= 0 AND amount_paid <= total)
);

CREATE INDEX idx_invoices_org_id ON invoices(org_id);
CREATE INDEX idx_invoices_deal_id ON invoices(org_id, deal_id);
CREATE INDEX idx_invoices_contact_id ON invoices(org_id, contact_id);
CREATE INDEX idx_invoices_status ON invoices(org_id, status);
CREATE INDEX idx_invoices_created_by_id ON invoices(org_id, created_by_id);
CREATE INDEX idx_invoices_due_date ON invoices(org_id, due_date) WHERE status != 'paid';
CREATE INDEX idx_invoices_created_at ON invoices(org_id, created_at DESC);

-- ==================== UTILITY FUNCTIONS ====================

-- Function to get current user's organization ID
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM users WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE;

-- Function to check if user belongs to org
CREATE OR REPLACE FUNCTION user_has_org_access(org_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND org_id = org_uuid
  )
$$ LANGUAGE SQL STABLE;

-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== TRIGGERS ====================

-- Update timestamps for organizations
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps for users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps for contacts
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps for deals
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps for estimates
CREATE TRIGGER update_estimates_updated_at
BEFORE UPDATE ON estimates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update timestamps for invoices
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- ORGANIZATIONS policies
-- Users can view their own organization
CREATE POLICY "Users can view their organization"
ON organizations FOR SELECT
USING (
  EXISTS (SELECT 1 FROM users WHERE users.org_id = organizations.id AND users.id = auth.uid())
);

-- Org admins/owners can update their organization settings
CREATE POLICY "Org owners and admins can update organization"
ON organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.org_id = organizations.id
    AND users.id = auth.uid()
    AND users.role IN ('owner', 'admin')
  )
);

-- USERS policies
-- Users can view all team members in their organization
CREATE POLICY "Users can view org members"
ON users FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can only update their own profile (non-role fields)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Only org admins can insert new users
CREATE POLICY "Org admins can invite users"
ON users FOR INSERT
WITH CHECK (
  get_user_org_id() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.org_id = (SELECT org_id FROM users WHERE id = auth.uid())
    AND users.role IN ('owner', 'admin')
  )
);

-- CONTACTS policies
-- Users can view contacts in their organization
CREATE POLICY "Users can view organization contacts"
ON contacts FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can insert contacts in their organization
CREATE POLICY "Users can create contacts"
ON contacts FOR INSERT
WITH CHECK (
  get_user_org_id() = org_id
);

-- Users can update contacts in their organization
CREATE POLICY "Users can update contacts"
ON contacts FOR UPDATE
USING (
  get_user_org_id() = org_id
);

-- Users can delete contacts in their organization
CREATE POLICY "Users can delete contacts"
ON contacts FOR DELETE
USING (
  get_user_org_id() = org_id
);

-- DEALS policies
-- Users can view deals in their organization
CREATE POLICY "Users can view organization deals"
ON deals FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can insert deals in their organization
CREATE POLICY "Users can create deals"
ON deals FOR INSERT
WITH CHECK (
  get_user_org_id() = org_id
);

-- Users can update deals in their organization
CREATE POLICY "Users can update deals"
ON deals FOR UPDATE
USING (
  get_user_org_id() = org_id
);

-- Users can delete deals in their organization
CREATE POLICY "Users can delete deals"
ON deals FOR DELETE
USING (
  get_user_org_id() = org_id
);

-- ACTIVITIES policies
-- Users can view activities in their organization
CREATE POLICY "Users can view organization activities"
ON activities FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can insert activities in their organization
CREATE POLICY "Users can create activities"
ON activities FOR INSERT
WITH CHECK (
  get_user_org_id() = org_id
);

-- ESTIMATES policies
-- Users can view estimates in their organization
CREATE POLICY "Users can view organization estimates"
ON estimates FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can insert estimates in their organization
CREATE POLICY "Users can create estimates"
ON estimates FOR INSERT
WITH CHECK (
  get_user_org_id() = org_id
);

-- Users can update estimates in their organization
CREATE POLICY "Users can update estimates"
ON estimates FOR UPDATE
USING (
  get_user_org_id() = org_id
);

-- Users can delete drafts in their organization
CREATE POLICY "Users can delete draft estimates"
ON estimates FOR DELETE
USING (
  get_user_org_id() = org_id
  AND status = 'draft'
);

-- INVOICES policies
-- Users can view invoices in their organization
CREATE POLICY "Users can view organization invoices"
ON invoices FOR SELECT
USING (
  get_user_org_id() = org_id
);

-- Users can insert invoices in their organization
CREATE POLICY "Users can create invoices"
ON invoices FOR INSERT
WITH CHECK (
  get_user_org_id() = org_id
);

-- Users can update invoices in their organization
CREATE POLICY "Users can update invoices"
ON invoices FOR UPDATE
USING (
  get_user_org_id() = org_id
);

-- Users can delete draft invoices in their organization
CREATE POLICY "Users can delete draft invoices"
ON invoices FOR DELETE
USING (
  get_user_org_id() = org_id
  AND status = 'draft'
);

-- ==================== AUTH HOOKS ====================

-- Function to create user record on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  org_id_var UUID;
BEGIN
  -- Extract org_id from user metadata or use a default
  org_id_var := COALESCE(
    (NEW.raw_user_meta_data->>'org_id')::UUID,
    (SELECT id FROM organizations ORDER BY created_at LIMIT 1) -- Fallback to first org
  );

  -- Only create user if org exists
  IF org_id_var IS NOT NULL THEN
    INSERT INTO public.users (id, org_id, email, name, role, is_active)
    VALUES (
      NEW.id,
      org_id_var,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'technician'),
      TRUE
    )
    ON CONFLICT (org_id, email) DO NOTHING;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating user record: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user record on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ==================== CONSTRAINTS & COMMENTS ====================

COMMENT ON FUNCTION get_user_org_id() IS 'Returns the organization ID of the currently authenticated user';
COMMENT ON FUNCTION user_has_org_access(UUID) IS 'Checks if the current user belongs to a specific organization';
COMMENT ON TABLE organizations IS 'Root organization entity for multi-tenant support';
COMMENT ON TABLE users IS 'Team members, linked to Supabase Auth users';
COMMENT ON TABLE contacts IS 'Customers and leads';
COMMENT ON TABLE deals IS 'Pipeline items representing sales opportunities';
COMMENT ON TABLE activities IS 'Timeline events related to deals and contacts';
COMMENT ON TABLE estimates IS 'Service estimates (quotes)';
COMMENT ON TABLE invoices IS 'Financial invoices with CRA compliance fields';
