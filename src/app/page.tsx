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
  Clock,
  CheckCircle2,
  Star,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Layers,
  Bell,
  Phone,
  Mail,
  MapPin,
  Globe,
  DollarSign,
  Bot,
  FileText,
  Rocket,
  Receipt,
  Languages,
  BadgeCheck,
  Wrench,
  Flame,
  Plug,
  TreePine,
  Home,
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
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Growth OS<span className="text-blue-600">™</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#autopilot" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Autopilot</a>
            <a href="#why-canada" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Why Canada</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#compare" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Compare</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#autopilot" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Autopilot</a>
              <a href="#why-canada" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Why Canada</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Pricing</a>
              <a href="#compare" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Compare</a>
              <div className="flex gap-3 pt-2">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600">Log in</Link>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
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
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-400/8 via-blue-400/5 to-transparent rounded-full blur-3xl" />

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40" />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Now in Beta — Free for 14 Days</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Stop losing leads.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start booking jobs.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            New leads get a response in 60 seconds. Estimates follow up automatically.
            Reviews roll in after every job. Your pipeline runs itself while you&apos;re on the job site.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Start Free — 14 Days
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              See Live Demo
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {[
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-amber-500",
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {["MR", "JL", "SK", "TB"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">Trusted by service businesses across Canada</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1.5">4.9/5 rating</span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mt-16 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/15 via-blue-600/20 to-red-600/15 rounded-3xl blur-2xl opacity-60" />
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/50 overflow-hidden">
              {/* Browser Chrome */}
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
              {/* Simulated Dashboard */}
              <div className="p-1 bg-slate-100">
                <div className="bg-slate-50 flex min-h-[420px]">
                  {/* Mini Sidebar */}
                  <div className="w-48 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 hidden sm:block rounded-bl-xl">
                    <div className="flex items-center gap-2 mb-8">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-white">Growth OS</span>
                    </div>
                    {["Dashboard", "Pipeline", "Contacts", "Autopilot", "Estimates"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-sm ${
                          i === 0
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-400"
                        }`}
                      >
                        {[<BarChart3 key="b" className="w-4 h-4" />, <Layers key="l" className="w-4 h-4" />, <Users key="u" className="w-4 h-4" />, <Bot key="a" className="w-4 h-4" />, <FileText key="e" className="w-4 h-4" />][i]}
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Mini Dashboard Content */}
                  <div className="flex-1 p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Dashboard</h3>
                      <p className="text-xs text-gray-400">Welcome back! Here&apos;s your pipeline overview.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "Active Leads", value: "23", trend: "+12%", color: "text-emerald-500" },
                        { label: "Pipeline Value", value: "$87.5k", trend: "+18%", color: "text-emerald-500" },
                        { label: "Jobs Booked", value: "14", trend: "+24%", color: "text-emerald-500" },
                      ].map((kpi) => (
                        <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">{kpi.label}</p>
                          <p className="text-2xl font-bold mt-1 text-gray-900">{kpi.value}</p>
                          <p className={`text-[10px] mt-1 ${kpi.color}`}>{kpi.trend} from last month</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Pipeline Funnel</p>
                        {["New Leads", "Contacted", "Estimate Sent", "Booked"].map((stage, i) => (
                          <div key={stage} className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-gray-400 w-20">{stage}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                style={{ width: `${[80, 55, 40, 30][i]}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Autopilot Active</p>
                        {[
                          { name: "Speed to Lead", status: "Running", color: "bg-emerald-500" },
                          { name: "Review Machine", status: "Running", color: "bg-emerald-500" },
                          { name: "Estimate Follow-Up", status: "Running", color: "bg-emerald-500" },
                        ].map((playbook) => (
                          <div key={playbook.name} className="flex items-center justify-between mb-2.5">
                            <span className="text-[10px] text-gray-500">{playbook.name}</span>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${playbook.color} animate-pulse`} />
                              <span className="text-[10px] text-emerald-600 font-medium">{playbook.status}</span>
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

// ─── Industry Badges ─────────────────────────────────────────
function IndustryBadges() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400 mb-6">Purpose-built for Canadian trades</p>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: <Wrench className="w-4 h-4" />, label: "Plumbing" },
            { icon: <Flame className="w-4 h-4" />, label: "HVAC" },
            { icon: <Plug className="w-4 h-4" />, label: "Electrical" },
            { icon: <TreePine className="w-4 h-4" />, label: "Landscaping" },
            { icon: <Home className="w-4 h-4" />, label: "Roofing" },
            { icon: <Sparkles className="w-4 h-4" />, label: "Cleaning" },
          ].map((trade) => (
            <div key={trade.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium">
              {trade.icon}
              {trade.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: 40, suffix: "%", label: "More Jobs Booked", sublabel: "Average increase in 90 days" },
            { value: 60, suffix: "sec", label: "Lead Response Time", sublabel: "With Autopilot active" },
            { value: 12, suffix: "hrs", label: "Saved Per Week", sublabel: "On admin & follow-ups" },
            { value: 340, suffix: "%", label: "Average ROI", sublabel: "First 90 days" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl lg:text-4xl font-bold text-white">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
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

// ─── Features Section ─────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Never Miss a Lead Again",
      description:
        "Every call, form, and referral lands in one place. The average plumber misses 30-40% of inbound calls — Growth OS makes sure every lead gets a response, even when you're under a sink.",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "See Every Job at a Glance",
      description:
        "Drag-and-drop pipeline shows every deal from first call to final invoice. No more sticky notes, no more spreadsheets. Know exactly where every job stands in 3 seconds.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Follow-Ups That Run Themselves",
      description:
        "8 pre-built playbooks handle the busywork — speed-to-lead responses, estimate nudges, review requests, payment reminders. One click to activate. You never think about it again.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Estimates That Close",
      description:
        "Good/Better/Best pricing on every estimate. Customers pick the option that fits. Businesses using tiered pricing see 30% higher average tickets. Growth OS makes it automatic.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Know What\u2019s Working",
      description:
        "Real-time dashboard shows which lead sources bring in the most revenue, which jobs are most profitable, and where deals stall. Make decisions with data, not gut feelings.",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Get Paid Faster",
      description:
        "Send professional invoices the moment a job is done. Automated payment reminders at 3, 7, and 14 days chase the money so you don\u2019t have to. Provincial taxes calculated automatically.",
      gradient: "from-slate-500 to-gray-600",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Six tools in one.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zero learning curve.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Replace your spreadsheets, sticky notes, and that CRM you never log into.
            Growth OS handles leads, pipeline, estimates, invoicing, follow-ups, and analytics — purpose-built for the trades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-5`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
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
    {
      name: "Speed to Lead",
      description: "Respond to new leads in under 60 seconds with automated SMS + email. First to respond wins 78% of jobs.",
      category: "Lead Capture",
      color: "bg-blue-500",
    },
    {
      name: "Estimate Follow-Up Machine",
      description: "Automated 3-touch sequence after every estimate. Day 1, Day 3, Day 7 — gentle nudges that book jobs.",
      category: "Follow-Up",
      color: "bg-purple-500",
    },
    {
      name: "5-Star Review Machine",
      description: "Auto-request Google and HomeStars reviews 2 hours after job completion. Build your reputation on autopilot.",
      category: "Reputation",
      color: "bg-amber-500",
    },
    {
      name: "Payment Chaser",
      description: "Automated invoice reminders at 3, 7, and 14 days. Friendly nudges that get you paid faster.",
      category: "Revenue",
      color: "bg-emerald-500",
    },
    {
      name: "Customer Reactivation",
      description: "Re-engage customers who haven't booked in 60+ days with personalized offers. Win back dormant revenue.",
      category: "Retention",
      color: "bg-rose-500",
    },
    {
      name: "Seasonal Campaigns",
      description: "Winterization reminders, spring AC tune-ups, fall furnace checks — automated seasonal outreach timed perfectly.",
      category: "Growth",
      color: "bg-teal-500",
    },
  ];

  return (
    <section id="autopilot" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Autopilot</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Your business runs itself{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              while you run your jobs
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            8 pre-built playbooks with ready-to-use email and SMS templates. One click to activate.
            Every template uses merge variables so messages feel personal, not robotic.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {playbooks.map((playbook) => (
            <div
              key={playbook.name}
              className="group p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${playbook.color}`}>
                  {playbook.category}
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{playbook.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{playbook.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-600/20"
          >
            Explore All 8 Playbooks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Why Canada Section ──────────────────────────────────────
function WhyCanada() {
  const canadianFeatures = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Taxes? Handled.",
      description: "Invoices go out with the right provincial tax every time — HST, GST+QST, GST+PST. You enter the job, we do the math.",
      detail: "All 10 provinces",
    },
    {
      icon: <Languages className="w-5 h-5" />,
      title: "Fran\u00E7ais + English",
      description: "Your Quebec clients get emails, estimates, and invoices in French. Everyone else gets English. It switches automatically.",
      detail: "Bill 96 ready",
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: "CRA-Ready Invoices",
      description: "Registration numbers, line-item tax breakdowns, proper formatting — your invoices are audit-ready without you thinking about it.",
      detail: "Compliant by default",
    },
    {
      icon: <BadgeCheck className="w-5 h-5" />,
      title: "License Reminders",
      description: "Track your trade licenses and WSIB/WCB status. Get a nudge 90 days before anything expires. No surprise lapses.",
      detail: "Province-specific",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "HomeStars + Google Reviews",
      description: "Auto-request reviews on the platforms Canadian homeowners actually check. More reviews means more calls. Simple.",
      detail: "Auto-request after every job",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Interac e-Transfer",
      description: "Your customers already use it. Now they can pay invoices with it. Faster than cheques, simpler than credit cards.",
      detail: "Get paid how Canadians pay",
    },
  ];

  return (
    <section id="why-canada" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle maple leaf pattern could go here */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-6">
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Canada First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            And it just works{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              for your Canadian business
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            No manual tax calculations. No English-only templates for your Quebec clients.
            No workarounds. Everything your business needs to stay compliant and get paid — built in from day one.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canadianFeatures.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-to-b from-red-50/50 to-white border border-red-100/50 hover:border-red-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{feature.description}</p>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">{feature.detail}</span>
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
    {
      name: "Growth OS",
      price: "$79–$299",
      highlight: true,
      features: {
        canadianTax: true,
        bilingual: true,
        interac: true,
        homeStars: true,
        autopilot: true,
        noContract: true,
        wsib: true,
        pipeline: true,
      },
    },
    {
      name: "ServiceTitan",
      price: "$200+",
      highlight: false,
      features: {
        canadianTax: false,
        bilingual: false,
        interac: false,
        homeStars: false,
        autopilot: "partial",
        noContract: false,
        wsib: false,
        pipeline: true,
      },
    },
    {
      name: "Jobber",
      price: "$49–$249",
      highlight: false,
      features: {
        canadianTax: "partial",
        bilingual: false,
        interac: false,
        homeStars: false,
        autopilot: false,
        noContract: true,
        wsib: false,
        pipeline: "partial",
      },
    },
    {
      name: "Housecall Pro",
      price: "$65–$200",
      highlight: false,
      features: {
        canadianTax: false,
        bilingual: false,
        interac: false,
        homeStars: false,
        autopilot: "partial",
        noContract: false,
        wsib: false,
        pipeline: true,
      },
    },
  ];

  const featureLabels = [
    { key: "canadianTax", label: "Provincial Tax Engine (GST/HST/PST/QST)" },
    { key: "bilingual", label: "Bilingual EN/FR Templates" },
    { key: "interac", label: "Interac e-Transfer" },
    { key: "homeStars", label: "HomeStars Integration" },
    { key: "autopilot", label: "Autopilot Playbooks" },
    { key: "noContract", label: "No Contracts, Cancel Anytime" },
    { key: "wsib", label: "WSIB/WCB License Tracking" },
    { key: "pipeline", label: "Visual Pipeline / Kanban" },
  ];

  const renderCheck = (value: boolean | string) => {
    if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (value === "partial") return <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-amber-400" /></div>;
    return <X className="w-5 h-5 text-gray-300" />;
  };

  return (
    <section id="compare" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        <div className="overflow-x-auto">
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

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full support</span>
            <span className="mx-3">|</span>
            <span className="inline-flex items-center gap-1"><div className="w-4 h-4 rounded-full border-2 border-amber-400 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /></div> Partial / add-on</span>
            <span className="mx-3">|</span>
            <span className="inline-flex items-center gap-1"><X className="w-4 h-4 text-gray-300" /> Not available</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      quote: "Growth OS replaced three tools we were paying for. Our pipeline is clearer than ever and we booked 40% more jobs this quarter. The tax calculations alone save us hours.",
      name: "Mike Reynolds",
      role: "Owner, Reynolds Plumbing — Toronto, ON",
      initials: "MR",
      color: "bg-blue-500",
    },
    {
      quote: "Finally, a CRM that handles Quebec taxes properly. The French templates mean our customer communications actually look professional. Our clients notice the difference.",
      name: "Jean-Pierre Lavoie",
      role: "Propri\u00E9taire, Lavoie Climatisation — Montr\u00E9al, QC",
      initials: "JL",
      color: "bg-red-500",
    },
    {
      quote: "The Autopilot playbooks are a game-changer. We turned on the review machine and got 23 new Google reviews in the first month. That alone paid for the whole platform.",
      name: "Sarah Kim",
      role: "GM, Comfort Zone HVAC — Vancouver, BC",
      initials: "SK",
      color: "bg-emerald-500",
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-6">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Real results from real{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              service businesses.
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {t.initials}
                </div>
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

// ─── Pricing ──────────────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "79",
      description: "For solo operators ready to stop losing leads.",
      features: [
        "1 user",
        "Visual pipeline (up to 50 deals)",
        "Contact management",
        "Provincial tax calculations",
        "3 Autopilot playbooks",
        "Email support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Growth",
      price: "149",
      description: "For growing teams ready to scale their pipeline.",
      features: [
        "Up to 5 users",
        "Unlimited deals & contacts",
        "All 8 Autopilot playbooks",
        "Good/Better/Best estimates",
        "Bilingual EN/FR templates",
        "Advanced analytics & reporting",
        "Priority support",
        "HomeStars + Google review sync",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Scale",
      price: "299",
      description: "For multi-crew operations and growing franchises.",
      features: [
        "Unlimited users",
        "Multi-location support",
        "WSIB/WCB license tracking",
        "Custom integrations & API",
        "Dedicated account manager",
        "Interac e-Transfer integration",
        "Custom training & onboarding",
        "QuickBooks / Xero sync",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            14-day free trial. No credit card required. Month-to-month — cancel anytime, no contracts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/25 scale-105"
                  : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <h3
                className={`text-lg font-semibold ${
                  plan.highlighted ? "text-blue-100" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>$</span>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>/mo CAD</span>
              </div>
              <p className={`mt-2 text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                {plan.description}
              </p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-blue-200" : "text-emerald-500"
                      }`}
                    />
                    <span className={`text-sm ${plan.highlighted ? "text-blue-50" : "text-gray-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`mt-8 block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Competitor price anchoring */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            ServiceTitan charges $200+/mo with annual contracts. Housecall Pro keeps raising prices.
            Growth OS gives you more for less — and you can cancel anytime.
          </p>
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Your competitors are still
          <br />
          using spreadsheets.
        </h2>
        <p className="mt-6 text-lg text-blue-200/80 max-w-2xl mx-auto">
          Every day without a system is leads lost, follow-ups missed, and revenue left on the table.
          Growth OS takes 10 minutes to set up and starts working immediately.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/setup"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-600 text-base font-semibold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Free — 14 Days
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/20 text-white text-base font-semibold rounded-2xl hover:bg-white/10 transition-all"
          >
            See the Live Demo
          </Link>
        </div>
        <p className="mt-6 text-sm text-blue-300/60">No credit card required. Month-to-month. Cancel anytime.</p>
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
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Growth OS<span className="text-blue-500">™</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              The operating system for service business growth. Purpose-built for the trades.
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs text-slate-500">Made in Canada</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "Autopilot", "Pricing", "Compare", "Roadmap"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Industries</h4>
            <ul className="space-y-2.5">
              {["Plumbing", "HVAC", "Electrical", "Landscaping", "Roofing", "Cleaning"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {["About", "Blog", "Careers", "Contact", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Growth OS. All rights reserved. Built in Canada.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@growthos.ca" className="text-slate-500 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="tel:+18005550199" className="text-slate-500 hover:text-white transition-colors">
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <IndustryBadges />
      <StatsBanner />
      <Features />
      <AutopilotSection />
      <WhyCanada />
      <CompetitorComparison />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
