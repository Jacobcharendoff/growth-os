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

// ============================================================
// PLAYBOOK DATA — The out-of-the-box automations
// ============================================================

const PLAYBOOKS: Playbook[] = [
  {
    id: 'speed-to-lead',
    name: 'Speed to Lead',
    description: 'Respond to new leads within 60 seconds. The first business to respond wins the job 78% of the time.',
    category: 'lead_capture',
    impact: '+78% conversion',
    impactColor: 'text-emerald-600 bg-emerald-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Avg response time', value: '<60s' },
      { label: 'Industry avg', value: '4.2 hrs' },
      { label: 'Win rate lift', value: '+78%' },
    ],
    steps: [
      { type: 'action', label: 'New lead enters pipeline', detail: 'Any source: call, form, ad, referral', icon: 'zap' },
      { type: 'sms', label: 'Instant SMS to customer', detail: '"Hi {first_name}, thanks for reaching out to {company}! We got your request and someone will call you within the hour."', icon: 'sms' },
      { type: 'email', label: 'Detailed email follow-up', detail: 'Professional intro email with services, reviews link, and booking calendar', icon: 'mail' },
      { type: 'action', label: 'Notify assigned tech', detail: 'Push notification + SMS to the assigned technician with lead details', icon: 'phone' },
      { type: 'wait', label: 'Wait 2 hours', detail: 'If no response from the customer...', icon: 'clock' },
      { type: 'sms', label: 'Gentle follow-up SMS', detail: '"Hey {first_name}, just making sure you got our message. Would you like to schedule a time for us to come take a look?"', icon: 'sms' },
    ],
    templates: [
      {
        type: 'sms',
        name: 'Instant Lead Response',
        body: 'Hi {first_name}! Thanks for reaching out to {company_name}. We received your request for {service_type} and a team member will call you within the hour. Reply STOP to opt out.',
      },
      {
        type: 'email',
        name: 'New Lead Welcome',
        subject: '{company_name} — We Got Your Request!',
        body: 'Hi {first_name},\n\nThank you for contacting {company_name}! We received your request for {service_type} and we\'re excited to help.\n\nHere\'s what happens next:\n1. A team member will call you within the hour to discuss your needs\n2. We\'ll schedule a convenient time to come assess the job\n3. You\'ll receive a detailed estimate with Good/Better/Best options\n\nIn the meantime, check out what our customers say about us: {reviews_link}\n\nNeed us sooner? Call us directly: {company_phone}\n\nBest,\n{company_name} Team',
      },
    ],
  },
  {
    id: 'estimate-follow-up',
    name: 'Estimate Follow-Up Machine',
    description: 'Automatically follow up on sent estimates at 24hrs, 72hrs, and 7 days. Most jobs are lost to silence, not competition.',
    category: 'follow_up',
    impact: '+35% close rate',
    impactColor: 'text-blue-600 bg-blue-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Estimates recovered', value: '35%' },
      { label: 'Avg time to close', value: '-2.1 days' },
      { label: 'Revenue impact', value: '+$4,200/mo' },
    ],
    steps: [
      { type: 'action', label: 'Estimate sent to customer', detail: 'Triggers when estimate status changes to "Sent"', icon: 'zap' },
      { type: 'wait', label: 'Wait 24 hours', detail: 'Give them time to review', icon: 'clock' },
      { type: 'sms', label: 'Friendly check-in SMS', detail: '"Hey {first_name}, just checking in — did you get a chance to look over the estimate we sent? Happy to answer any questions!"', icon: 'sms' },
      { type: 'condition', label: 'If no response...', detail: 'Check if estimate status is still "Sent"', icon: 'check' },
      { type: 'wait', label: 'Wait 48 more hours', detail: '72 hours total since estimate sent', icon: 'clock' },
      { type: 'email', label: 'Value-add follow-up email', detail: 'Highlight the "Better" option, include testimonial, create gentle urgency', icon: 'mail' },
      { type: 'wait', label: 'Wait 4 more days', detail: '7 days total since estimate sent', icon: 'clock' },
      { type: 'sms', label: 'Final follow-up', detail: '"Hi {first_name}, our estimate for your {service_type} is still available. Would you like to move forward or have any questions? We\'re here to help!"', icon: 'sms' },
    ],
    templates: [
      {
        type: 'sms',
        name: '24hr Estimate Check-in',
        body: 'Hey {first_name}, just checking in — did you get a chance to look over the estimate we sent for {service_type}? Happy to answer any questions! - {tech_name} at {company_name}',
      },
      {
        type: 'email',
        name: '72hr Estimate Follow-up',
        subject: 'Quick question about your {service_type} estimate',
        body: 'Hi {first_name},\n\nI wanted to follow up on the estimate we sent for {service_type} at {address}.\n\nA lot of our customers choose the "Better" option because it includes {better_highlight} — which saves money long-term.\n\nHere\'s what {recent_customer} said after their project:\n"{testimonial_text}"\n\nWe\'re booking up for {current_month}, so let me know if you\'d like to get on the schedule. Happy to answer any questions!\n\nBest,\n{tech_name}\n{company_name}',
      },
      {
        type: 'sms',
        name: '7-Day Final Follow-up',
        body: 'Hi {first_name}, our estimate for your {service_type} is still available. Would you like to move forward or have any questions? We\'d love to help! - {company_name}',
      },
    ],
  },
  {
    id: 'review-machine',
    name: '5-Star Review Machine',
    description: 'Automatically request Google reviews after every completed job. Gets you more Google reviews without you lifting a finger.',
    category: 'retention',
    impact: '+12 reviews/mo',
    impactColor: 'text-amber-600 bg-amber-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Review request rate', value: '100%' },
      { label: 'Conversion to review', value: '22%' },
      { label: 'Avg rating', value: '4.8★' },
    ],
    steps: [
      { type: 'action', label: 'Job marked as complete', detail: 'Triggers when deal stage moves to "Completed"', icon: 'zap' },
      { type: 'wait', label: 'Wait 2 hours', detail: 'Let them enjoy the finished work first', icon: 'clock' },
      { type: 'sms', label: 'Personal thank-you + review ask', detail: '"Thanks for choosing {company}! If {tech_name} did a great job, would you mind leaving us a quick Google review? {review_link}"', icon: 'sms' },
      { type: 'condition', label: 'If no review after 3 days...', detail: 'Check if Google review was posted', icon: 'check' },
      { type: 'email', label: 'Gentle email reminder', detail: 'Thank-you email with one-click review link and photos of completed work', icon: 'mail' },
    ],
    templates: [
      {
        type: 'sms',
        name: 'Post-Job Review Request',
        body: 'Hi {first_name}! Thanks for choosing {company_name} for your {service_type}. If {tech_name} did a great job today, we\'d really appreciate a quick Google review — it helps other homeowners find us! {review_link}',
      },
      {
        type: 'email',
        name: 'Review Reminder Email',
        subject: 'How did we do, {first_name}?',
        body: 'Hi {first_name},\n\nThank you for trusting {company_name} with your {service_type}! We hope everything is working perfectly.\n\nIf you have 30 seconds, a Google review would mean the world to us. It\'s the #1 way homeowners find great service companies, and your experience helps others make the right choice.\n\nLeave a review: {review_link}\n\nThank you for your support!\n\n{company_name} Team',
      },
    ],
  },
  {
    id: 'payment-chaser',
    name: 'Payment Chaser',
    description: 'Automated invoice reminders at 7, 14, and 30 days. Stop chasing payments manually — let the system do it.',
    category: 'revenue',
    impact: '-15 days DSO',
    impactColor: 'text-emerald-600 bg-emerald-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Avg. Days to Get Paid', value: '-15 days' },
      { label: 'Collection rate', value: '94%' },
      { label: 'Cash flow impact', value: '+$8K/mo' },
    ],
    steps: [
      { type: 'action', label: 'Invoice sent to customer', detail: 'Triggers when invoice is created and sent', icon: 'zap' },
      { type: 'wait', label: 'Wait 7 days', detail: 'If payment not received...', icon: 'clock' },
      { type: 'sms', label: 'Friendly payment reminder', detail: '"Hey {first_name}, friendly reminder that invoice #{invoice_number} for ${amount} is due. Pay online here: {payment_link}"', icon: 'sms' },
      { type: 'wait', label: 'Wait 7 more days', detail: '14 days total — if still unpaid...', icon: 'clock' },
      { type: 'email', label: 'Formal payment reminder', detail: 'Professional email with invoice attached, payment link, and due date reminder', icon: 'mail' },
      { type: 'wait', label: 'Wait 16 more days', detail: '30 days total — final notice', icon: 'clock' },
      { type: 'email', label: 'Final notice email', detail: 'Firm but professional final reminder with late fee warning', icon: 'mail' },
      { type: 'action', label: 'Flag for manual follow-up', detail: 'Adds to "Collections" queue for office manager to call', icon: 'phone' },
    ],
    templates: [
      {
        type: 'sms',
        name: '7-Day Payment Reminder',
        body: 'Hi {first_name}, friendly reminder that your invoice #{invoice_number} for ${amount} is due. You can pay securely online: {payment_link} — Thanks, {company_name}',
      },
      {
        type: 'email',
        name: '14-Day Payment Reminder',
        subject: 'Payment reminder — Invoice #{invoice_number}',
        body: 'Hi {first_name},\n\nThis is a friendly reminder that invoice #{invoice_number} for ${amount} is now 14 days past due.\n\nJob: {service_type} at {address}\nAmount due: ${amount}\nDue date: {due_date}\n\nPay securely online: {payment_link}\n\nIf you\'ve already sent payment, please disregard this message. If you have questions about the invoice, just reply to this email.\n\nThank you,\n{company_name}',
      },
      {
        type: 'email',
        name: '30-Day Final Notice',
        subject: 'Final notice — Invoice #{invoice_number} is 30 days past due',
        body: 'Hi {first_name},\n\nOur records show that invoice #{invoice_number} for ${amount} is now 30 days past due.\n\nTo avoid a late fee, please process payment by {final_date}.\n\nPay now: {payment_link}\n\nIf there\'s an issue with the invoice or you need to set up a payment plan, please call us at {company_phone}. We\'re happy to work with you.\n\nThank you,\n{company_name}',
      },
    ],
  },
  {
    id: 'appointment-reminders',
    name: 'Appointment Reminders',
    description: 'Reduce no-shows with automatic reminders at 24hrs, 2hrs, and an "on my way" text. Customers love the communication.',
    category: 'follow_up',
    impact: '-60% no-shows',
    impactColor: 'text-blue-600 bg-blue-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'No-show reduction', value: '60%' },
      { label: 'Fewer no-shows', value: '+40%' },
      { label: 'Time saved/week', value: '3.5 hrs' },
    ],
    steps: [
      { type: 'action', label: 'Job scheduled on calendar', detail: 'Triggers when deal moves to "Booked" stage', icon: 'zap' },
      { type: 'email', label: 'Booking confirmation email', detail: 'Confirms date, time window, technician name, what to expect', icon: 'mail' },
      { type: 'wait', label: '24 hours before appointment', detail: 'Timed reminder', icon: 'clock' },
      { type: 'sms', label: 'Day-before reminder', detail: '"Hi {first_name}, reminder that {tech_name} will be at {address} tomorrow between {time_window}. Reply C to confirm or R to reschedule."', icon: 'sms' },
      { type: 'wait', label: '2 hours before appointment', detail: 'Final heads up', icon: 'clock' },
      { type: 'sms', label: '"On my way" text', detail: '"Hi {first_name}, {tech_name} is headed your way and should arrive by {eta}. See you soon!"', icon: 'sms' },
    ],
    templates: [
      {
        type: 'email',
        name: 'Booking Confirmation',
        subject: 'Your appointment with {company_name} is confirmed!',
        body: 'Hi {first_name},\n\nYour appointment is confirmed!\n\nDate: {appointment_date}\nTime window: {time_window}\nTechnician: {tech_name}\nService: {service_type}\nAddress: {address}\n\nWhat to expect:\n- {tech_name} will call when they\'re 15 minutes away\n- The visit typically takes {duration}\n- You\'ll receive a detailed estimate before any work begins\n\nNeed to reschedule? Reply to this email or call {company_phone}.\n\nSee you soon!\n{company_name}',
      },
      {
        type: 'sms',
        name: 'Day-Before Reminder',
        body: 'Hi {first_name}! Reminder: {tech_name} from {company_name} will be at {address} tomorrow between {time_window} for {service_type}. Reply C to confirm or R to reschedule.',
      },
      {
        type: 'sms',
        name: 'On My Way',
        body: '{first_name}, {tech_name} from {company_name} is headed your way! ETA: {eta}. See you soon!',
      },
    ],
  },
  {
    id: 'reactivation-engine',
    name: 'Customer Reactivation Engine',
    description: 'Re-engage customers who haven\'t booked in 6+ months. Past customers are 5x more likely to book than cold leads.',
    category: 'retention',
    impact: '+$6,800/mo revenue',
    impactColor: 'text-emerald-600 bg-emerald-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Reactivation rate', value: '18%' },
      { label: 'Avg ticket (reactivated)', value: '$1,850' },
      { label: 'Cost per reactivation', value: '$0.12' },
    ],
    steps: [
      { type: 'condition', label: 'Customer inactive 6+ months', detail: 'Automatically detects dormant customers', icon: 'check' },
      { type: 'email', label: '"We miss you" email', detail: 'Personal check-in with seasonal maintenance offer', icon: 'mail' },
      { type: 'wait', label: 'Wait 5 days', detail: 'If no response...', icon: 'clock' },
      { type: 'sms', label: 'Exclusive offer SMS', detail: '"Hey {first_name}, as a past customer you get 10% off your next service. Book here: {booking_link}"', icon: 'sms' },
      { type: 'wait', label: 'Wait 14 days', detail: 'If still no response...', icon: 'clock' },
      { type: 'email', label: 'Seasonal maintenance reminder', detail: 'Helpful content about seasonal maintenance with soft CTA', icon: 'mail' },
    ],
    templates: [
      {
        type: 'email',
        name: 'We Miss You',
        subject: 'It\'s been a while, {first_name}!',
        body: 'Hi {first_name},\n\nIt\'s been {months_since} months since we last worked together on your {last_service} at {address}, and we just wanted to check in!\n\nWith {season} coming up, now is a great time to think about:\n- {seasonal_service_1}\n- {seasonal_service_2}\n- {seasonal_service_3}\n\nAs a valued past customer, we\'d love to offer you 10% off your next service.\n\nBook online: {booking_link}\nOr call us: {company_phone}\n\nHope to see you again soon!\n{tech_name}\n{company_name}',
      },
      {
        type: 'sms',
        name: 'Reactivation Offer',
        body: 'Hey {first_name}! It\'s {tech_name} from {company_name}. As a past customer, you get 10% off your next service. {season} is a great time for {seasonal_service}. Book here: {booking_link}',
      },
    ],
  },
  {
    id: 'referral-program',
    name: 'Referral Request System',
    description: 'Ask happy customers for referrals after 5-star reviews. Referred customers have 37% higher retention.',
    category: 'retention',
    impact: '+3 referrals/mo',
    impactColor: 'text-purple-600 bg-purple-50',
    isPremium: false,
    isActive: false,
    stats: [
      { label: 'Referral ask rate', value: '100%' },
      { label: 'Conversion rate', value: '15%' },
      { label: 'Avg referral value', value: '$2,400' },
    ],
    steps: [
      { type: 'condition', label: 'Customer leaves 4-5 star review', detail: 'Triggers after positive review detected', icon: 'check' },
      { type: 'wait', label: 'Wait 24 hours', detail: 'Strike while the iron is warm', icon: 'clock' },
      { type: 'sms', label: 'Thank you + referral ask', detail: '"Thank you for the amazing review! Know anyone who needs {service}? Send them our way and you both get $50 off."', icon: 'sms' },
      { type: 'email', label: 'Referral card email', detail: 'Shareable referral link/code with incentive details', icon: 'mail' },
    ],
    templates: [
      {
        type: 'sms',
        name: 'Referral Request',
        body: 'Thanks for the awesome review, {first_name}! Know any neighbors or friends who need {service_type}? Send them our way and you BOTH get $50 off. Share this link: {referral_link}',
      },
      {
        type: 'email',
        name: 'Referral Program Email',
        subject: 'You earned $50 off — share it with a friend!',
        body: 'Hi {first_name},\n\nThank you for the wonderful review! We\'re so glad you\'re happy with your {service_type}.\n\nAs a thank you, we\'d like to offer you and a friend $50 off:\n\nYour referral link: {referral_link}\n\nHow it works:\n1. Share your link with a friend or neighbor\n2. When they book a service, you BOTH get $50 off\n3. There\'s no limit — refer as many people as you like!\n\nThank you for helping us grow!\n{company_name}',
      },
    ],
  },
  {
    id: 'seasonal-campaigns',
    name: 'Seasonal Campaign Engine',
    description: 'Automatically run seasonal marketing campaigns — AC tune-ups in spring, furnace checks in fall, pipe winterization, and more.',
    category: 'lead_capture',
    impact: '+22% seasonal bookings',
    impactColor: 'text-blue-600 bg-blue-50',
    isPremium: true,
    isActive: false,
    stats: [
      { label: 'Campaign open rate', value: '34%' },
      { label: 'Booking conversion', value: '8%' },
      { label: 'Revenue per campaign', value: '$12,400' },
    ],
    steps: [
      { type: 'condition', label: 'Season trigger date reached', detail: 'March 15 (Spring), June 1 (Summer), Sept 15 (Fall), Nov 15 (Winter)', icon: 'check' },
      { type: 'email', label: 'Seasonal campaign email', detail: 'Targeted email to all customers with seasonal service offer', icon: 'mail' },
      { type: 'wait', label: 'Wait 3 days', detail: 'For non-openers...', icon: 'clock' },
      { type: 'sms', label: 'SMS follow-up to non-openers', detail: 'Short text with seasonal service offer and booking link', icon: 'sms' },
      { type: 'wait', label: 'Wait 7 days', detail: 'For non-bookers...', icon: 'clock' },
      { type: 'email', label: 'Urgency email', detail: '"Spots are filling up for {season} — book now to guarantee your preferred date"', icon: 'mail' },
    ],
    templates: [
      {
        type: 'email',
        name: 'Spring AC Tune-Up',
        subject: 'Beat the heat — schedule your AC tune-up before summer hits',
        body: 'Hi {first_name},\n\nSpring is here, which means summer is right around the corner. Now is the perfect time to schedule your annual AC tune-up.\n\nWhy now?\n- Catch small issues before they become expensive emergency repairs\n- Ensure peak efficiency (saves you money on energy bills)\n- Preferred scheduling — summer slots fill fast!\n\nSpring Special: $89 AC Tune-Up (regularly $129)\n\nBook online: {booking_link}\nCall: {company_phone}\n\nStay cool this summer!\n{company_name}',
      },
      {
        type: 'sms',
        name: 'Seasonal SMS Follow-up',
        body: 'Hey {first_name}! Don\'t forget — our {season} special on {seasonal_service} ends soon. Book your $89 tune-up: {booking_link} - {company_name}',
      },
    ],
  },
];

// ============================================================
// STEP ICON HELPER
// ============================================================

const StepIcon = ({ icon, type }: { icon: string; type: string }) => {
  const colorMap: Record<string, string> = {
    email: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    sms: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
    wait: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
    condition: 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400',
    action: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
  };
  const iconMap: Record<string, React.ReactNode> = {
    mail: <Mail className="w-4 h-4" />,
    sms: <MessageSquare className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    check: <CheckCircle2 className="w-4 h-4" />,
    zap: <Zap className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
  };

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[type] || 'bg-slate-100 text-slate-500'}`}>
      {iconMap[icon] || <Zap className="w-4 h-4" />}
    </div>
  );
};

// ============================================================
// HELPER: Get relative time
// ============================================================

const getRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AutomationsPage() {
  const { t } = useLanguage();
  const store = useStore() as any;
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<PlaybookCategory>('all');
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplatePreview | null>(null);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-4 sm:p-8">{t('common.loading')}</div>;

  // Helper function to simulate playbook actions
  const simulatePlaybookActions = (playbookId: string, playbookName: string) => {
    const contacts = store.contacts || [];
    const deals = store.deals || [];
    const estimates = store.estimates || [];
    const invoices = store.invoices || [];

    switch (playbookId) {
      case 'speed-to-lead': {
        // For each lead contact, simulate SMS and email
        const leads = contacts.filter((c: any) => c.type === 'lead');
        leads.forEach((lead: any) => {
          store.addSimulatedAction({
            playbookId,
            playbookName,
            type: 'sms',
            recipientName: lead.name,
            recipientContact: lead.phone,
            message: `Hi ${lead.name.split(' ')[0]}, thanks for reaching out! We got your request and someone will call you within the hour.`,
            status: 'sent',
          });
          store.addSimulatedAction({
            playbookId,
            playbookName,
            type: 'email',
            recipientName: lead.name,
            recipientContact: lead.email,
            subject: 'We Got Your Request!',
            message: `Thank you for contacting ProPlumbers. We received your request and we're excited to help. A team member will call you within the hour.`,
            status: 'sent',
          });
        });
        break;
      }
      case 'estimate-follow-up': {
        // For each estimate with status 'sent', simulate follow-up SMS
        const sentEstimates = estimates.filter((e: any) => e.status === 'sent');
        sentEstimates.forEach((est: any) => {
          const contact = contacts.find((c: any) => c.id === est.contactId);
          if (contact) {
            store.addSimulatedAction({
              playbookId,
              playbookName,
              type: 'sms',
              recipientName: contact.name,
              recipientContact: contact.phone,
              message: `Hey ${contact.name.split(' ')[0]}, just checking in — did you get a chance to look over the estimate we sent? Happy to answer any questions!`,
              status: 'sent',
            });
          }
        });
        break;
      }
      case 'review-machine': {
        // For each deal with stage 'completed', simulate review request SMS
        const completedDeals = deals.filter((d: any) => d.stage === 'completed');
        completedDeals.forEach((deal: any) => {
          const contact = contacts.find((c: any) => c.id === deal.contactId);
          if (contact) {
            store.addSimulatedAction({
              playbookId,
              playbookName,
              type: 'sms',
              recipientName: contact.name,
              recipientContact: contact.phone,
              message: `Hi ${contact.name.split(' ')[0]}! Thanks for choosing ProPlumbers. If we did a great job, we'd really appreciate a quick Google review!`,
              status: 'sent',
            });
          }
        });
        break;
      }
      case 'payment-chaser': {
        // For each invoice with status 'sent' or 'overdue', simulate payment reminder
        const unpaidInvoices = invoices.filter((i: any) => i.status === 'sent' || i.status === 'overdue');
        unpaidInvoices.forEach((inv: any) => {
          const contact = contacts.find((c: any) => c.id === inv.contactId);
          if (contact) {
            store.addSimulatedAction({
              playbookId,
              playbookName,
              type: 'sms',
              recipientName: contact.name,
              recipientContact: contact.phone,
              message: `Hi ${contact.name.split(' ')[0]}, friendly reminder that your invoice #${inv.number} for $${inv.amount} is due. You can pay securely online. — ProPlumbers`,
              status: 'sent',
            });
          }
        });
        break;
      }
      case 'appointment-reminders': {
        // For each deal with stage 'booked', simulate confirmation email
        const bookedDeals = deals.filter((d: any) => d.stage === 'booked');
        bookedDeals.forEach((deal: any) => {
          const contact = contacts.find((c: any) => c.id === deal.contactId);
          if (contact) {
            store.addSimulatedAction({
              playbookId,
              playbookName,
              type: 'email',
              recipientName: contact.name,
              recipientContact: contact.email,
              subject: 'Your appointment is confirmed!',
              message: `Hi ${contact.name.split(' ')[0]}, your appointment is confirmed. A team member will be at your address soon. What to expect: technician will call when 15 minutes away.`,
              status: 'sent',
            });
          }
        });
        break;
      }
      case 'reactivation-engine': {
        // For contacts not linked to any recent deals, simulate reactivation email
        const contactsWithDeals = new Set(deals.map((d: any) => d.contactId));
        const inactiveContacts = contacts.filter((c: any) => !contactsWithDeals.has(c.id));
        inactiveContacts.forEach((contact: any) => {
          store.addSimulatedAction({
            playbookId,
            playbookName,
            type: 'email',
            recipientName: contact.name,
            recipientContact: contact.email,
            subject: 'It\'s been a while, ' + contact.name.split(' ')[0] + '!',
            message: `Hi ${contact.name.split(' ')[0]}, it's been a while since we last worked together. As a valued past customer, we'd love to offer you 10% off your next service. Check out our seasonal specials!`,
            status: 'sent',
          });
        });
        break;
      }
      case 'referral-program': {
        // For recently completed deals, simulate referral ask SMS
        const recentlyCompletedDeals = deals.filter((d: any) => d.stage === 'completed');
        recentlyCompletedDeals.forEach((deal: any) => {
          const contact = contacts.find((c: any) => c.id === deal.contactId);
          if (contact) {
            store.addSimulatedAction({
              playbookId,
              playbookName,
              type: 'sms',
              recipientName: contact.name,
              recipientContact: contact.phone,
              message: `Thanks for the awesome review, ${contact.name.split(' ')[0]}! Know any neighbors or friends who need plumbing? Send them our way and you BOTH get $50 off!`,
              status: 'sent',
            });
          }
        });
        break;
      }
    }
  };

  const togglePlaybook = (id: string) => {
    const isActive = store.activePlaybooks?.[id]?.isActive ?? false;
    store.togglePlaybook(id);
    // Simulate actions when toggling ON
    if (!isActive) {
      const playbook = PLAYBOOKS.find(p => p.id === id);
      if (playbook) {
        simulatePlaybookActions(id, playbook.name);
      }
    }
  };

  const activateAll = () => {
    store.activateAllPlaybooks();
    // Simulate actions for all non-premium playbooks
    const nonPremium = PLAYBOOKS.filter(p => !p.isPremium);
    nonPremium.forEach(p => {
      simulatePlaybookActions(p.id, p.name);
    });
  };

  const categories: { id: PlaybookCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('automations.allPlaybooks'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'lead_capture', label: t('automations.leadCapture'), icon: <Target className="w-4 h-4" /> },
    { id: 'follow_up', label: t('automations.followUp'), icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'retention', label: t('automations.retention'), icon: <Heart className="w-4 h-4" /> },
    { id: 'revenue', label: t('automations.revenue'), icon: <DollarSign className="w-4 h-4" /> },
  ];

  const filtered = activeCategory === 'all'
    ? PLAYBOOKS
    : PLAYBOOKS.filter((p) => p.category === activeCategory);

  const activePlaybookIds = store.getActivePlaybookIds?.() ?? [];
  const activeCount = activePlaybookIds.length;
  const simulatedActions = store.getSimulatedActions?.() ?? [];
  const filteredActions = activityFilter
    ? simulatedActions.filter((a: any) => a.playbookId === activityFilter)
    : simulatedActions;

  return (
    <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Autopilot Status Bar */}
      {activeCount > 0 && (
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-6 flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
              Autopilot Active
            </h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              {activeCount} playbook{activeCount !== 1 ? 's' : ''} running. {simulatedActions.length} action{simulatedActions.length !== 1 ? 's' : ''} simulated in this session.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('automations.title')}</h1>
            <p className="text-slate-600 dark:text-slate-400">{t('automations.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Impact Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 sm:p-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{t('automations.status')}</p>
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl font-bold">{activeCount} / {PLAYBOOKS.length}</div>
                <div className="text-slate-400">
                  <p className="text-sm">{t('automations.playbooksActive')}</p>
                  <p className="text-slate-500 text-sm font-medium">{activeCount > 0 ? `${simulatedActions.length} actions simulated` : 'Activate playbooks to get started'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: t('automations.emailsPerMonth'), value: simulatedActions.filter((a: any) => a.type === 'email').length.toString(), icon: <Mail className="w-4 h-4" /> },
              { label: t('automations.textsPerMonth'), value: simulatedActions.filter((a: any) => a.type === 'sms').length.toString(), icon: <MessageSquare className="w-4 h-4" /> },
              { label: t('automations.hoursSavedPerMonth'), value: (simulatedActions.length * 5).toString(), icon: <Clock className="w-4 h-4" /> },
              { label: t('automations.estRevenueImpact'), value: `+$${activeCount > 0 ? (activeCount * 2900) : 0}`, icon: <TrendingUp className="w-4 h-4" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  {stat.icon}
                  {stat.label}
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{t('automations.howItWorks')}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('automations.howItWorksDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg shadow-slate-900/20 dark:shadow-slate-700/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Playbooks Grid */}
      <div className="space-y-4">
        {(showAll ? filtered : filtered.slice(0, 3)).map((playbook) => {
          const isExpanded = expandedPlaybook === playbook.id;
          const isActive = store.activePlaybooks?.[playbook.id]?.isActive ?? false;
          return (
            <div
              key={playbook.id}
              className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all relative overflow-hidden ${
                isActive
                  ? 'border-emerald-300 dark:border-emerald-700 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5'
                  : 'border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
              )}

              {/* Playbook Header */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{playbook.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${playbook.impactColor}`}>
                        {playbook.impact}
                      </span>
                      {playbook.isPremium && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 dark:from-amber-900 to-yellow-100 dark:to-yellow-900 text-amber-700 dark:text-amber-300">
                          Pro
                        </span>
                      )}
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{playbook.description}</p>

                    {/* Stats Row */}
                    <div className="flex gap-3 sm:gap-4 sm:p-6 mt-4">
                      {playbook.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle + Expand */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setExpandedPlaybook(isExpanded ? null : playbook.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => togglePlaybook(playbook.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white'
                          : 'bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Workflow steps preview */}
              <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 px-4 sm:px-6 py-3 sm:py-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">Workflow Preview:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {playbook.steps.slice(0, 4).map((step, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500">
                        <Zap className="w-3 h-3" />
                      </div>
                      {i < 3 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                    </div>
                  ))}
                  {playbook.steps.length > 4 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">+{playbook.steps.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Template Preview Modal - shown when expanded */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 sm:px-6 py-4 sm:py-6">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Message Templates</h4>
                  <div className="space-y-4">
                    {playbook.templates.map((template, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          {template.type === 'email' ? (
                            <Mail className="w-4 h-4 text-blue-600" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{template.name}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {template.type.toUpperCase()}
                          </span>
                        </div>
                        {template.subject && (
                          <div className="mb-2">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Subject:</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{template.subject}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Message:</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{template.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {!showAll && filtered.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            Show all {filtered.length} automations
          </button>
        )}
      </div>

      {/* Automation Activity Log */}
      <div className="mt-12 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Automation Activity Log</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {filteredActions.length} simulated action{filteredActions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter Dropdown */}
                <div className="relative inline-block">
                  <select
                    value={activityFilter ?? ''}
                    onChange={(e) => setActivityFilter(e.target.value || null)}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-8"
                  >
                    <option value="">All Playbooks</option>
                    {PLAYBOOKS.filter(p => store.activePlaybooks?.[p.id]?.isActive).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none" />
                </div>
                {/* Clear Button */}
                <button
                  onClick={() => store.clearSimulatedActions?.()}
                  disabled={simulatedActions.length === 0}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    simulatedActions.length === 0
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                  title="Clear all simulated actions"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="max-h-96 overflow-y-auto">
            {filteredActions.length === 0 ? (
              <div className="p-4 sm:p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3 opacity-50" />
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                  No automation activity yet. Activate a playbook to see simulated actions.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredActions.map((action: any) => {
                  const playbook = PLAYBOOKS.find(p => p.id === action.playbookId);
                  const categoryColors: Record<string, string> = {
                    lead_capture: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
                    follow_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
                    retention: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                    revenue: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                  };
                  const categoryColor = playbook ? categoryColors[playbook.category as PlaybookCategory] : '';
                  return (
                    <div key={action.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-start gap-4">
                      {/* Type Icon */}
                      <div className="shrink-0 mt-0.5">
                        {action.type === 'email' ? (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                          </div>
                        ) : action.type === 'sms' ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                            <Bell className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${categoryColor}`}>
                            {playbook?.name}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                            action.status === 'sent'
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                          To: {action.recipientName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {action.message.length > 80
                            ? action.message.substring(0, 80) + '...'
                            : action.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {getRelativeTime(action.triggeredAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activate All CTA */}
      {activeCount === 0 && (
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 sm:p-8 max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Get Started with Autopilot</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Activate your first playbook to start automating your business workflows.
              Watch simulated actions appear in the activity log below.
            </p>
            <button
              onClick={activateAll}
              className="px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
            >
              Activate All Free Playbooks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
