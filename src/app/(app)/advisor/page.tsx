'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ChevronRight,
  Bot,
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

// ─── Mock Account Data (simulates real CRM data) ────────────
const ACCOUNT_DATA = {
  ownerName: 'Mike',
  businessName: 'Reynolds Plumbing & HVAC',
  pipelineValue: 87400,
  openDeals: 14,
  closedThisMonth: 8,
  revenueThisMonth: 34200,
  revenueTrend: '+18%',
  overdueEstimates: [
    { name: 'Patel kitchen reno', value: 12000, daysSince: 14 },
    { name: 'Chen HVAC install', value: 6200, daysSince: 11 },
    { name: 'Rodriguez bathroom', value: 4800, daysSince: 16 },
  ],
  recentWins: [
    { name: 'Greenwood condo AC', value: 8500 },
    { name: 'Thompson furnace swap', value: 4200 },
  ],
  missedCalls: 3,
  reviewScore: 4.7,
  reviewCount: 142,
  autopilotActive: 5,
  topSource: 'Google Ads',
  avgTicket: 3850,
  seasonalTip: 'AC season starts in 6 weeks. Last year you booked 22 AC installs in May-June. Time to prep your spring campaign.',
};

// ─── Pre-built Advisor Responses ─────────────────────────────
function getAdvisorResponse(prompt: string): string[] {
  const d = ACCOUNT_DATA;
  const lower = prompt.toLowerCase();

  if (lower.includes('how') && (lower.includes('doing') || lower.includes('business') || lower.includes('going'))) {
    return [
      `Good news first — you closed 8 jobs this month for $${d.revenueThisMonth.toLocaleString()}. That's ${d.revenueTrend} over last month. 💪`,
      `The thing I'd watch: you've got ${d.overdueEstimates.length} estimates worth $${d.overdueEstimates.reduce((a, e) => a + e.value, 0).toLocaleString()} that haven't been touched in over 10 days. That money's going cold.`,
      `Want me to draft follow-ups for those?`,
    ];
  }

  if (lower.includes('estimate') || lower.includes('quote') || lower.includes('follow')) {
    return [
      `You've got ${d.overdueEstimates.length} estimates going stale:`,
      `${d.overdueEstimates.map((e, i) => `${i + 1}. ${e.name} — $${e.value.toLocaleString()} (${e.daysSince} days)`).join('\n')}`,
      `That's $${d.overdueEstimates.reduce((a, e) => a + e.value, 0).toLocaleString()} on the table. The Patel one is the biggest — I'd call that one personally. Want me to send follow-up messages to the other two?`,
    ];
  }

  if (lower.includes('revenue') || lower.includes('money') || lower.includes('sales') || lower.includes('number')) {
    return [
      `Here's your month so far:`,
      `Revenue: $${d.revenueThisMonth.toLocaleString()} (${d.revenueTrend} vs last month)\nPipeline: $${d.pipelineValue.toLocaleString()} across ${d.openDeals} open jobs\nAvg ticket: $${d.avgTicket.toLocaleString()}\nTop lead source: ${d.topSource}`,
      `Your pipeline's healthy. The key is converting those ${d.openDeals} open deals — that's almost $90K in potential revenue sitting there.`,
    ];
  }

  if (lower.includes('review') || lower.includes('reputation') || lower.includes('google')) {
    return [
      `You're at ${d.reviewScore} stars across ${d.reviewCount} reviews — that's solid. Most plumbers in your area are sitting at 4.2-4.4.`,
      `You've got ${d.autopilotActive} Autopilot playbooks running, including the post-job review request. It's been pulling in about 3-4 new reviews per week on autopilot.`,
      `One tip: reply to every review, even the good ones. Google's algorithm favors businesses that engage. Takes 30 seconds per review.`,
    ];
  }

  if (lower.includes('season') || lower.includes('spring') || lower.includes('summer') || lower.includes('plan') || lower.includes('prep')) {
    return [
      `${d.seasonalTip}`,
      `Here's what I'd do:\n1. Turn on the "AC Tune-Up" Autopilot sequence — it'll text last year's customers automatically\n2. Bump your Google Ads budget 20% starting mid-April\n3. Post a "Spring AC Check" offer on your Google Business Profile`,
      `Last year your AC work averaged $6,200 per job. If you book even 15 installs, that's $93K in revenue over 8 weeks.`,
    ];
  }

  if (lower.includes('missed') || lower.includes('call') || lower.includes('lead')) {
    return [
      `You missed ${d.missedCalls} calls today. Autopilot caught all ${d.missedCalls} — sent an instant text back within 60 seconds saying you'd call them right back.`,
      `2 of them replied already. One's a hot water tank emergency in Oakville — that's probably a $2,500-$4,000 job. I'd call that one first.`,
    ];
  }

  if (lower.includes('team') || lower.includes('tech') || lower.includes('staff') || lower.includes('hire')) {
    return [
      `Based on your pipeline, you're running at about 85% capacity with your current crew. If you keep closing at this rate, you'll need another tech by mid-May.`,
      `The math: you're averaging 2.1 jobs/day across your team. Your pipeline has 14 open deals. At your current close rate (57%), that's about 8 jobs landing in the next 2 weeks — which would push you to 110% capacity.`,
      `Start looking now. It takes 3-4 weeks to find a good tech in this market.`,
    ];
  }

  if (lower.includes('competitor') || lower.includes('competition')) {
    return [
      `Your area has 12 plumbing companies within 15km. Here's what sets you apart right now:`,
      `✅ Your response time (60 sec) beats the average (4+ hours)\n✅ Your Google rating (${d.reviewScore}) is above market average\n✅ You follow up on estimates (most don't)\n\nThe gap: 3 competitors are running Google Ads on "emergency plumber" in your area. You should bid on that too — emergency calls have the highest ticket size.`,
    ];
  }

  if (lower.includes('autopilot') || lower.includes('automation')) {
    return [
      `You've got ${d.autopilotActive} Autopilot playbooks running right now:`,
      `1. New Lead Response (60-sec text) — caught ${d.missedCalls} leads today\n2. Estimate Follow-Up (24h + 72h reminders)\n3. Post-Job Review Request\n4. Missed Call Text-Back\n5. Monthly Check-In for past customers`,
      `The estimate follow-up alone has recovered about $8,500 in jobs that would've gone cold. That's the one doing the most heavy lifting.`,
    ];
  }

  // Default response
  return [
    `Here's what I'm seeing in your account today:`,
    `📊 Pipeline: $${d.pipelineValue.toLocaleString()} across ${d.openDeals} jobs\n💰 Revenue this month: $${d.revenueThisMonth.toLocaleString()} (${d.revenueTrend})\n📋 ${d.overdueEstimates.length} estimates need follow-up ($${d.overdueEstimates.reduce((a, e) => a + e.value, 0).toLocaleString()})\n📞 ${d.missedCalls} missed calls (all auto-responded)`,
    `The biggest opportunity right now is those stale estimates. Want me to dig into those?`,
  ];
}

// ─── Time Formatter ──────────────────────────────────────────
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Quick Actions ───────────────────────────────────────────
const QUICK_ACTIONS: QuickAction[] = [
  { label: 'How\'s my business doing?', icon: TrendingUp, prompt: 'How is my business doing?' },
  { label: 'Stale estimates', icon: AlertTriangle, prompt: 'Show me estimates that need follow-up' },
  { label: 'Revenue this month', icon: DollarSign, prompt: 'What are my revenue numbers?' },
  { label: 'Missed leads', icon: Users, prompt: 'Did I miss any calls today?' },
];

// ─── Message Bubble ──────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isAdvisor = message.sender === 'advisor';

  if (message.isTyping) {
    return (
      <div className="flex justify-start">
        <div className="bg-[#E9E9EB] rounded-2xl rounded-bl-md px-4 py-3 max-w-[75%]">
          <div className="flex gap-1.5 items-center h-5">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
            ? 'bg-[#E9E9EB] text-slate-900 rounded-bl-md'
            : 'bg-[#0071E3] text-white rounded-br-md'
        }`}
      >
        <p className="text-[15px]">{message.text}</p>
        <p className={`text-[11px] mt-1 ${isAdvisor ? 'text-slate-500' : 'text-blue-100'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}

// ─── Main Advisor Page ───────────────────────────────────────
export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    const responses = getAdvisorResponse(messageText);
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
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[17px] font-semibold text-slate-900">Growth Advisor</h1>
              <p className="text-[13px] text-emerald-600 font-medium">Online</p>
            </div>
          </div>
        </div>

        {/* Welcome Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hey {ACCOUNT_DATA.ownerName} 👋</h2>
          <p className="text-slate-500 text-center max-w-sm mb-10 leading-relaxed">
            I know your numbers, your pipeline, and your customers. Ask me anything about your business.
          </p>

          {/* Quick Actions */}
          <div className="w-full max-w-sm space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <span className="text-[15px] text-slate-700 font-medium flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
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
              placeholder="Ask about your business..."
              className="flex-1 bg-transparent text-[15px] text-slate-900 placeholder-slate-400 outline-none"
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
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-[17px] font-semibold text-slate-900">Growth Advisor</h1>
            <p className="text-[13px] text-emerald-600 font-medium">
              {isTyping ? 'typing...' : 'Online'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-700">Connected to your account</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Date separator */}
        <div className="flex justify-center mb-4">
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
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

      {/* Quick Suggestions (show after advisor responds) */}
      {!isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'advisor' && (
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              'How\'s my revenue?',
              'Stale estimates',
              'Seasonal prep',
              'Team capacity',
              'My reviews',
              'Autopilot status',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="flex-shrink-0 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-[13px] text-slate-600 font-medium transition-colors whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2.5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your business..."
            className="flex-1 bg-transparent text-[15px] text-slate-900 placeholder-slate-400 outline-none"
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
