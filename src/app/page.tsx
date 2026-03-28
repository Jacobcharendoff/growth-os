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
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
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
              <a href="#how-it-works" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Testimonials</a>
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
            <span className="text-sm font-medium text-blue-700">Now in Beta — Built for Service Businesses</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Grow your service
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              business on autopilot
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The all-in-one operating system that turns your leads into booked jobs.
            Pipeline management, automated follow-ups, and growth analytics —
            built specifically for plumbing, HVAC, and home service companies.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-600/25 hover:shadow-blue-700/30 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              See How It Works
              <ChevronRight className="w-5 h-5" />
            </a>
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
                    {["JM", "SK", "RL", "TB"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">Trusted by 50+ service businesses</span>
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
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60" />
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
                    {["Dashboard", "Pipeline", "Contacts", "Activity"].map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1 text-sm ${
                          i === 0
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-slate-400"
                        }`}
                      >
                        {[<BarChart3 key="b" className="w-4 h-4" />, <Layers key="l" className="w-4 h-4" />, <Users key="u" className="w-4 h-4" />, <Bell key="n" className="w-4 h-4" />][i]}
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
                        { label: "Total Leads", value: "7", trend: "+12%", color: "text-emerald-500" },
                        { label: "Active Deals", value: "12", trend: "+8%", color: "text-emerald-500" },
                        { label: "Pipeline Value", value: "$49.5k", trend: "+15%", color: "text-emerald-500" },
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
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${[80, 55, 40, 30][i]}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3">Lead Sources</p>
                        {[
                          { name: "Ring 1 (Harvest)", pct: 70, color: "bg-emerald-500" },
                          { name: "Ring 2 (Amplify)", pct: 55, color: "bg-amber-500" },
                          { name: "Ring 3 (Acquire)", pct: 40, color: "bg-blue-500" },
                        ].map((source) => (
                          <div key={source.name} className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-gray-400 w-24">{source.name}</span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${source.color} rounded-full`}
                                style={{ width: `${source.pct}%` }}
                              />
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

// ─── Stats Banner ─────────────────────────────────────────────
function StatsBanner() {
  return (
    <section className="relative py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: 340, suffix: "%", label: "Average ROI" },
            { value: 50, suffix: "+", label: "Service Businesses" },
            { value: 12, suffix: "hrs", label: "Saved Per Week" },
            { value: 98, suffix: "%", label: "Customer Retention" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl lg:text-4xl font-bold text-white">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
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
      title: "3-Ring Lead Engine",
      description:
        "Our proprietary growth framework harvests existing customers (Ring 1), amplifies through referrals and community (Ring 2), and acquires new leads through paid channels (Ring 3).",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Visual Pipeline",
      description:
        "Drag-and-drop Kanban board tracks every job from new lead through to invoiced. See your entire business at a glance with 8 customizable pipeline stages.",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Growth Analytics",
      description:
        "Real-time dashboards show pipeline value, conversion rates, lead source ROI, and revenue trends. Know exactly which growth channels deliver the highest returns.",
      gradient: "from-purple-500 to-violet-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Contact Management",
      description:
        "Complete customer profiles with service history, communication logs, and deal tracking. Every touchpoint organized, searchable, and actionable.",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Automated Follow-ups",
      description:
        "Never lose a lead to silence. Automated sequences keep prospects warm, trigger review requests after completed jobs, and reactivate dormant customers.",
      gradient: "from-rose-500 to-pink-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Built for Services",
      description:
        "Not another generic CRM. Growth OS is purpose-built for plumbing, HVAC, electrical, and landscaping. Industry-specific workflows, terminology, and metrics.",
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
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              scale your business
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Stop juggling spreadsheets and sticky notes. Growth OS replaces your entire tech stack with one powerful platform.
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

// ─── How It Works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Connect Your Business",
      description: "Import existing contacts or start fresh. Growth OS maps your customer base and identifies untapped revenue opportunities in minutes.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      step: "02",
      title: "Activate Growth Rings",
      description: "Our 3-Ring system prioritizes lead generation. Start with your highest-value channel (existing customers), then expand outward to community and paid acquisition.",
      icon: <Target className="w-6 h-6" />,
    },
    {
      step: "03",
      title: "Manage Your Pipeline",
      description: "Every lead flows through your visual pipeline. Drag deals between stages, set follow-up reminders, and never let an opportunity slip through the cracks.",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      step: "04",
      title: "Scale & Optimize",
      description: "Real-time analytics show exactly what's working. Double down on high-performing channels, improve conversion rates, and predictably grow revenue.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 mb-6">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            From zero to growth{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              in four steps
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent" />
              )}
              <div className="text-5xl font-black text-blue-100 mb-4">{step.step}</div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
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
      quote: "Growth OS replaced three different tools we were paying for. Our pipeline is clearer than ever and we booked 40% more jobs this quarter.",
      name: "Mike Reynolds",
      role: "Owner, Reynolds Plumbing",
      initials: "MR",
      color: "bg-blue-500",
    },
    {
      quote: "The 3-Ring system opened my eyes to how many leads we were leaving on the table. Our reactivation campaigns alone paid for the entire platform.",
      name: "Sarah Kim",
      role: "GM, Comfort Zone HVAC",
      initials: "SK",
      color: "bg-emerald-500",
    },
    {
      quote: "Finally, a CRM that speaks our language. No more forcing a generic sales tool to work for service businesses. This was built for us.",
      name: "Tom Bradley",
      role: "Owner, Bradley Electric",
      initials: "TB",
      color: "bg-purple-500",
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
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              service businesses
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
      price: "49",
      description: "Perfect for solo operators just getting started.",
      features: [
        "1 user",
        "Visual pipeline (up to 50 deals)",
        "Contact management",
        "Basic analytics dashboard",
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
        "3-Ring lead generation engine",
        "Automated follow-up sequences",
        "Advanced analytics & reporting",
        "Priority support",
        "QuickBooks integration",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For multi-location operations and franchises.",
      features: [
        "Unlimited users",
        "Multi-location support",
        "Custom integrations",
        "Dedicated account manager",
        "API access",
        "Custom training & onboarding",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            14-day free trial on all plans. No credit card required.
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
                {plan.price !== "Custom" && (
                  <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>$</span>
                )}
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className={`text-sm ${plan.highlighted ? "text-blue-200" : "text-gray-400"}`}>/mo</span>
                )}
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
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Ready to grow your
          <br />
          service business?
        </h2>
        <p className="mt-6 text-lg text-blue-200/80 max-w-2xl mx-auto">
          Join 50+ service businesses already using Growth OS to streamline operations, book more jobs, and grow revenue predictably.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-blue-600 text-base font-semibold rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="mailto:hello@growthos.com"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/20 text-white text-base font-semibold rounded-2xl hover:bg-white/10 transition-all"
          >
            Talk to Sales
          </a>
        </div>
        <p className="mt-6 text-sm text-blue-300/60">14-day free trial. No credit card required.</p>
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
              The operating system for service business growth. Built by operators, for operators.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "Pricing", "Integrations", "Roadmap", "Changelog"].map((link) => (
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
              {["About", "Blog", "Careers", "Contact", "Partners"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Growth OS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:hello@growthos.com" className="text-slate-500 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="tel:+1800000000" className="text-slate-500 hover:text-white transition-colors">
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
      <StatsBanner />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </div>
  );
}
