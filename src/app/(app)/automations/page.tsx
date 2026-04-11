'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useStore } from '@/store';
import {
  Zap, Play, Pause, Clock, Mail, MessageSquare, Star, DollarSign,
  Users, Calendar, ChevronRight, CheckCircle2, ArrowRight, Shield,
  Sparkles, TrendingUp, RotateCcw, Sun, Snowflake, Bell, Settings,
  Copy, Eye, ToggleLeft, Lightbulb, Target, Heart, Phone, AlertCircle,
  X, Filter, Trash2
} from 'lucide-react';
import type { Contact, Deal, Estimate, Invoice } from '@/types';

// ============================================================
// TYPES
// ============================================================

type PlaybookCategory = 'all' | 'lead_capture' | 'follow_up' | 'retention' | 'revenue';

interface AutomationStep {
  type: 'email' | 'sms' | 'wait' | 'condition' | 'action';
  label: string;
  detail: string;
  icon: 'mail' | 'sms' | 'clock' | 'check' | 'zap' | 'phone';
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  category: PlaybookCategory;
  impact: string;
  impactColor: string;
  steps: AutomationStep[];
  stats: { label: string; value: string }[];
  isActive: boolean;
  isPremium: boolean;
  templates: TemplatePreview[];
}

interface TemplatePreview {
  type: 'email' | 'sms';
  name: string;
  subject?: string;
  body: string;
}

interface SimulatedAction {
  id?: string;
  playbookId: string;
  playbookName: string;
  type: 'email' | 'sms' | 'notification';
  recipientName: string;
  recipientContact: string;
  message: string;
  subject?: string;
  status: 'sent' | 'pending';
  triggeredAt?: number;
}

interface StoreState {
  contacts: Contact[];
  deals: Deal[];
  estimates: Estimate[];
  invoices: Invoice[];
}

// ============================================================
// PLAYBOOK DATA — The out-of-the-box automations
// ============================================================

const PLAYBOOKS: Playbook[] = [
  {
    id: 'speed-to-lead',
    name: 'Speed to Lead',
    description: 'Reply to leads instantly with a customized message',
    category: 'lead_capture',
    impact: 'Converts 15% more leads',
    impactColor: 'from-amber-400 to-orange-500',
    steps: [
      { type: 'condition', label: 'Contact Submits Form', detail: 'Any form submission', icon: 'check' },
      { type: 'wait', label: 'Wait', detail: '2 minutes', icon: 'clock' },
      { type: 'email', label: 'Send Email', detail: 'Custom message', icon: 'mail' },
      { type: 'action', label: 'Tag Contact', detail: '"Form Responder"', icon: 'zap' },
    ],
    stats: [
      { label: 'Active', value: '342' },
      { label: 'Reply Rate', value: '18%' },
    ],
    isActive: true,
    isPremium: false,
    templates: [
      {
        type: 'email',
        name: 'Speed to Lead',
        subject: 'Thanks for reaching out!',
        body: 'Hi {{firstName}},\n\nWe received your message and wanted to get back to you quickly. Here\'s what happens next...\n\nBest,\nTeam',
      },
    ],
  },
  {
    id: 'estimate-reminder',
    name: 'Estimate Auto-Reminder',
    description: 'Remind customers to approve pending estimates after 3 days',
    category: 'follow_up',
    impact: 'Reduces quote drop-off',
    impactColor: 'from-blue-400 to-cyan-500',
    steps: [
      { type: 'condition', label: 'Estimate Sent', detail: 'Status = Sent', icon: 'check' },
      { type: 'wait', label: 'Wait', detail: '3 days', icon: 'clock' },
      { type: 'email', label: 'Send Reminder', detail: 'Custom message', icon: 'mail' },
      { type: 'action', label: 'Notify You', detail: 'Slack notification', icon: 'zap' },
    ],
    stats: [
      { label: 'Active', value: '89' },
      { label: 'Approval Rate', value: '42%' },
    ],
    isActive: true,
    isPremium: false,
    templates: [
      {
        type: 'email',
        name: 'Estimate Reminder',
        subject: 'Follow-up: Your estimate is ready',
        body: 'Hi {{firstName}},\n\nJust a friendly reminder that we sent you an estimate on {{estimateDate}}. If you have any questions, let\'s talk!\n\nBest',
      },
    ],
  },
  {
    id: 'invoice-followup',
    name: 'Invoice Payment Reminder',
    description: 'Send automatic payment reminders for overdue invoices',
    category: 'revenue',
    impact: 'Improves payment speed by 5 days',
    impactColor: 'from-green-400 to-emerald-500',
    steps: [
      { type: 'condition', label: 'Invoice Due', detail: 'Days Overdue > 0', icon: 'check' },
      { type: 'wait', label: 'Wait', detail: '7 days', icon: 'clock' },
      { type: 'email', label: 'Send Reminder', detail: 'Payment request', icon: 'mail' },
      { type: 'action', label: 'Create Task', detail: 'Follow up manually', icon: 'zap' },
    ],
    stats: [
      { label: 'Active', value: '156' },
      { label: 'Recovery Rate', value: '67%' },
    ],
    isActive: true,
    isPremium: true,
    templates: [
      {
        type: 'email',
        name: 'Payment Reminder',
        subject: 'Payment reminder: Invoice {{invoiceNumber}}',
        body: 'Hi {{firstName}},\n\nThis is a friendly reminder that invoice {{invoiceNumber}} for ${{amount}} is now due. Please submit payment at your earliest convenience.\n\nThank you!',
      },
    ],
  },
  {
    id: 'win-followup',
    name: 'Post-Win Follow-up',
    description: 'Thank customers after they approve an estimate',
    category: 'retention',
    impact: 'Builds customer loyalty',
    impactColor: 'from-pink-400 to-rose-500',
    steps: [
      { type: 'condition', label: 'Estimate Approved', detail: 'Status = Approved', icon: 'check' },
      { type: 'wait', label: 'Wait', detail: 'Immediate', icon: 'clock' },
      { type: 'email', label: 'Send Thank You', detail: 'Confirmation email', icon: 'mail' },
      { type: 'action', label: 'Create Invoice', detail: 'Auto-generate', icon: 'zap' },
    ],
    stats: [
      { label: 'Active', value: '234' },
      { label: 'Engagement', value: '73%' },
    ],
    isActive: false,
    isPremium: false,
    templates: [
      {
        type: 'email',
        name: 'Win Thank You',
        subject: 'We\'re excited to get started!',
        body: 'Hi {{firstName}},\n\nThank you for approving the estimate. We\'re excited to get started on your project. Here\'s what comes next...\n\nBest',
      },
    ],
  },
  {
    id: 'review-request',
    name: 'Review Request',
    description: 'Automatically request reviews from completed jobs',
    category: 'retention',
    impact: 'Increases review volume by 40%',
    impactColor: 'from-purple-400 to-indigo-500',
    steps: [
      { type: 'condition', label: 'Deal Completed', detail: 'Status = Completed', icon: 'check' },
      { type: 'wait', label: 'Wait', detail: '2 days', icon: 'clock' },
      { type: 'sms', label: 'Send SMS', detail: 'Review link', icon: 'sms' },
      { type: 'action', label: 'Track Response', detail: 'Click tracking', icon: 'zap' },
    ],
    stats: [
      { label: 'Active', value: '567' },
      { label: 'Response Rate', value: '34%' },
    ],
    isActive: true,
    isPremium: true,
    templates: [
      {
        type: 'sms',
        name: 'Review Request SMS',
        body: 'Hi {{firstName}}! We\'d love to hear about your experience. Leave a quick review: {{reviewLink}}',
      },
    ],
  },
];

// ============================================================
// HANDLERS
// ============================================================

function handlePlaybookToggle(
  playbookId: string,
  isActive: boolean,
  onUpdate: (id: string, active: boolean) => void
): void {
  onUpdate(playbookId, !isActive);
}

function handleSimulatedAction(
  action: SimulatedAction,
  onSimulate: (action: SimulatedAction) => void
): void {
  onSimulate(action);
}

function handlePlaybookSelect(
  playbook: Playbook,
  onSelect: (pb: Playbook) => void
): void {
  onSelect(playbook);
}

function handleContactSelect(
  contact: Contact,
  onSelect: (c: Contact) => void
): void {
  onSelect(contact);
}

function handleDealSelect(
  deal: Deal,
  onSelect: (d: Deal) => void
): void {
  onSelect(deal);
}

function handleEstimateSelect(
  estimate: Estimate,
  onSelect: (e: Estimate) => void
): void {
  onSelect(estimate);
}

function handleInvoiceSelect(
  invoice: Invoice,
  onSelect: (i: Invoice) => void
): void {
  onSelect(invoice);
}

function handleInputChange(
  e: React.ChangeEvent<HTMLInputElement>,
  onChangeCallback: (value: string) => void
): void {
  onChangeCallback(e.target.value);
}

function handleTextareaChange(
  e: React.ChangeEvent<HTMLTextAreaElement>,
  onChangeCallback: (value: string) => void
): void {
  onChangeCallback(e.target.value);
}

function handleSelectChange(
  e: React.ChangeEvent<HTMLSelectElement>,
  onChangeCallback: (value: string) => void
): void {
  onChangeCallback(e.target.value);
}

function handleButtonClick(
  onClick: () => void
): void {
  onClick();
}

function handleStepClick(
  step: AutomationStep,
  onStepClick: (step: AutomationStep) => void
): void {
  onStepClick(step);
}

function handleTemplateSelect(
  template: TemplatePreview,
  onTemplateSelect: (template: TemplatePreview) => void
): void {
  onTemplateSelect(template);
}

function handleFilterChange(
  category: PlaybookCategory,
  onFilterChange: (cat: PlaybookCategory) => void
): void {
  onFilterChange(category);
}

function handleDeleteClick(
  playbookId: string,
  onDelete: (id: string) => void
): void {
  onDelete(playbookId);
}

function handleCopyClick(
  playbook: Playbook,
  onCopy: (pb: Playbook) => void
): void {
  onCopy(playbook);
}

function handleViewClick(
  playbook: Playbook,
  onView: (pb: Playbook) => void
): void {
  onView(playbook);
}

function handleIconSelect(
  icon: string,
  onIconSelect: (icon: string) => void
): void {
  onIconSelect(icon);
}

function handleDataFetch(
  store: StoreState,
  onDataLoaded: (data: StoreState) => void
): void {
  onDataLoaded(store);
}

// ============================================================
// COMPONENTS
// ============================================================

function PlaybookCard({ playbook, onToggle, onView }: { playbook: Playbook; onToggle: (id: string, active: boolean) => void; onView: (pb: Playbook) => void }) {
  return (
    <div key={playbook.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{playbook.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{playbook.description}</p>
          </div>
          <button
            onClick={() => handlePlaybookToggle(playbook.id, playbook.isActive, onToggle)}
            className={`ml-3 flex-shrink-0 w-12 h-7 rounded-full transition-colors ${
              playbook.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                playbook.isActive ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${playbook.impactColor} text-white`}>
            <Sparkles className="w-3 h-3 mr-1" />
            {playbook.impact}
          </div>
          {playbook.isPremium && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          {playbook.stats.map((stat, i) => (
            <div key={i}>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => handleViewClick(playbook, onView)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function SimulationPanel({ playbook, contacts, onSimulate }: { playbook: Playbook; contacts: Contact[]; onSimulate: (action: SimulatedAction) => void }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [simulatedActions, setSimulatedActions] = useState<SimulatedAction[]>([]);

  const handleSimulate = () => {
    if (!selectedContact) return;
    const newAction: SimulatedAction = {
      playbookId: playbook.id,
      playbookName: playbook.name,
      type: 'email',
      recipientName: selectedContact.name,
      recipientContact: selectedContact.email,
      message: `Hello ${selectedContact.name}, this is a test message from ${playbook.name}.`,
      status: 'pending',
      triggeredAt: Date.now(),
    };
    setSimulatedActions([...simulatedActions, newAction]);
    handleSimulatedAction(newAction, onSimulate);
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Test this automation</h4>
      </div>
      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">Send a test message to see how this automation works in action.</p>
      <div className="flex gap-2">
        <select
          value={selectedContact?.id || ''}
          onChange={(e) => {
            const contact = contacts.find((c) => c.id === e.target.value);
            if (contact) handleContactSelect(contact, setSelectedContact);
          }}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-blue-300 dark:border-blue-600 rounded-lg text-sm"
        >
          <option value="">Select a contact...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSimulate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          disabled={!selectedContact}
        >
          Test
        </button>
      </div>
      {simulatedActions.length > 0 && (
        <div className="mt-3 space-y-2">
          {simulatedActions.map((action) => (
            <div key={action.id} className="text-xs bg-white dark:bg-slate-700 p-2 rounded text-slate-700 dark:text-slate-300">
              {action.type === 'email' && <Mail className="w-3 h-3 inline mr-1" />}
              Sent {action.type} to {action.recipientName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function AutomationsPage() {
  const { t } = useLanguage();
  const store = useStore();
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<PlaybookCategory>('all');
  const [showSimulation, setShowSimulation] = useState(false);

  const filteredPlaybooks = categoryFilter === 'all' ? PLAYBOOKS : PLAYBOOKS.filter((pb) => pb.category === categoryFilter);

  const handlePlaybookUpdate = (playbookId: string, isActive: boolean) => {
    // In production, this would make an API call
    console.log(`Updated playbook ${playbookId} to active: ${isActive}`);
  };

  const handleSimulateAction = (action: SimulatedAction) => {
    // In production, this would make an API call
    console.log('Simulated action:', action);
  };

  const storeData: StoreState = {
    contacts: store.contacts,
    deals: store.deals,
    estimates: store.estimates,
    invoices: store.invoices,
  };

  handleDataFetch(storeData, (data) => {
    console.log('Store data loaded:', data);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('automations.title')}</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <Zap className="w-5 h-5" />
              Create Automation
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">{t('automations.description')}</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'lead_capture', 'follow_up', 'retention', 'revenue'] as PlaybookCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat, setCategoryFilter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat.replace(/_/g, ' ').charAt(0).toUpperCase() + cat.replace(/_/g, ' ').slice(1)}
            </button>
          ))}
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredPlaybooks.map((playbook) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              onToggle={handlePlaybookUpdate}
              onView={(pb) => {
                handlePlaybookSelect(pb, setSelectedPlaybook);
                setShowSimulation(false);
              }}
            />
          ))}
        </div>

        {/* Details Panel */}
        {selectedPlaybook && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedPlaybook.name}</h2>
                <p className="text-slate-600 dark:text-slate-400">{selectedPlaybook.description}</p>
              </div>
              <button
                onClick={() => setSelectedPlaybook(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Automation Steps</h3>
              <div className="space-y-3">
                {selectedPlaybook.steps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => handleStepClick(step, (s) => console.log('Step clicked:', s))}
                    className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{step.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            {selectedPlaybook.templates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Templates</h3>
                <div className="space-y-3">
                  {selectedPlaybook.templates.map((template, index) => (
                    <div
                      key={index}
                      onClick={() => handleTemplateSelect(template, (t) => console.log('Template selected:', t))}
                      className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {template.type === 'email' && <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                        {template.type === 'sms' && <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />}
                        <p className="font-medium text-slate-900 dark:text-white">{template.name}</p>
                      </div>
                      {template.subject && (
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject: {template.subject}</p>
                      )}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{template.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Section */}
            <SimulationPanel
              playbook={selectedPlaybook}
              contacts={store.contacts}
              onSimulate={handleSimulateAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}