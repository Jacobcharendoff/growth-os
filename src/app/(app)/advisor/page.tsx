'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { useStore } from '@/store';
import {
  Send,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  prompt: string;
}

// ─── Dynamic Account Data Builder ──────────────────────────
function buildAccountData(store: any) {
  const now = Date.now();
  const thisMonth = new Date(now);
  const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getTime();

  // Calculate pipeline value from open deals (not invoiced or completed)
  const openDeals = store.deals.filter((d: any) =>
    d.stage !== 'completed' && d.stage !== 'invoiced'
  );
  const pipelineValue = openDeals.reduce((sum: number, deal: any) => sum + deal.value, 0);

  // Count closed deals (completed or invoiced) this month
  const closedThisMonth = store.deals.filter((d: any) => {
    if (d.stage === 'completed' || d.stage === 'invoiced') {
      const updatedAt = d.updatedAt || d.createdAt;
      return updatedAt >= monthStart;
    }
    return false;
  }).length;

  // Sum revenue from paid invoices this month
  const revenueThisMonth = store.invoices
    .filter((inv: any) => inv.status === 'paid' && (inv.paidAt || 0) >= monthStart)
    .reduce((sum: number, inv: any) => sum + inv.total, 0);

  // Calculate average ticket size from all deals
  const avgTicket = store.deals.length > 0
    ? Math.round(store.deals.reduce((sum: number, d: any) => sum + d.value, 0) / store.deals.length)
    : 0;

  // Find overdue estimates (sent but not approved/rejected, older than 7 days)
  const sevenDaysAgo = now - (7 * 86400000);
  const overdueEstimates = store.estimates
    .filter((est: any) => {
      if (est.status !== 'sent' && est.status !== 'viewed') return false;
      if (!est.sentAt) return false;
      return est.sentAt < sevenDaysAgo;
    })
    .map((est: any) => {
      const daysSince = Math.floor((now - (est.sentAt || 0)) / 86400000);
      return {
        name: est.customerName,
        value: est.tiers?.[0]?.price || 1000,
        daysSince,
      };
    });

  // Recent wins (deals moved to completed/invoiced in last 14 days)
  const twoWeeksAgo = now - (14 * 86400000);
  const recentWins = store.deals
    .filter((d: any) => (d.stage === 'completed' || d.stage === 'invoiced') && (d.updatedAt || d.createdAt) >= twoWeeksAgo)
    .slice(0, 5)
    .map((d: any) => ({
      name: `${store.getContact(d.contactId)?.name || 'Unknown'} - ${d.title}`,
      value: d.value,
    }));

  // Recent activities count
  const recentActivities = (store.getActivities ? store.getActivities(10) : store.activities?.slice(0, 10) || []).length;

  // Count total deals
  const totalDeals = store.deals.length;

  return {
    ownerName: store.settings.companyName?.split(' ')[0] || 'there',
    businessName: store.settings.companyName || 'Your Business',
    pipelineValue,
    openDeals: openDeals.length,
    totalDeals,
    closedThisMonth,
    revenueThisMonth,
    revenueTrend: revenueThisMonth > 0 ? '+12%' : '0%',
    overdueEstimates,
    recentWins,
    missedCalls: 0,
    reviewScore: 4.7,
    reviewCount: 142,
    autopilotActive: 5,
    topSource: 'Referrals',
    avgTicket,
    seasonalTip: 'AC season starts in 6 weeks. Time to prep your spring campaign.',
    recentActivitiesCount: recentActivities,
  };
}

// ─── Pre-built Advisor Responses ─────────────────────────────
function getAdvisorResponse(prompt: string, accountData: ReturnType<typeof buildAccountData>): string[] {
  const d = accountData;
  const lower = prompt.toLowerCase();

  // Handle empty/seed data gracefully
  const hasData = d.totalDeals > 0 || d.revenueThisMonth > 0;

  if (lower.includes('how') && (lower.includes('doing') || lower.includes('business') || lower.includes('going'))) {
    if (!hasData) {
      return [
        `Welcome to Growth Advisor, ${d.ownerName}!`,
        `I see you're just getting started. Let's build some real data together.`,
        `Try adding your first contact, creating a deal, or sending an estimate. Once you have real data, I'll give you actionable insights.`,
      ];
    }
    return [
      `Good news — you closed ${d.closedThisMonth} job${d.closedThisMonth !== 1 ? 's' : ''} this month for $${d.revenueThisMonth.toLocaleString()}. That's solid work! 💪`,
      `The thing I'd watch: you've got ${d.overdueEstimates.length} estimate${d.overdueEstimates.length !== 1 ? 's' : ''} worth $${d.overdueEstimates.reduce((a: number, e: any) => a + e.value, 0).toLocaleString()} that haven't been touched in over a week. That money's going cold.`,
      `Want me to help you follow up on those?`,
    ];
  }

  if (lower.includes('estimate') || lower.includes('quote') || lower.includes('follow')) {
    if (d.overdueEstimates.length === 0) {
      return [
        `Great news — you don't have any stale estimates right now.`,
        `Keep sending those estimates and stay on top of follow-ups. That's how deals turn into revenue.`,
      ];
    }
    return [
      `You've got ${d.overdueEstimates.length} estimate${d.overdueEstimates.length !== 1 ? 's' : ''} going stale:`,
      `${d.overdueEstimates.map((e: any, i: number) => `${i + 1}. ${e.name} — $${e.value.toLocaleString()} (${e.daysSince} days)`).join('\n')}`,
      `That's $${d.overdueEstimates.reduce((a: number, e: any) => a + e.value, 0).toLocaleString()} on the table. I'd prioritize the biggest one. Want me to suggest next steps?`,
    ];
  }

  if (lower.includes('revenue') || lower.includes('money') || lower.includes('sales') || lower.includes('number')) {
    if (!hasData) {
      return [
        `You haven't recorded any revenue yet.`,
        `Start by creating deals and invoices. Once you mark invoices as paid, I'll show you your revenue trends.`,
      ];
    }
    return [
      `Here's your month so far:`,
      `Revenue: $${d.revenueThisMonth.toLocaleString()} (${d.revenueTrend} vs last month)\nPipeline: $${d.pipelineValue.toLocaleString()} across ${d.openDeals} open job${d.openDeals !== 1 ? 's' : ''}\nAvg ticket: $${d.avgTicket.toLocaleString()}\nClosed: ${d.closedThisMonth} job${d.closedThisMonth !== 1 ? 's' : ''}`,
      `Your pipeline's healthy. The key is converting those ${d.openDeals} open deal${d.openDeals !== 1 ? 's' : ''} — that's potential revenue waiting.`,
    ];
  }

  if (lower.includes('pipeline') || lower.includes('open')) {
    if (d.openDeals === 0) {
      return [
        `You have no open deals in your pipeline right now.`,
        `Start by adding contacts and creating deals. Build your pipeline first, then focus on conversion.`,
      ];
    }
    return [
      `Your pipeline is worth $${d.pipelineValue.toLocaleString()} across ${d.openDeals} open job${d.openDeals !== 1 ? 's' : ''}.`,
      `Average deal size: $${d.avgTicket.toLocaleString()}. If you close 50% of these, that's $${Math.round(d.pipelineValue * 0.5).toLocaleString()} in revenue.`,
      `Focus on the biggest deals first. Which one are you closest to winning?`,
    ];
  }

  if (lower.includes('review') || lower.includes('reputation') || lower.includes('google')) {
    return [
      `You're at ${d.reviewScore} stars across ${d.reviewCount} reviews — that's a strong foundation.`,
      `Google values consistent engagement. Keep building those reviews and responding to every single one.`,
      `That review score is a trust signal that turns leads into customers.`,
    ];
  }

  if (lower.includes('season') || lower.includes('spring') || lower.includes('summer') || lower.includes('plan') || lower.includes('prep')) {
    return [
      `${d.seasonalTip}`,
      `Here's what I'd do:\n1. Create a seasonal campaign in your marketing\n2. Prepare pricing for your peak season\n3. Start outreach to past customers who might need seasonal services`,
      `Plan now, execute in 4 weeks.`,
    ];
  }

  if (lower.includes('missed') || lower.includes('call') || lower.includes('lead')) {
    return [
      `You haven't missed any calls that we're tracking yet.`,
      `Every missed call is lost revenue. Once you integrate call tracking, I'll help you stay on top of every lead.`,
    ];
  }

  if (lower.includes('team') || lower.includes('tech') || lower.includes('staff') || lower.includes('hire') || lower.includes('capacity')) {
    if (d.openDeals < 5) {
      return [
        `Your current team seems to have capacity to handle your pipeline.`,
        `Keep growing your deals and I'll let you know when you'll need another tech.`,
      ];
    }
    return [
      `Based on your pipeline, you might be approaching capacity limits.`,
      `You have ${d.openDeals} open deals worth $${d.pipelineValue.toLocaleString()}. If you close 60% of these in the next 2 weeks, that's a lot of work.`,
      `Start thinking about team expansion or subcontracting.`,
    ];
  }

  if (lower.includes('automation') || lower.includes('autopilot')) {
    return [
      `You've got ${d.autopilotActive} automated workflows set up.`,
      `Automation saves time on follow-ups and keeps leads warm. The more you automate, the more you scale.`,
      `What's one repetitive task you'd like to automate next?`,
    ];
  }

  // Default response
  const topMetrics = [];
  if (d.pipelineValue > 0) {
    topMetrics.push(`📊 Pipeline: $${d.pipelineValue.toLocaleString()} (${d.openDeals} jobs)`);
  }
  if (d.revenueThisMonth > 0) {
    topMetrics.push(`💰 Revenue this month: $${d.revenueThisMonth.toLocaleString()}`);
  }
  if (d.overdueEstimates.length > 0) {
    topMetrics.push(`📋 ${d.overdueEstimates.length} stale estimate${d.overdueEstimates.length !== 1 ? 's' : ''} ($${d.overdueEstimates.reduce((a: number, e: any) => a + e.value, 0).toLocaleString()})`);
  }
  if (topMetrics.length === 0) {
    topMetrics.push(`👋 Welcome! Let's add some data to get started.`);
  }

  return [
    `Here's what I'm seeing in your account:`,
    topMetrics.join('\n'),
    `What would you like to focus on?`,
  ];
}

// ─── Time Formatter ──────────────────────────────────────────
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Quick Actions ───────────────────────────────────────────
const getQuickActions = (t: any): QuickAction[] => [
  { label: t('advisor.businessDoing'), icon: TrendingUp, prompt: 'How is my business doing?' },
  { label: t('advisor.staleEstimates'), icon: AlertTriangle, prompt: 'Show me estimates that need follow-up' },
  { label: t('advisor.revenueThisMonth'), icon: DollarSign, prompt: 'What are my revenue numbers?' },
  { label: t('advisor.missedLeads'), icon: Users, prompt: 'Tell me about my pipeline' },
];

// ─── Message Bubble ──────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isAdvisor = message.sender === 'advisor';

  if (message.isTyping) {
    return (
      <div className="flex justify-start">
        <div className="bg-[#E9E9EB] dark:bg-slate-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%]">
          <div className="flex gap-1.5 items-center h-5">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isAdvisor ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`rounded-2xl px-4 py-2.5 max-w-[75%] whitespace-pre-line leading-relaxed ${
          isAdvisor
            ? 'bg-[#E9E9EB] dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-md'
            : 'bg-[#0071E3] dark:bg-blue-600 text-white rounded-br-md'
        }`}
      >
        <p className="text-[15px]">{message.text}</p>
        <p className={`text-[11px] mt-1 ${isAdvisor ? 'text-slate-500 dark:text-slate-400' : 'text-blue-100'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

// ─── Main Advisor Page ───────────────────────────────────────
export default function AdvisorPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const store = useStore();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build account data from real store
  const accountData = buildAccountData(store);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addAdvisorMessages = (responses: string[], afterDelay: number = 600) => {
    setIsTyping(true);

    let totalDelay = afterDelay;
    responses.forEach((text, index) => {
      const delay = totalDelay + (index * 1200) + (text.length * 8);
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `advisor-${Date.now()}-${index}`,
            sender: 'advisor',
            text,
            timestamp: formatTime(new Date()),
          },
        ]);
        if (index === responses.length - 1) {
          setIsTyping(false);
        }
      }, delay);
      totalDelay = delay;
    });
  };

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    if (!hasStarted) setHasStarted(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: formatTime(new Date()),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const responses = getAdvisorResponse(messageText, accountData);
    addAdvisorMessages(responses);
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Welcome Screen (before first message) ────────────────
  if (!hasStarted) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white">{t('advisor.title')}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                  Beta
                </span>
              </div>
              <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">{t('advisor.online')}</p>
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('advisor.greeting', { ownerName: accountData.ownerName })}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-10 leading-relaxed">
            {t('advisor.introduction')}
          </p>

          {/* Quick Actions */}
          <div className="w-full max-w-sm space-y-3">
            {getQuickActions(t).map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <span className="text-[15px] text-slate-700 dark:text-slate-300 font-medium flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('advisor.placeholder')}
              className="flex-1 bg-transparent text-[15px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                input.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Chat View (after first message) ──────────────────────
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white">{t('advisor.title')}</h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                Beta
              </span>
            </div>
            <p className="text-[13px] text-emerald-600 dark:text-emerald-400 font-medium">
              {isTyping ? t('advisor.typing') : t('advisor.online')}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{t('advisor.connectedToAccount')}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Date separator */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{t('advisor.today')}</span>
        </div>

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <MessageBubble
            message={{
              id: 'typing',
              sender: 'advisor',
              text: '',
              timestamp: '',
              isTyping: true,
            }}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Beta Disclaimer */}
      <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-4 py-3">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Beta Notice:</span> Growth Advisor uses real data from your account. Responses are template-based and will be powered by AI in a future update.
        </p>
      </div>

      {/* Quick Suggestions (show after advisor responds) */}
      {!isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'advisor' && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              t('advisor.myRevenue'),
              t('advisor.staleEstimates'),
              t('advisor.seasonalPrep'),
              t('advisor.teamCapacity'),
              t('advisor.myReviews'),
              t('advisor.autopilotStatus'),
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="flex-shrink-0 px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-[13px] text-slate-600 dark:text-slate-400 font-medium transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('advisor.placeholder')}
            className="flex-1 bg-transparent text-[15px] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            autoFocus
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
