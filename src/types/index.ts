export type PipelineStage =
  | 'new_lead'
  | 'contacted'
  | 'estimate_scheduled'
  | 'estimate_sent'
  | 'booked'
  | 'in_progress'
  | 'completed'
  | 'invoiced';

export type LeadSourceRing = 'ring_1' | 'ring_2' | 'ring_3';

export type LeadSource =
  // Ring 1: High-quality, existing relationships
  | 'existing_customer'
  | 'reactivation'
  | 'cross_sell'
  // Ring 2: Mid-quality, community
  | 'referral'
  | 'review'
  | 'neighborhood'
  // Ring 3: Lower-cost acquisition
  | 'google_lsa'
  | 'seo'
  | 'gbp';

export type ContactType = 'customer' | 'lead';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'estimate' | 'payment';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: ContactType;
  source: LeadSource;
  notes: string;
  createdAt: number;
}

export interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  stage: PipelineStage;
  source: LeadSource;
  assignedTo: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
  scheduledDate?: number;
}

export interface Activity {
  id: string;
  dealId?: string;
  contactId?: string;
  type: ActivityType;
  description: string;
  createdAt: number;
}

export type EstimateStatus = 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';

export interface EstimateTier {
  name: 'Good' | 'Better' | 'Best';
  description: string;
  price: number;
  features: string[];
}

export interface Estimate {
  id: string;
  number: string;
  contactId: string;
  dealId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  description: string;
  tiers: EstimateTier[];
  selectedTier?: 'Good' | 'Better' | 'Best';
  status: EstimateStatus;
  notes: string;
  validDays: number;
  createdAt: number;
  sentAt?: number;
  viewedAt?: number;
  respondedAt?: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  contactId: string;
  dealId?: string;
  estimateId?: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  notes: string;
  dueDate: number;
  province: string;
  taxType: string;
  createdAt: number;
  sentAt?: number;
  paidAt?: number;
}

export function getLeadSourceRing(source: LeadSource): LeadSourceRing {
  const ring1: LeadSource[] = ['existing_customer', 'reactivation', 'cross_sell'];
  const ring2: LeadSource[] = ['referral', 'review', 'neighborhood'];
  const ring3: LeadSource[] = ['google_lsa', 'seo', 'gbp'];

  if (ring1.includes(source)) return 'ring_1';
  if (ring2.includes(source)) return 'ring_2';
  return 'ring_3';
}

// Human-readable display labels for lead source rings
export const RING_DISPLAY_LABELS: Record<LeadSourceRing, string> = {
  ring_1: 'Ring 1',
  ring_2: 'Ring 2',
  ring_3: 'Ring 3',
};

export const RING_DISPLAY_SUBTITLES: Record<LeadSourceRing, string> = {
  ring_1: 'Harvest',
  ring_2: 'Amplify',
  ring_3: 'Acquire',
};

export function getRingDisplayLabel(ring: LeadSourceRing): string {
  return RING_DISPLAY_LABELS[ring];
}
