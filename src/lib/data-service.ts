'use client';

/**
 * Data Service Layer for GrowthOS
 *
 * This is the bridge between the frontend and the API. It provides the same
 * interface that the Zustand store used to provide, but fetches/writes to
 * the real database via API routes instead of localStorage.
 *
 * The store will use this service for all CRUD operations. When the API
 * is unavailable (no auth, offline), it falls back to localStorage gracefully.
 */

import { Contact, Deal, Activity, Estimate, Invoice, PipelineStage, EstimateStatus, InvoiceStatus } from '@/types';

// ==================== API Client ====================

const API_BASE = '/api';

interface ApiResponse<T> {
  data: T;
  error: string | null;
  meta?: { total?: number; page?: number; limit?: number };
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null as unknown as T, error: json.error || `HTTP ${res.status}` };
    }

    return json;
  } catch (err) {
    return { data: null as unknown as T, error: err instanceof Error ? err.message : 'Network error' };
  }
}

// ==================== Data Mappers ====================
// Convert between API (snake_case) and frontend (camelCase) formats

function mapContactFromApi(c: any): Contact {
  return {
    id: c.id,
    name: c.name,
    email: c.email || '',
    phone: c.phone || '',
    address: c.address || '',
    type: c.type,
    source: c.source,
    notes: c.notes || '',
    createdAt: new Date(c.created_at).getTime(),
  };
}

function mapContactToApi(c: Partial<Contact>) {
  const mapped: any = {};
  if (c.name !== undefined) mapped.name = c.name;
  if (c.email !== undefined) mapped.email = c.email;
  if (c.phone !== undefined) mapped.phone = c.phone;
  if (c.address !== undefined) mapped.address = c.address;
  if (c.type !== undefined) mapped.type = c.type;
  if (c.source !== undefined) mapped.source = c.source;
  if (c.notes !== undefined) mapped.notes = c.notes;
  return mapped;
}

function mapDealFromApi(d: any): Deal {
  return {
    id: d.id,
    contactId: d.contact_id,
    title: d.title,
    value: parseFloat(d.value) || 0,
    stage: d.stage,
    source: d.source,
    assignedTo: d.assigned_to_id || '',
    notes: d.notes || '',
    createdAt: new Date(d.created_at).getTime(),
    updatedAt: new Date(d.updated_at).getTime(),
    scheduledDate: d.scheduled_date ? new Date(d.scheduled_date).getTime() : undefined,
  };
}

function mapDealToApi(d: Partial<Deal>) {
  const mapped: any = {};
  if (d.contactId !== undefined) mapped.contact_id = d.contactId;
  if (d.title !== undefined) mapped.title = d.title;
  if (d.value !== undefined) mapped.value = d.value.toString();
  if (d.stage !== undefined) mapped.stage = d.stage;
  if (d.source !== undefined) mapped.source = d.source;
  if (d.assignedTo !== undefined) mapped.assigned_to_id = d.assignedTo || null;
  if (d.notes !== undefined) mapped.notes = d.notes;
  if (d.scheduledDate !== undefined) mapped.scheduled_date = d.scheduledDate ? new Date(d.scheduledDate).toISOString() : null;
  return mapped;
}

function mapActivityFromApi(a: any): Activity {
  return {
    id: a.id,
    dealId: a.deal_id || undefined,
    contactId: a.contact_id || undefined,
    type: a.type,
    description: a.description,
    createdAt: new Date(a.created_at).getTime(),
  };
}

function mapEstimateFromApi(e: any): Estimate {
  return {
    id: e.id,
    number: e.estimate_number,
    contactId: e.contact_id,
    dealId: e.deal_id || undefined,
    customerName: e.customer_name || '',
    customerEmail: e.customer_email || '',
    customerPhone: e.customer_phone || '',
    service: e.service || '',
    description: e.description || '',
    tiers: e.line_items || [],
    selectedTier: e.selected_tier || undefined,
    status: e.status,
    notes: e.notes || '',
    validDays: e.valid_days || 30,
    createdAt: new Date(e.created_at).getTime(),
    sentAt: e.sent_at ? new Date(e.sent_at).getTime() : undefined,
    viewedAt: e.viewed_at ? new Date(e.viewed_at).getTime() : undefined,
    respondedAt: e.responded_at ? new Date(e.responded_at).getTime() : undefined,
  };
}

function mapEstimateToApi(e: Partial<Estimate>) {
  const mapped: any = {};
  if (e.contactId !== undefined) mapped.contact_id = e.contactId;
  if (e.dealId !== undefined) mapped.deal_id = e.dealId;
  if (e.tiers !== undefined) mapped.line_items = e.tiers;
  if (e.status !== undefined) mapped.status = e.status;
  if (e.notes !== undefined) mapped.notes = e.notes;
  if (e.service !== undefined) mapped.service = e.service;
  if (e.description !== undefined) mapped.description = e.description;
  return mapped;
}

function mapInvoiceFromApi(inv: any): Invoice {
  return {
    id: inv.id,
    number: inv.invoice_number,
    contactId: inv.contact_id,
    dealId: inv.deal_id || undefined,
    estimateId: inv.estimate_id || undefined,
    customerName: inv.customer_name || '',
    customerEmail: inv.customer_email || '',
    customerAddress: inv.customer_address || '',
    lineItems: inv.line_items || [],
    subtotal: parseFloat(inv.subtotal) || 0,
    taxRate: parseFloat(inv.tax_rate) || 0,
    taxAmount: parseFloat(inv.tax_amount) || 0,
    total: parseFloat(inv.total) || 0,
    amountPaid: parseFloat(inv.amount_paid) || 0,
    status: inv.status,
    notes: inv.notes || '',
    dueDate: inv.due_date ? new Date(inv.due_date).getTime() : Date.now(),
    province: inv.province || '',
    taxType: inv.tax_type || '',
    createdAt: new Date(inv.created_at).getTime(),
    sentAt: inv.sent_at ? new Date(inv.sent_at).getTime() : undefined,
    paidAt: inv.paid_at ? new Date(inv.paid_at).getTime() : undefined,
  };
}

function mapInvoiceToApi(inv: Partial<Invoice>) {
  const mapped: any = {};
  if (inv.contactId !== undefined) mapped.contact_id = inv.contactId;
  if (inv.dealId !== undefined) mapped.deal_id = inv.dealId;
  if (inv.estimateId !== undefined) mapped.estimate_id = inv.estimateId;
  if (inv.lineItems !== undefined) mapped.line_items = inv.lineItems;
  if (inv.subtotal !== undefined) mapped.subtotal = inv.subtotal.toString();
  if (inv.taxRate !== undefined) mapped.tax_rate = inv.taxRate.toString();
  if (inv.taxAmount !== undefined) mapped.tax_amount = inv.taxAmount.toString();
  if (inv.total !== undefined) mapped.total = inv.total.toString();
  if (inv.status !== undefined) mapped.status = inv.status;
  if (inv.notes !== undefined) mapped.notes = inv.notes;
  if (inv.dueDate !== undefined) mapped.due_date = new Date(inv.dueDate).toISOString();
  if (inv.province !== undefined) mapped.province = inv.province;
  if (inv.taxType !== undefined) mapped.tax_type = inv.taxType;
  return mapped;
}

// ==================== Data Service ====================

export const dataService = {
  // ---------- Contacts ----------
  async getContacts(params?: { search?: string; type?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.type) query.set('type', params.type);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    const res = await apiFetch<any[]>(`/contacts${qs ? `?${qs}` : ''}`);
    if (res.error) throw new Error(res.error);
    return { data: (res.data || []).map(mapContactFromApi), meta: res.meta };
  },

  async getContact(id: string) {
    const res = await apiFetch<any>(`/contacts/${id}`);
    if (res.error) throw new Error(res.error);
    return mapContactFromApi(res.data);
  },

  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>) {
    const res = await apiFetch<any>('/contacts', {
      method: 'POST',
      body: JSON.stringify(mapContactToApi(contact)),
    });
    if (res.error) throw new Error(res.error);
    return mapContactFromApi(res.data);
  },

  async updateContact(id: string, updates: Partial<Contact>) {
    const res = await apiFetch<any>(`/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapContactToApi(updates)),
    });
    if (res.error) throw new Error(res.error);
    return mapContactFromApi(res.data);
  },

  async deleteContact(id: string) {
    const res = await apiFetch<any>(`/contacts/${id}`, { method: 'DELETE' });
    if (res.error) throw new Error(res.error);
  },

  // ---------- Deals ----------
  async getDeals(params?: { stage?: PipelineStage; contactId?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.stage) query.set('stage', params.stage);
    if (params?.contactId) query.set('contactId', params.contactId);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    const res = await apiFetch<any[]>(`/deals${qs ? `?${qs}` : ''}`);
    if (res.error) throw new Error(res.error);
    return { data: (res.data || []).map(mapDealFromApi), meta: res.meta };
  },

  async getDeal(id: string) {
    const res = await apiFetch<any>(`/deals/${id}`);
    if (res.error) throw new Error(res.error);
    return mapDealFromApi(res.data);
  },

  async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
    const res = await apiFetch<any>('/deals', {
      method: 'POST',
      body: JSON.stringify(mapDealToApi(deal)),
    });
    if (res.error) throw new Error(res.error);
    return mapDealFromApi(res.data);
  },

  async updateDeal(id: string, updates: Partial<Deal>) {
    const res = await apiFetch<any>(`/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapDealToApi(updates)),
    });
    if (res.error) throw new Error(res.error);
    return mapDealFromApi(res.data);
  },

  async deleteDeal(id: string) {
    const res = await apiFetch<any>(`/deals/${id}`, { method: 'DELETE' });
    if (res.error) throw new Error(res.error);
  },

  // ---------- Activities ----------
  async getActivities(params?: { dealId?: string; contactId?: string; type?: string; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.dealId) query.set('dealId', params.dealId);
    if (params?.contactId) query.set('contactId', params.contactId);
    if (params?.type) query.set('type', params.type);
    if (params?.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    const res = await apiFetch<any[]>(`/activities${qs ? `?${qs}` : ''}`);
    if (res.error) throw new Error(res.error);
    return { data: (res.data || []).map(mapActivityFromApi), meta: res.meta };
  },

  async createActivity(activity: Omit<Activity, 'id' | 'createdAt'>) {
    const mapped: any = {
      type: activity.type,
      description: activity.description,
    };
    if (activity.dealId) mapped.deal_id = activity.dealId;
    if (activity.contactId) mapped.contact_id = activity.contactId;
    const res = await apiFetch<any>('/activities', {
      method: 'POST',
      body: JSON.stringify(mapped),
    });
    if (res.error) throw new Error(res.error);
    return mapActivityFromApi(res.data);
  },

  // ---------- Estimates ----------
  async getEstimates(params?: { contactId?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.contactId) query.set('contactId', params.contactId);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    const res = await apiFetch<any[]>(`/estimates${qs ? `?${qs}` : ''}`);
    if (res.error) throw new Error(res.error);
    return { data: (res.data || []).map(mapEstimateFromApi), meta: res.meta };
  },

  async getEstimate(id: string) {
    const res = await apiFetch<any>(`/estimates/${id}`);
    if (res.error) throw new Error(res.error);
    return mapEstimateFromApi(res.data);
  },

  async createEstimate(estimate: Omit<Estimate, 'id' | 'number' | 'createdAt'>) {
    const res = await apiFetch<any>('/estimates', {
      method: 'POST',
      body: JSON.stringify(mapEstimateToApi(estimate)),
    });
    if (res.error) throw new Error(res.error);
    return mapEstimateFromApi(res.data);
  },

  async updateEstimate(id: string, updates: Partial<Estimate>) {
    const res = await apiFetch<any>(`/estimates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapEstimateToApi(updates)),
    });
    if (res.error) throw new Error(res.error);
    return mapEstimateFromApi(res.data);
  },

  async deleteEstimate(id: string) {
    const res = await apiFetch<any>(`/estimates/${id}`, { method: 'DELETE' });
    if (res.error) throw new Error(res.error);
  },

  // ---------- Invoices ----------
  async getInvoices(params?: { contactId?: string; status?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.contactId) query.set('contactId', params.contactId);
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    const qs = query.toString();
    const res = await apiFetch<any[]>(`/invoices${qs ? `?${qs}` : ''}`);
    if (res.error) throw new Error(res.error);
    return { data: (res.data || []).map(mapInvoiceFromApi), meta: res.meta };
  },

  async getInvoice(id: string) {
    const res = await apiFetch<any>(`/invoices/${id}`);
    if (res.error) throw new Error(res.error);
    return mapInvoiceFromApi(res.data);
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'number' | 'createdAt'>) {
    const res = await apiFetch<any>('/invoices', {
      method: 'POST',
      body: JSON.stringify(mapInvoiceToApi(invoice)),
    });
    if (res.error) throw new Error(res.error);
    return mapInvoiceFromApi(res.data);
  },

  async updateInvoice(id: string, updates: Partial<Invoice>) {
    const res = await apiFetch<any>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(mapInvoiceToApi(updates)),
    });
    if (res.error) throw new Error(res.error);
    return mapInvoiceFromApi(res.data);
  },

  async deleteInvoice(id: string) {
    const res = await apiFetch<any>(`/invoices/${id}`, { method: 'DELETE' });
    if (res.error) throw new Error(res.error);
  },

  async recordPayment(invoiceId: string, amount: number) {
    const res = await apiFetch<any>(`/invoices/${invoiceId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    if (res.error) throw new Error(res.error);
    return mapInvoiceFromApi(res.data);
  },

  // ---------- Settings ----------
  async getSettings() {
    const res = await apiFetch<any>('/settings');
    if (res.error) throw new Error(res.error);
    return res.data;
  },

  async updateSettings(updates: Record<string, any>) {
    const res = await apiFetch<any>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    if (res.error) throw new Error(res.error);
    return res.data;
  },

  // ---------- Auth ----------
  async getCurrentUser() {
    const res = await apiFetch<any>('/auth/me');
    if (res.error) throw new Error(res.error);
    return res.data;
  },
};

export type DataService = typeof dataService;
