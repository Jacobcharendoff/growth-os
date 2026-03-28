"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Shield,
  CheckCircle2,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Bot,
  FileText,
  Receipt,
  Languages,
  BadgeCheck,
  Wrench,
  Flame,
  Plug,
  TreePine,
  Home,
  HelpCircle,
  Globe,
  MessageSquare,
} from "lucide-react";

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    const el = document.getElementById(`counter-${end}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, suffix, started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <span id={`counter-${end}-${suffix}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Scroll Reveal Hook ─────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right, .scroll-scale-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Navigation ───────────────────────────────────────────────
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Growth OS<span className="text-blue-600">™</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#autopilot" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Autopilot</a>
            <a href="#compare" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Compare</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Try Free for 14 Days
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>How It Works</a>
              <a href="#autopilot" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Autopilot</a>
              <a href="#compare" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Compare</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Pricing</a>
              <div className="flex gap-3 pt-2">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600">Log in</Link>
                <Link href="/setup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  Try Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/8 via-blue-400/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="hero-reveal hero-reveal-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Free for 14 days — no credit card needed</span>
          </div>

          {/* Headline */}
          <h1 className="hero-reveal hero-reveal-delay-2 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Every missed call is a
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              job you lost.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-reveal hero-reveal-delay-3 mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Growth OS auto-responds to new leads in 60 seconds, follows up on estimates for you,
            and gets you paid faster. You run the jobs. It runs everything else.
          </p>

          {/* CTAs */}
          <div className="hero-reveal hero-reveal-delay-4 mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="glow-pulse inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Try Free for 14 Days
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              See It in Action
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="hero-reveal hero-reveal-delay-5 mt-14 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {["MR", "JL", "SK", "PP", "TD"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">Plumbers, HVAC, electricians across Canada</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1.5">4.9/5 rating</span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="scroll-scale-up mt-16 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60" />
            <div className="float-animation relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-600/50 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    <span className="text-xs text-slate-300 font-mono">app.growthos.com</span>
                  </div>
                </div>
              </div>
              <div className="p-1 bg-slate-100">
                <div className="bg-slate-50 flex min-h-[280px] sm:min-h-[420px]">
                  <div className="w-48 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 hidden sm:block rounded-bl-xl">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white">Growth OS</span>
                    </div>
                    {["Dashboard", "Jobs", "Customers", "Autopilot", "Estimates"].map((item, i) => (
                      <div key={item} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-sm ${i === 0 ? "bg-blue-600 text-white shadow-lg" : "text-slate-400"}`}>
                        {[<BarChart3 key="b" className="w-4 h-4" />, <Layers key="l" className="w-4 h-4" />, <Users key="u" className="w-4 h-4" />, <Bot key="a" className="w-4 h-4" />, <FileText key="e" className="w-4 h-4" />][i]}
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-3 sm:p-6">
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-sm sm:text-lg font-bold text-gray-900">Dashboard</h3>
                      <p className="text-[10px] sm:text-xs text-gray-400">Here&apos;s how your week is looking.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                      {[
                        { label: "New Leads", value: "23", trend: "+12%", color: "text-emerald-500" },
                        { label: "Jobs This Week", value: "14", trend: "+24%", color: "text-emerald-500" },
                        { label: "Revenue", value: "$87.5k", trend: "+18%", color: "text-emerald-500" },
                      ].map((kpi) => (
                        <div key={kpi.label} className="bg-white rounded-xl p-2 sm:p-4 shadow-sm border border-gray-100">
                          <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                          <p className="text-lg sm:text-2xl font-bold mt-1 text-gray-900">{kpi.value}</p>
                          <p className={`text-[8px] sm:text-[10px] mt-1 ${kpi.color} hidden sm:block`}>{kpi.trend} from last month</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Job Pipeline</p>
                        {["New Leads", "Quoted", "Booked", "In Progress"].map((stage, i) => (
                          <div key={stage} className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-gray-400 w-20">{stage}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${[80, 55, 40, 30][i]}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Autopilot Active</p>
                        {[
                          { name: "Speed to Lead", status: "Running" },
                          { name: "Estimate Follow-Up", status: "Running" },
                          { name: "Review Requests", status: "Running" },
                        ].map((p) => (
                          <div key={p.name} className="flex items-center justify-between mb-2.5">
                            <span className="text-[10px] text-gray-500">{p.name}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[10px] text-emerald-600 font-medium">{p.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem Agitation ───────────────────────────────────────
function ProblemSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="scroll-fade-up text-2xl sm:text-3xl font-bold text-white mb-8">Sound familiar?</h2>
        <div className="stagger-children grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
          {[
            "You missed a call at 7am because you were already on a job",
            "That estimate you sent last week? No one followed up",
            "Your best customer hasn't called in 6 months and you didn't notice",
            "You invoiced a job 4 days late and waited 45 days to get paid",
            "You have no idea which ads are actually bringing in work",
            "You tried Jobber but it didn't help you grow — just schedule",
          ].map((pain) => (
            <div key={pain} className="scroll-fade-up flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{pain}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-lg text-blue-300 font-medium">
          Every one of these problems has a fix. And it takes 10 minutes to set up.
        </p>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Set it up in 10 minutes.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Use it today.
            </span>
          </h2>
        </div>

        <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Add Your Customers", description: "Import from a spreadsheet or add them one by one. Takes 5 minutes for most shops.", icon: <Users className="w-6 h-6" /> },
            { step: "02", title: "Turn On Autopilot", description: "Pick which automations you want running — lead responses, estimate follow-ups, review requests. One click each.", icon: <Bot className="w-6 h-6" /> },
            { step: "03", title: "See Every Job at a Glance", description: "Drag jobs through your pipeline: new lead, quoted, booked, in progress, invoiced. Know where everything stands.", icon: <Layers className="w-6 h-6" /> },
            { step: "04", title: "Grow", description: "See which lead sources make you money. Double down on what works. Book more jobs. Get paid faster.", icon: <TrendingUp className="w-6 h-6" /> },
          ].map((s, i) => (
            <div key={s.step} className="scroll-fade-up relative">
              {i < 3 && <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent" />}
              <div className="text-5xl font-black text-blue-100 mb-4">{s.step}</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Answer Every Call — Even When You're Busy",
      description: "The average plumber misses 30-40% of calls. Growth OS auto-texts every missed call in seconds: \"Thanks for calling. We got your message. Someone will call you back within 2 hours.\" That lead stays yours.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "See All Your Jobs in One Place",
      description: "Drag jobs through your pipeline as they progress — new lead, quoted, booked, in progress, done. No sticky notes. No spreadsheets. Open your phone and know exactly where every job stands.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Estimates That Actually Close",
      description: "Send Good/Better/Best pricing on every estimate. Customers pick the option that fits. Businesses using tiered pricing see 30% higher average tickets. Growth OS auto-follows up if they don't respond.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Get Reviews Without Asking",
      description: "After every job, Growth OS texts your customer asking for a Google review. Most people leave one when you make it easy. More reviews means more calls from people who already trust you.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Invoice Same-Day. Get Paid Faster.",
      description: "Send invoices the moment a job is done. Automatic reminders go out at 3, 7, and 14 days. Provincial taxes calculated correctly every time — HST, GST, PST, QST. You never do the math.",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Know What Makes You Money",
      description: "See exactly which ads, referrals, and repeat customers bring in the most revenue. Stop guessing. Make decisions with real numbers — which jobs are profitable, which lead sources actually pay off.",
      gradient: "from-slate-500 to-gray-600",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">What You Get</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Six problems solved.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              One dashboard.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Leads, jobs, estimates, invoices, follow-ups, reviews — all in one place.
            Simple enough for your office manager. Powerful enough for a 50-person operation.
          </p>
        </div>

        <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="scroll-fade-up group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Autopilot Section ───────────────────────────────────────
function AutopilotSection() {
  const playbooks = [
    { name: "Speed to Lead", description: "New lead comes in? They get a text in 60 seconds. 78% of jobs go to whoever responds first. This makes sure it's you.", category: "Leads", color: "bg-blue-500" },
    { name: "Estimate Follow-Up", description: "Sent a quote? Growth OS follows up on day 1, 3, and 7. Gentle nudges with the customer's name — not spam. Just enough to close the deal.", category: "Sales", color: "bg-purple-500" },
    { name: "5-Star Review Machine", description: "After every job, your customer gets a text asking for a Google review. Most people leave one when you make it this easy. More reviews = more calls.", category: "Reputation", color: "bg-amber-500" },
    { name: "Payment Reminders", description: "Invoices get automatic reminders at 3, 7, and 14 days. Friendly but firm. Your money comes in faster without an awkward phone call.", category: "Revenue", color: "bg-emerald-500" },
    { name: "Customer Reactivation", description: "Your past customers haven't called in months. Not because they don't need you — they just forgot. Growth OS reaches out with a special offer automatically.", category: "Retention", color: "bg-rose-500" },
    { name: "Seasonal Campaigns", description: "Furnace tune-ups in fall. AC checks in spring. Winterization reminders in October. Timed perfectly so customers book before the rush.", category: "Growth", color: "bg-teal-500" },
  ];

  return (
    <section id="autopilot" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Autopilot</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Your business runs itself{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              while you run your jobs.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            8 automations that text and email your customers for you.
            Every message uses their name — it looks personal, not like spam. Just turn them on.
          </p>
        </div>

        <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {playbooks.map((p) => (
            <div key={p.name} className="scroll-fade-up group p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${p.color}`}>{p.category}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{p.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Every automation is pre-written and tested. Nothing to customize. Nothing to mess up. Just click on.
        </p>

        <div className="mt-6 text-center">
          <Link href="/automations" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/20">
            Explore All 8 Automations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Growth Advisor Demo (Animated Chat) ────────────────────
function AdvisorDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const conversation = [
    { sender: 'advisor' as const, text: "Hey Mike 👋 Quick morning update — you closed 8 jobs this month for $34,200. That's 18% up from last month." },
    { sender: 'advisor' as const, text: "One thing to watch: 3 estimates over $5K haven't been touched in 2 weeks. That's $23K sitting on the table." },
    { sender: 'user' as const, text: "Which ones?" },
    { sender: 'advisor' as const, text: "Patel kitchen reno ($12K), Chen HVAC install ($6,200), Rodriguez bathroom ($4,800). Want me to send follow-ups?" },
    { sender: 'user' as const, text: "Yeah do it" },
    { sender: 'advisor' as const, text: "Done. Sent personalized follow-ups to all 3. You'll get notified when they reply. 👍" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById('advisor-demo');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleMessages >= conversation.length) return;

    const currentMsg = conversation[visibleMessages];
    const typingDelay = currentMsg.sender === 'advisor' ? 1200 : 600;
    const readDelay = Math.min(currentMsg.text.length * 20, 2000);

    const typingTimer = setTimeout(() => {
      setIsTyping(true);
    }, readDelay);

    const messageTimer = setTimeout(() => {
      setIsTyping(false);
      setVisibleMessages(prev => prev + 1);
    }, readDelay + typingDelay);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(messageTimer);
    };
  }, [hasStarted, visibleMessages, conversation.length]);

  return (
    <section id="advisor-demo" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="scroll-fade-left text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Growth Advisor</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Like texting your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                smartest business partner.
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-500 leading-relaxed">
              Your Growth Advisor knows your numbers, your pipeline, and your customers.
              It flags problems before they cost you money, and tells you exactly what to do about them.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { text: "Spots stale estimates before they go cold", icon: DollarSign },
                { text: "Tracks revenue trends and flags slowdowns", icon: TrendingUp },
                { text: "Gives you a game plan — not just data", icon: Target },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-10">
              <Link
                href="/advisor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/20"
              >
                Try Growth Advisor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Animated Chat */}
          <div className="scroll-fade-right relative">
            {/* Phone frame */}
            <div className="mx-auto max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-gray-200 overflow-hidden">
              {/* Status bar */}
              <div className="bg-white px-6 pt-4 pb-0">
                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span>9:41 AM</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2.5 border border-gray-400 rounded-sm relative">
                      <div className="absolute inset-0.5 bg-gray-400 rounded-sm" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Growth Advisor</p>
                  <p className="text-[11px] text-emerald-600">Online</p>
                </div>
              </div>

              {/* Messages area */}
              <div className="px-4 py-4 space-y-2.5 min-h-[380px] bg-white">
                {/* Date pill */}
                <div className="flex justify-center mb-3">
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">Today</span>
                </div>

                {conversation.slice(0, visibleMessages).map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeSlideUp_0.3s_ease-out]`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2 max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-[#0071E3] text-white rounded-br-md'
                          : 'bg-[#E9E9EB] text-gray-900 rounded-bl-md'
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#E9E9EB] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <div className="flex gap-1 items-center h-4">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2">
                  <span className="flex-1 text-[13px] text-gray-400">Ask about your business...</span>
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2 pt-1">
                <div className="w-32 h-1 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: 40, suffix: "%", label: "More Jobs Booked", sublabel: "Average in first 90 days" },
            { value: 60, suffix: "sec", label: "Lead Response Time", sublabel: "With Speed to Lead running" },
            { value: 12, suffix: "hrs", label: "Saved Per Week", sublabel: "On admin and follow-ups" },
            { value: 8500, suffix: "", prefix: "$", label: "Extra Revenue / Month", sublabel: "From jobs that would have been lost" },
          ].map((stat) => (
            <div key={stat.label} className="scroll-fade-up">
              <div className="text-3xl lg:text-4xl font-bold text-white">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
              </div>
              <p className="mt-2 text-sm text-slate-300 font-medium">{stat.label}</p>
              <p className="text-xs text-slate-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "We were losing calls every morning because the guys were already on jobs. Growth OS auto-texts every missed call now. Month one: 12 extra jobs. That's $14,000 we would have lost.",
      name: "Mike Reynolds",
      role: "Owner, Reynolds Plumbing — Toronto, ON",
      initials: "MR",
      color: "bg-blue-500",
    },
    {
      quote: "Jobber handled scheduling fine, but it never helped us grow. Growth OS follows up on every estimate, asks for reviews, and the tax calculations actually work for Quebec. Switched in one day.",
      name: "Jean-Pierre Lavoie",
      role: "Propri\u00E9taire, Lavoie Climatisation — Montr\u00E9al, QC",
      initials: "JL",
      color: "bg-red-500",
    },
    {
      quote: "We turned on the review machine. 23 new Google reviews in 30 days. Calls went up. People said they found us because of the reviews. The platform paid for itself in week one.",
      name: "Sarah Kim",
      role: "GM, Comfort Zone HVAC — Vancouver, BC",
      initials: "SK",
      color: "bg-emerald-500",
    },
    {
      quote: "I'm not a tech guy. I thought I'd need to hire someone to set this up. Took me 10 minutes. Now I see every job, every lead, every dollar — from my phone. Worth every penny.",
      name: "Tony Della Rosa",
      role: "Owner, Della Plumbing — Calgary, AB",
      initials: "TD",
      color: "bg-orange-500",
    },
    {
      quote: "Three trucks, three crews, and we were running on texts and memory. Growth OS let everyone see what's booked, who's going where, and what we're making. We doubled revenue this year.",
      name: "Priya Patel",
      role: "Manager, Elite HVAC Solutions — Mississauga, ON",
      initials: "PP",
      color: "bg-indigo-500",
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-6">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Real businesses.{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Real numbers.
            </span>
          </h2>
        </div>

        <div className="stagger-children grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.name} className="scroll-fade-up p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Second row — 2 testimonials centered */}
        <div className="stagger-children grid md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
          {testimonials.slice(3).map((t) => (
            <div key={t.name} className="scroll-fade-up p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.initials}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Competitor Comparison ───────────────────────────────────
function CompetitorComparison() {
  const competitors = [
    { name: "Growth OS", price: "$79\u2013$299", highlight: true, features: { leads: true, autopilot: true, estimates: true, tax: true, bilingual: true, noContract: true, reviews: true, pipeline: true } },
    { name: "ServiceTitan", price: "$200+ (annual)", highlight: false, features: { leads: true, autopilot: "partial" as const, estimates: true, tax: false, bilingual: false, noContract: false, reviews: false, pipeline: true } },
    { name: "Jobber", price: "$49\u2013$249", highlight: false, features: { leads: "partial" as const, autopilot: false, estimates: true, tax: "partial" as const, bilingual: false, noContract: true, reviews: false, pipeline: "partial" as const } },
    { name: "Housecall Pro", price: "$65\u2013$200", highlight: false, features: { leads: true, autopilot: "partial" as const, estimates: true, tax: false, bilingual: false, noContract: false, reviews: "partial" as const, pipeline: true } },
  ];

  const featureLabels = [
    { key: "leads", label: "Auto-respond to missed calls / leads" },
    { key: "autopilot", label: "Automated follow-ups, reviews & reminders" },
    { key: "estimates", label: "Good/Better/Best estimates" },
    { key: "tax", label: "Canadian tax calculations (no manual math)" },
    { key: "bilingual", label: "French + English templates" },
    { key: "noContract", label: "Month-to-month (cancel anytime)" },
    { key: "reviews", label: "Google + HomeStars review requests" },
    { key: "pipeline", label: "Visual job pipeline" },
  ];

  const renderCheck = (value: boolean | "partial") => {
    if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
    if (value === "partial") return <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center mx-auto"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>;
    return <X className="w-5 h-5 text-gray-300 mx-auto" />;
  };

  return (
    <section id="compare" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Compare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            More features.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Less money. No contracts.
            </span>
          </h2>
        </div>

        {/* Desktop table */}
        <div className="scroll-scale-up overflow-x-auto hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500"></th>
                {competitors.map((c) => (
                  <th key={c.name} className={`p-4 text-center ${c.highlight ? "bg-blue-50 rounded-t-2xl" : ""}`}>
                    <div className={`text-sm font-bold ${c.highlight ? "text-blue-600" : "text-gray-700"}`}>{c.name}</div>
                    <div className={`text-xs mt-1 ${c.highlight ? "text-blue-500" : "text-gray-400"}`}>{c.price}/mo</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureLabels.map((feature, i) => (
                <tr key={feature.key} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                  <td className="p-4 text-sm text-gray-700 font-medium">{feature.label}</td>
                  {competitors.map((c) => (
                    <td key={`${c.name}-${feature.key}`} className={`p-4 text-center ${c.highlight ? "bg-blue-50/50" : ""}`}>
                      {renderCheck(c.features[feature.key as keyof typeof c.features])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="scroll-scale-up md:hidden space-y-4">
          {competitors.map((c) => (
            <div key={c.name} className={`rounded-2xl p-5 ${c.highlight ? "bg-blue-50 border-2 border-blue-200" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-base font-bold ${c.highlight ? "text-blue-600" : "text-gray-900"}`}>{c.name}</div>
                  <div className={`text-xs ${c.highlight ? "text-blue-500" : "text-gray-400"}`}>{c.price}/mo</div>
                </div>
                {c.highlight && <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full">Best Value</span>}
              </div>
              <div className="space-y-2">
                {featureLabels.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-600 flex-1">{feature.label}</span>
                    <div className="shrink-0">{renderCheck(c.features[feature.key as keyof typeof c.features])}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Growth OS: month-to-month, cancel anytime. ServiceTitan requires annual contracts. Housecall Pro keeps raising prices.
        </p>
      </div>
    </section>
  );
}

// ─── Built for Canada (Closer) ───────────────────────────────
function BuiltForCanada() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Made in Canada</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            And it handles the Canadian stuff too.
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Every other CRM was built in the US and patched for Canada. Growth OS was built here.
          </p>
        </div>

        <div className="stagger-children grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <DollarSign className="w-5 h-5" />, title: "Taxes? Done.", desc: "HST, GST+QST, GST+PST — calculated automatically for every province. You never do the math." },
            { icon: <Languages className="w-5 h-5" />, title: "French + English", desc: "Quebec clients get emails and invoices in French. Everyone else gets English. Switches automatically." },
            { icon: <Receipt className="w-5 h-5" />, title: "CRA-Ready Invoices", desc: "Registration numbers, tax breakdowns, proper formatting. Your invoices are audit-ready by default." },
            { icon: <BadgeCheck className="w-5 h-5" />, title: "License Tracking", desc: "WSIB, WCB, trade licenses — get a reminder 90 days before anything expires. No surprise shutdowns." },
            { icon: <Globe className="w-5 h-5" />, title: "HomeStars Reviews", desc: "The review platform Canadian homeowners actually check. Auto-request reviews there alongside Google." },
            { icon: <DollarSign className="w-5 h-5" />, title: "Interac e-Transfer", desc: "Customers pay the way they prefer. Money hits your account in minutes, not days." },
          ].map((f) => (
            <div key={f.title} className="scroll-fade-up p-5 rounded-xl bg-white border border-gray-100 hover:border-red-200/50 hover:shadow-md transition-all">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "79",
      description: "You. One dashboard. Never miss a lead.",
      features: ["1 user account", "See every job at a glance", "All your customers in one place", "Provincial tax on every invoice", "Speed to Lead + Reviews + Payment reminders", "Email support"],
      cta: "Try Free (14 Days)",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "149",
      description: "Your whole team. One system. Everyone sees everything.",
      features: ["Up to 5 users", "Track as many jobs as you want", "All 8 automations running", "Tiered estimates to close bigger jobs", "French + English templates", "Know which jobs make the most money", "Priority support", "Google + HomeStars review sync"],
      cta: "Try Free (14 Days)",
      highlighted: true,
    },
    {
      name: "Scale",
      price: "299",
      description: "Multiple crews. Multiple locations. One view of everything.",
      features: ["Unlimited users", "Multi-location support", "License and WSIB/WCB tracking", "Connect to any software you use", "Dedicated account manager", "Interac e-Transfer integration", "We train your whole team", "Accounting software syncs automatically"],
      cta: "Try Free (14 Days)",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            One price. Everything{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              included.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            14-day free trial. No credit card. Month-to-month — cancel anytime.
            Most people stick around because it works.
          </p>
        </div>

        <div className="stagger-children grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`scroll-fade-up relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${plan.highlighted ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/25 md:scale-105" : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"}`}>
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className={`text-lg font-semibold ${plan.highlighted ? "text-blue-100" : "text-gray-900"}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>$</span>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>/mo CAD</span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? "text-blue-200" : "text-emerald-500"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-blue-50" : "text-gray-600"}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/setup" className={`mt-8 block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlighted ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How long does it take to set up?", a: "10 minutes. Import your customers from a spreadsheet (or add them one by one), turn on the automations you want, and you're running. No training required." },
    { q: "Can I import my data from Jobber / Housecall Pro?", a: "Yes. Export your customer list as a CSV and import it directly into Growth OS. We also offer free migration help on the Growth and Scale plans." },
    { q: "Does it handle Quebec taxes (GST + QST)?", a: "Yes. Growth OS auto-calculates the correct tax for every province — HST in Ontario, GST+QST in Quebec, GST+PST in BC, and so on. Your invoices are always CRA-compliant." },
    { q: "Can my technicians use it on their phones?", a: "Yes. Growth OS is fully responsive. Your team can see their jobs, update statuses, and check the pipeline from any phone or tablet." },
    { q: "What if I'm a solo operator — is this too much for me?", a: "Not at all. The Starter plan ($79/mo) is built for one-person shops. You get a pipeline view, auto-responses to missed calls, payment reminders, and review requests. It saves you 12+ hours a week." },
    { q: "Is there a contract?", a: "No. Month-to-month billing. Cancel anytime. No cancellation fees. No awkward phone calls." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="scroll-fade-up text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Questions?</h2>
        </div>

        <div className="scroll-fade-up space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-90" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>
      <div className="scroll-fade-up relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          10 minutes from now,
          <br />
          your business runs different.
        </h2>
        <p className="mt-6 text-lg text-blue-200/80 max-w-2xl mx-auto">
          Set it up during your morning coffee. By lunch, your leads are getting auto-responses,
          your estimates are following up, and your reviews are rolling in.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/setup" className="glow-pulse inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-600 text-base font-semibold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
            Try Free for 14 Days <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/20 text-white text-base font-semibold rounded-2xl hover:bg-white/10 transition-all">
            See It in Action
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-300/60">No credit card. No contracts. Cancel anytime. No fine print.</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Growth OS<span className="text-blue-500">™</span></span>
            </div>
            <p className="text-sm leading-relaxed">The operating system for service business growth. Purpose-built for the trades.</p>
            <div className="mt-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-slate-500">Made in Canada</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "Autopilot", "Pricing", "Compare", "Roadmap"].map((link) => (
                <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Built For</h4>
            <ul className="space-y-2.5">
              {["Plumbing", "HVAC", "Electrical", "Landscaping", "Roofing", "Cleaning"].map((link) => (
                <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Blog", "Help Centre", "Contact", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Growth OS. All rights reserved. Made in Canada.</p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@growthos.ca" className="text-slate-500 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="tel:+18005550199" className="text-slate-500 hover:text-white transition-colors"><Phone className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────
export default function LandingPage() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <AutopilotSection />
      <AdvisorDemo />
      <StatsBanner />
      <CompetitorComparison />
      <BuiltForCanada />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </div>
  );
}
