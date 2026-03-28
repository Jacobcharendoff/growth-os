"use client";

import { useState, useEffect, useRef } from "react";
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
  Plus,
  Minus,
  Send,
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

// ─── Scroll Progress Hook ──────────────────────────────────────
function useScrollProgress(elementId: string) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(elementId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const raw = (windowHeight - rect.top) / (windowHeight + rect.height);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementId]);
  return progress;
}

// ─── Parallax Hook ─────────────────────────────────────────────
function useParallax(speed: number = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        setOffset(window.scrollY * speed);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);
  return offset;
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
  const parallaxOffset = useParallax(0.2);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh-dark opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950" />

      {/* Parallax Background Blobs - More vibrant for dark */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl" style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/12 via-blue-600/8 to-transparent rounded-full blur-3xl" style={{ transform: `translateY(${-parallaxOffset * 0.1}px)` }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="hero-reveal hero-reveal-delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/40 border border-blue-900/50 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-200">Free for 14 days — no credit card needed</span>
          </div>

          {/* Headline - Much Larger */}
          <h1 className="hero-reveal hero-reveal-delay-2 text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-4">
            Every missed call is a
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              job you lost.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-reveal hero-reveal-delay-3 mt-8 text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Growth OS auto-responds to new leads in 60 seconds, follows up on estimates for you,
            and gets you paid faster. You run the jobs. It runs everything else.
          </p>

          {/* CTAs */}
          <div className="hero-reveal hero-reveal-delay-4 mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/setup"
              className="glow-pulse inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-xl shadow-blue-600/50 hover:shadow-blue-500/60 hover:-translate-y-0.5"
            >
              Try Free for 14 Days
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-800/50 text-slate-100 text-base font-semibold rounded-2xl border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all backdrop-blur-sm"
            >
              See It in Action
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="hero-reveal hero-reveal-delay-5 mt-16 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-slate-950 flex items-center justify-center text-white text-xs font-bold`}>
                    {["MR", "JL", "SK", "PP", "TD"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-400 ml-2">Plumbers, HVAC, electricians across Canada</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-slate-400 ml-1.5">4.9/5 rating</span>
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
          ].map((pain, index) => (
            <div key={pain} className={`${index % 2 === 0 ? 'scroll-fade-left' : 'scroll-fade-right'} flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10`}>
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
              {i < 3 && <div className="scroll-fade-up hidden lg:block absolute top-12 left-full w-full h-px draw-path bg-gradient-to-r from-blue-200 to-transparent" />}
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

// ─── Product Showcase Component (Sticky Scroll Feature Showcase) ─────────────────────────────────────────
function ProductShowcase() {
  const [phase, setPhase] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 to 1) within this section
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));

      // Map to 4 phases (0-3)
      const newPhase = Math.min(3, Math.floor(scrollProgress * 4));
      setPhase(newPhase);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phases = [
    {
      title: "See every job at a glance",
      gradient: "from-blue-600 via-blue-500 to-cyan-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-4 bg-slate-50">
            <div className="text-xs font-semibold text-gray-600 mb-3">PIPELINE</div>
            <div className="flex gap-3">
              {['New Leads', 'Quoted', 'Booked', 'In Progress'].map((stage, i) => (
                <div key={stage} className="flex-1 bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-[10px] text-gray-500 font-semibold mb-2">{stage}</div>
                  <div className="space-y-2">
                    {[1, 2].map((j) => (
                      <div key={j} className={`rounded-md p-2 text-[10px] font-medium flex items-center gap-1.5 ${
                        i === 0 ? 'bg-blue-100 text-blue-700' :
                        i === 1 ? 'bg-purple-100 text-purple-700' :
                        i === 2 ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        Job {i}{j}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tiered pricing that closes deals",
      gradient: "from-purple-600 via-purple-500 to-pink-500",
      content: (
        <div className="w-full max-w-lg space-y-4">
          {[
            { tier: 'Good', price: '$800', color: 'bg-slate-50 border-gray-200' },
            { tier: 'Better', price: '$1,200', color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 ring-2 ring-blue-500', isHighlight: true },
            { tier: 'Best', price: '$1,800', color: 'bg-slate-50 border-gray-200' }
          ].map((tier) => (
            <div key={tier.tier} className={`rounded-xl p-4 border-2 transition-all ${tier.color} ${tier.isHighlight ? 'scale-105 shadow-2xl shadow-blue-500/20' : 'shadow-lg'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{tier.tier}</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{tier.price}</div>
                </div>
                {tier.isHighlight && <div className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">Recommended</div>}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Automations running while you sleep",
      gradient: "from-emerald-600 via-emerald-500 to-cyan-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3" />
          <div className="p-6 space-y-4">
            {['Speed to Lead', 'Estimate Follow-Up', 'Review Requests', 'Payment Reminders'].map((automation) => (
              <div key={automation} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-900">{automation}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                  <span className="text-xs font-semibold text-emerald-600">Running</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Your AI growth advisor in your pocket",
      gradient: "from-indigo-600 via-indigo-500 to-purple-500",
      content: (
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-6 space-y-4 bg-slate-50">
            <div className="flex gap-2">
              <div className="max-w-xs bg-gray-200 rounded-lg p-3 text-sm">
                What should I focus on this week?
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="max-w-xs bg-indigo-500 text-white rounded-lg p-3 text-sm">
                Your top 3 opportunities: 2 estimates pending follow-up, 1 invoice overdue, and 4 new leads to call today.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="max-w-xs bg-gray-200 rounded-lg p-3 text-sm">
                Which customers pay the fastest?
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="product-showcase" ref={showcaseRef} className="relative bg-slate-50">
      {/* Desktop: sticky scroll version (400vh) */}
      <div className="hidden lg:block" style={{ height: '400vh', position: 'relative' }}>
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden transition-colors duration-500" style={{ backgroundColor: `hsl(${200 + phase * 10}, 70%, 40%)` }}>
          <div className={`absolute inset-0 opacity-60 transition-opacity duration-500 bg-gradient-to-br ${phases[phase].gradient}`} />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full h-full flex items-center">
            <div className="grid grid-cols-2 gap-12 items-center w-full">
              {/* Text content */}
              <div>
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-500" style={{ opacity: 1 - Math.abs(0 - phase) * 0.2 }}>
                  {phases[phase].title}
                </h2>
                <p className="text-lg text-white/80 max-w-xl transition-all duration-500">
                  {phase === 0 && "Drag jobs between stages. Customers see updates in real-time. Nothing slips through the cracks."}
                  {phase === 1 && "Good, Better, Best pricing increases close rates by 30%. Growth OS auto-follows up if they don't respond."}
                  {phase === 2 && "Set it once. It runs forever. Speed to Lead, Follow-ups, Reviews, Payments — all on autopilot."}
                  {phase === 3 && "Ask Growth Advisor anything about your business. Get AI-powered insights on what to focus on today."}
                </p>
              </div>

              {/* Product mockup */}
              <div className="flex items-center justify-center h-full transition-all duration-500">
                <div className="opacity-0 transition-opacity duration-500" style={{ opacity: phase >= 0 ? 1 : 0 }}>
                  {phases[phase].content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden scroll drivers */}
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
      </div>

      {/* Mobile: stacked vertical version */}
      <div className="lg:hidden">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {phases.map((phaseData, index) => (
            <div key={index} className="mb-16 scroll-fade-up">
              <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 overflow-hidden shadow-lg">
                <div className={`h-48 flex items-center justify-center bg-gradient-to-br ${phaseData.gradient}`}>
                  <div className="text-white text-center">
                    <div className="text-lg font-semibold opacity-90">Feature {index + 1}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{phaseData.title}</h3>
                  <p className="text-gray-600 mb-6">
                    {index === 0 && "Drag jobs between stages. Customers see updates in real-time. Nothing slips through the cracks."}
                    {index === 1 && "Good, Better, Best pricing increases close rates by 30%. Growth OS auto-follows up if they don't respond."}
                    {index === 2 && "Set it once. It runs forever. Speed to Lead, Follow-ups, Reviews, Payments — all on autopilot."}
                    {index === 3 && "Ask Growth Advisor anything about your business. Get AI-powered insights on what to focus on today."}
                  </p>
                  <div className="scale-75 origin-top-left">
                    {phaseData.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Explorer Section ─────────────────────────────
function InteractiveExplorer() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'estimates', label: 'Estimates' },
    { id: 'advisor', label: 'Growth Advisor' },
    { id: 'autopilot', label: 'Autopilot' },
    { id: 'invoicing', label: 'Invoicing' },
  ];

  const tabInfo: { [key: string]: { title: string; description: string } } = {
    dashboard: {
      title: 'Your Command Center',
      description: 'See leads, revenue, pipeline, and team activity — all in one view. Real-time metrics guide your decisions.',
    },
    pipeline: {
      title: 'Drag & Drop Pipeline',
      description: 'Drag jobs from quote to complete. Every crew member sees what\'s next and when it\'s due.',
    },
    estimates: {
      title: 'Tiered Pricing',
      description: 'Good/Better/Best tiers close 30% more deals. Customers pick the option that fits. You win either way.',
    },
    advisor: {
      title: 'Growth Advisor',
      description: 'Like texting your smartest business partner. Ask anything about your numbers and get instant insights.',
    },
    autopilot: {
      title: 'Automations',
      description: '8 automations running while you sleep. Speed to Lead, Follow-ups, Reviews — all on without lifting a finger.',
    },
    invoicing: {
      title: 'Smart Invoicing',
      description: 'Send invoices the minute a job is done. Canadian taxes calculated automatically. Get paid faster.',
    },
  };

  // ─── Smooth easing constant ───
  const smooth = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ─── Dashboard Tab Content
  const DashboardContent = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
      const t1 = setTimeout(() => setPhase(1), 100);   // KPIs fade in
      const t2 = setTimeout(() => setPhase(2), 800);   // Chart bars rise
      const t3 = setTimeout(() => setPhase(3), 1600);  // Pipeline bars fill
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const chartHeights = [40, 55, 45, 65, 75, 85, 70, 90, 95, 80, 88, 100];
    const pipelineWidths = [80, 55, 40, 30];

    return (
      <div className="w-full">
        <div className="bg-slate-800 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" style={{ opacity: phase >= 1 ? 1 : 0.3, transition: `opacity 1.5s ${smooth}` }} />
          </div>
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ opacity: phase >= 1 ? 1 : 0.3, transition: `opacity 1.5s ${smooth}` }} />
              <span className="text-xs text-slate-400 font-mono">app.growthos.com/dashboard</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-b-xl p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'New Leads', value: '23', trend: '+12%' },
              { label: 'Active Jobs', value: '14', trend: '+24%' },
              { label: 'Revenue', value: '$87.4K', trend: '+18%' },
              { label: 'Conversion', value: '68%', trend: '+5%' },
            ].map((kpi, i) => (
              <div key={kpi.label} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm" style={{
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `all 1s ${smooth}`,
                transitionDelay: `${i * 120}ms`,
              }}>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold">{kpi.label}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{phase >= 1 ? kpi.value : '—'}</p>
                <p className="text-[10px] sm:text-xs text-emerald-500 font-semibold">{kpi.trend} vs last month</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-700 mb-4">Revenue Trend</p>
              <div className="flex items-end gap-1.5 h-24 sm:h-32">
                {chartHeights.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400" style={{
                    height: phase >= 2 ? `${h}%` : '2%',
                    transition: `height 1.2s ${smooth}`,
                    transitionDelay: `${i * 80}ms`,
                  }} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-700 mb-4">Pipeline</p>
              {['New Leads', 'Quoted', 'Booked', 'In Progress'].map((stage, i) => (
                <div key={stage} className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] sm:text-xs text-gray-500 w-16 sm:w-20 shrink-0">{stage}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{
                      width: phase >= 3 ? `${pipelineWidths[i]}%` : '0%',
                      transition: `width 1.4s ${smooth}`,
                      transitionDelay: `${i * 200}ms`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Pipeline Tab Content
  const PipelineContent = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
      const t1 = setTimeout(() => setPhase(1), 300);
      const t2 = setTimeout(() => setPhase(2), 1500);
      const t3 = setTimeout(() => setPhase(3), 2700);
      const t4 = setTimeout(() => setPhase(4), 3900);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, []);

    const stages = ['New Leads', 'Quoted', 'Booked', 'In Progress'];
    const colors = ['border-blue-500 bg-blue-50', 'border-purple-500 bg-purple-50', 'border-emerald-500 bg-emerald-50', 'border-amber-500 bg-amber-50'];
    const customers = [
      { name: 'Patel Kitchen Reno', value: '$12,400' },
      { name: 'Chen HVAC Install', value: '$6,200' },
      { name: 'Rodriguez Bath', value: '$4,800' },
      { name: 'Smith Plumbing', value: '$3,100' },
      { name: 'Lee Electrical', value: '$8,900' },
    ];

    // Card assignments per phase: [stageIdx, customerIdx][]
    const layout: { [key: number]: number[][] } = {
      0: [[0,0],[0,1],[0,2],[0,3],[0,4]],
      1: [[0,0],[0,1],[0,2],[0,3],[1,4]],
      2: [[0,0],[0,1],[0,2],[2,3],[1,4]],
      3: [[0,0],[0,1],[3,2],[2,3],[1,4]],
      4: [[0,0],[3,1],[3,2],[2,3],[1,4]],
    };

    const currentLayout = layout[phase] || layout[0];

    return (
      <div className="w-full">
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {stages.map((stage, stageIdx) => {
              const cardsHere = currentLayout.filter(([s]) => s === stageIdx).map(([, c]) => c);
              return (
                <div key={stage} className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-gray-200 min-h-[200px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${stageIdx === 0 ? 'bg-blue-500' : stageIdx === 1 ? 'bg-purple-500' : stageIdx === 2 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase">{stage}</p>
                    <span className="ml-auto text-[10px] text-gray-400 font-semibold">{cardsHere.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {cardsHere.map((cIdx) => (
                      <div
                        key={`card-${cIdx}`}
                        className={`bg-white rounded-lg p-3 border-l-4 shadow-sm ${colors[stageIdx]}`}
                        style={{
                          opacity: 1,
                          transform: 'translateY(0) rotate(0deg)',
                          transition: `all 0.9s ${smooth}`,
                        }}
                      >
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">{customers[cIdx].name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{customers[cIdx].value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── Estimates Tab Content
  const EstimatesContent = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
      const t1 = setTimeout(() => setPhase(1), 200);   // Cards appear
      const t2 = setTimeout(() => setPhase(2), 1000);  // Prices + features reveal
      const t3 = setTimeout(() => setPhase(3), 2000);  // Badge glow
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, []);

    const tiers = [
      { tier: 'Good', price: '$800', features: ['Bathroom Fixture Replacement', 'Caulking & Sealant', 'Basic Tile Work'], badge: null },
      { tier: 'Better', price: '$1,200', features: ['Everything in Good', 'Tile Removal & Prep', 'Grout Installation', 'Full Renovations'], badge: 'Recommended' },
      { tier: 'Best', price: '$1,800', features: ['Everything in Better', 'Premium Fixtures', 'Heated Floors', 'Custom Lighting'], badge: null },
    ];

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {tiers.map((t, i) => (
            <div
              key={t.tier}
              className={`rounded-2xl p-5 sm:p-6 border-2 ${
                t.badge
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 ring-2 ring-blue-500/30 shadow-xl shadow-blue-500/10'
                  : 'bg-white border-gray-200 shadow-lg'
              }`}
              style={{
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.92)',
                transition: `all 1s ${smooth}`,
                transitionDelay: `${i * 150}ms`,
              }}
            >
              {t.badge && (
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold mb-4" style={{
                  opacity: phase >= 3 ? 1 : 0.7,
                  boxShadow: phase >= 3 ? '0 0 20px rgba(59,130,246,0.5)' : 'none',
                  transition: `all 1.5s ${smooth}`,
                }}>
                  {t.badge}
                </div>
              )}
              <p className="font-semibold text-gray-900 text-base sm:text-lg">{t.tier}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2 mb-5" style={{
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
                transition: `all 0.8s ${smooth}`,
                transitionDelay: `${i * 100 + 100}ms`,
              }}>
                {t.price}
              </p>
              <ul className="space-y-2.5">
                {t.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700" style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? 'translateX(0)' : 'translateX(-12px)',
                    transition: `all 0.8s ${smooth}`,
                    transitionDelay: `${i * 100 + idx * 80 + 200}ms`,
                  }}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Growth Advisor Tab Content
  const AdvisorContent = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
      const delays = [600, 2200, 3400, 4200, 5600, 7000];
      const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
      return () => timers.forEach(clearTimeout);
    }, []);

    const Dots = () => (
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-400" style={{
              animation: 'pulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 200}ms`,
            }} />
          ))}
        </div>
      </div>
    );

    const Bubble = ({ advisor, text, show }: { advisor: boolean; text: string; show: boolean }) => (
      <div className={`flex gap-3 ${advisor ? '' : 'justify-end'}`} style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : `translateY(16px)`,
        transition: `all 0.8s ${smooth}`,
      }}>
        {advisor && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">
            AI
          </div>
        )}
        <div className={`rounded-2xl px-4 py-2.5 max-w-sm ${advisor ? 'bg-gray-100 rounded-tl-sm' : 'bg-blue-500 text-white rounded-tr-sm shadow-md shadow-blue-500/20'}`}>
          <p className={`text-sm leading-relaxed ${advisor ? 'text-gray-900' : 'text-white'}`}>{text}</p>
        </div>
        {!advisor && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold">
            M
          </div>
        )}
      </div>
    );

    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-200 shadow-lg">
          <div className="space-y-4 min-h-[280px]">
            {phase >= 1 ? (
              <Bubble advisor text="Morning Mike 👋 You closed 8 jobs this month for $34,200. Up 18% from last month." show={phase >= 1} />
            ) : (
              <div className="flex gap-3"><div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div><Dots /></div>
            )}

            {phase >= 2 ? (
              <Bubble advisor text="3 estimates over $5K are going stale. That's $23K sitting on the table." show={phase >= 2} />
            ) : phase >= 1 ? (
              <div className="flex gap-3" style={{ opacity: 1, transition: `opacity 0.6s ${smooth}` }}><div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div><Dots /></div>
            ) : null}

            {phase >= 3 && <Bubble advisor={false} text="Which ones?" show={phase >= 3} />}

            {phase >= 4 ? (
              <Bubble advisor text="Patel kitchen reno ($12K), Chen HVAC ($6.2K), Rodriguez bathroom ($4.8K). Want me to follow up?" show={phase >= 4} />
            ) : phase >= 3 ? (
              <div className="flex gap-3" style={{ opacity: 1, transition: `opacity 0.6s ${smooth}` }}><div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div><Dots /></div>
            ) : null}

            {phase >= 5 && <Bubble advisor={false} text="Yes, follow up today" show={phase >= 5} />}

            {phase >= 6 && (
              <div className="flex gap-3" style={{ opacity: phase >= 6 ? 1 : 0, transform: phase >= 6 ? 'translateY(0)' : 'translateY(16px)', transition: `all 0.8s ${smooth}` }}>
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/30">AI</div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm">
                  <p className="text-sm text-emerald-800 font-medium">✓ Done. Follow-up emails sent to all 3 customers with personalized quotes attached.</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
            <input type="text" placeholder="Ask anything about your business..." className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm text-gray-900 placeholder-gray-400 border border-gray-200 cursor-default" />
            <button className="p-2.5 bg-blue-500 text-white rounded-full shadow-md shadow-blue-500/20">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Autopilot Tab Content
  const AutopilotContent = () => {
    const [phase, setPhase] = useState(0);
    const [toggles, setToggles] = useState([false, false, false, false, false, false]);

    const automations = [
      { name: 'Speed to Lead', status: 'Responds in 60 seconds', sent: '247 sent' },
      { name: 'Estimate Follow-Up', status: 'Days 1, 3, 7', sent: '1,204 sent' },
      { name: '5-Star Reviews', status: 'Auto-requests after job', sent: '892 sent' },
      { name: 'Payment Reminders', status: 'Days 3, 7, 14', sent: '541 sent' },
      { name: 'Reactivation', status: '60-day dormant customers', sent: '365 sent' },
      { name: 'Seasonal Campaigns', status: 'Fall furnace tune-ups', sent: '128 sent' },
    ];

    useEffect(() => {
      // Stagger row reveals
      automations.forEach((_, i) => {
        setTimeout(() => setPhase(i + 1), 200 + i * 250);
        setTimeout(() => setToggles(prev => { const n = [...prev]; n[i] = true; return n; }), 600 + i * 250);
      });
    }, []);

    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg space-y-3">
          {automations.map((auto, i) => (
            <div
              key={auto.name}
              className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl border border-gray-100"
              style={{
                opacity: phase > i ? 1 : 0,
                transform: phase > i ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.8s ${smooth}`,
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{auto.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{auto.status}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className={`relative w-11 h-6 rounded-full cursor-pointer ${toggles[i] ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-gray-300'}`}
                  style={{ transition: `all 0.6s ${smooth}` }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    style={{
                      left: toggles[i] ? 'calc(100% - 22px)' : '2px',
                      transition: `left 0.5s ${smooth}`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-20 text-right" style={{
                  color: toggles[i] ? '#059669' : '#9ca3af',
                  transition: `color 0.6s ${smooth}`,
                }}>
                  {toggles[i] ? auto.sent : 'Paused'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── Invoicing Tab Content
  const InvoicingContent = () => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
      const t1 = setTimeout(() => setPhase(1), 200);   // Header
      const t2 = setTimeout(() => setPhase(2), 700);   // Line items
      const t3 = setTimeout(() => setPhase(3), 1800);  // Totals
      const t4 = setTimeout(() => setPhase(4), 2600);  // Progress bar
      const t5 = setTimeout(() => setPhase(5), 3200);  // Buttons
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }, []);

    const items = [
      { desc: 'Bathroom Reno Labour', amount: '$2,400.00' },
      { desc: 'Materials & Fixtures', amount: '$1,800.00' },
      { desc: 'Permits & Inspection', amount: '$300.00' },
    ];

    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-gray-200" style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(-15px)',
            transition: `all 0.8s ${smooth}`,
          }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Invoice</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">INV-2026-047</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Patel Residence</p>
                <p className="text-xs text-gray-500 mt-1">123 Oak Street, Toronto ON</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50" style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? 'translateY(0)' : 'translateY(-8px)',
                    transition: `all 0.7s ${smooth}`,
                    transitionDelay: `${i * 150}ms`,
                  }}>
                    <td className="py-3 text-gray-900">{item.desc}</td>
                    <td className="text-right text-gray-900 font-medium">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6 pb-6 border-b border-gray-200" style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: `all 0.8s ${smooth}`,
          }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-900">$4,500.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">HST 13% (Ontario)</span>
              <span className="font-semibold text-gray-900">$585.00</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">$5,085.00</span>
            </div>
          </div>

          {/* Payment Progress */}
          <div className="mb-6" style={{
            opacity: phase >= 4 ? 1 : 0,
            transition: `all 0.8s ${smooth}`,
          }}>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500 font-semibold">Payment Progress</p>
              <p className="text-xs text-gray-500">$3,051.00 of $5,085.00</p>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{
                width: phase >= 4 ? '60%' : '0%',
                transition: `width 1.6s ${smooth}`,
              }} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3" style={{
            opacity: phase >= 5 ? 1 : 0,
            transform: phase >= 5 ? 'translateY(0)' : 'translateY(8px)',
            transition: `all 0.8s ${smooth}`,
          }}>
            <button className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20">
              Send Reminder
            </button>
            <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-semibold">
              Record Payment
            </button>
          </div>
        </div>

        <style>{`
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
          }
        `}</style>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent key="dashboard" />;
      case 'pipeline':
        return <PipelineContent key="pipeline" />;
      case 'estimates':
        return <EstimatesContent key="estimates" />;
      case 'advisor':
        return <AdvisorContent key="advisor" />;
      case 'autopilot':
        return <AutopilotContent key="autopilot" />;
      case 'invoicing':
        return <InvoicingContent key="invoicing" />;
      default:
        return <DashboardContent key="dashboard" />;
    }
  };

  const parallaxOffset = useParallax(0.08);

  return (
    <section className="relative bg-slate-950 py-0 overflow-hidden">
      {/* Parallax background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Section header with description */}
      <div className="relative text-center pt-24 sm:pt-32 pb-6 px-6">
        <h2
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight"
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        >
          Take a closer look.
        </h2>
        {/* Description below heading — not overlapping content */}
        <div
          className="mt-4 max-w-xl mx-auto transition-all duration-500"
          key={`info-${activeTab}`}
        >
          <p className="text-lg sm:text-xl font-semibold text-white">{tabInfo[activeTab].title}</p>
          <p className="text-sm sm:text-base text-slate-400 mt-2">{tabInfo[activeTab].description}</p>
        </div>
      </div>

      {/* Tab navigation — horizontal, centered */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-4 justify-start sm:justify-center scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full-width visual area — large */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
        <div
          className="relative bg-slate-900/60 rounded-2xl sm:rounded-3xl border border-slate-700/50 overflow-hidden backdrop-blur-sm"
          style={{
            minHeight: '520px',
            transform: `translateY(${parallaxOffset * 0.15}px)`,
          }}
        >
          {/* Product view area — centered, full width */}
          <div className="flex items-center justify-center w-full p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-5xl transition-opacity duration-300" key={activeTab}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────
function Features() {
  const handleTiltMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--rx', `${-y * 8}deg`);
    e.currentTarget.style.setProperty('--ry', `${x * 8}deg`);
  };

  const handleTiltMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

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
            <div
              key={feature.title}
              className="scroll-fade-up tilt-card group relative p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 hover:-translate-y-1"
              onMouseMove={handleTiltMouseMove}
              onMouseLeave={handleTiltMouseLeave}
            >
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
            <div key={p.name} className="scroll-fade-up group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-b-2xl">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 progress-fill" style={{ width: '75%', animation: 'fillWidth 3s ease-in-out infinite' }} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold text-white ${p.color}`}>{p.category}</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-ring" />
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

// ─── Star Fill Component ──────────────────────────────────────
function AnimatedStars() {
  const [fillIndex, setFillIndex] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && fillIndex === -1) {
          let index = 0;
          const interval = setInterval(() => {
            if (index < 5) {
              setFillIndex(index);
              index++;
            } else {
              clearInterval(interval);
            }
          }, 100);
        }
      },
      { threshold: 0.1 }
    );
    const el = document.getElementById(`stars-${fillIndex}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [fillIndex]);

  return (
    <div className="flex items-center gap-1 mb-4" id={`stars-${fillIndex}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-all duration-300 ${
            i <= fillIndex ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
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
              <AnimatedStars />
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
              <AnimatedStars />
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
            <span className="gradient-text-shimmer bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
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
            <div key={plan.name} className={`scroll-fade-up relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${plan.highlighted ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/25 md:scale-105 shimmer-border" : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg"}`}>
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
    <section className="py-24 lg:py-32 gradient-mesh relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90" />
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
      <InteractiveExplorer />
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
