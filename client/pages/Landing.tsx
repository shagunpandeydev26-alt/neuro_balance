import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  AnimatedCounter,
  RadialScore,
  ParticleField,
  MagneticButton,
  Aurora,
} from "@/components/motion";
import {
  Brain,
  Activity,
  ShieldCheck,
  Recycle,
  Wallet,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Zap,
  Coins,
  Check,
  TrendingUp,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

const trend = [
  { v: 45 },
  { v: 52 },
  { v: 49 },
  { v: 61 },
  { v: 58 },
  { v: 70 },
  { v: 74 },
  { v: 81 },
];

const steps = [
  {
    icon: Activity,
    title: "Measure",
    tint: "text-wellness-300",
    ring: "from-wellness-500/40",
    body: "A seven-factor wellness assessment computes your Mental Footprint Index with explainable, SHAP-style drivers.",
    points: ["Sleep, mood & workload", "Live 0–100 score", "Burnout risk signals"],
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    tint: "text-secondary",
    ring: "from-secondary/40",
    body: "Recovery activities are written to an on-chain registry — immutable, transparent, and tamper-resistant.",
    points: ["Timestamped records", "Smart-contract proofs", "You own your history"],
  },
  {
    icon: Recycle,
    title: "Offset",
    tint: "text-growth-300",
    ring: "from-growth-500/40",
    body: "Verified recovery mints Stress Offset Credits you can retire, trade, or redeem for wellness rewards.",
    points: ["Earn SOC rewards", "Retire to offset stress", "Redeem in marketplace"],
  },
];

const flow = [
  { icon: Wallet, label: "Connect Wallet", sub: "0x7a…f3b" },
  { icon: Activity, label: "Log Recovery", sub: "Meditation · 10m" },
  { icon: ShieldCheck, label: "Verify On-Chain", sub: "RecoveryRegistry" },
  { icon: Coins, label: "Mint SOC", sub: "+20 credits" },
];

const txns = [
  { who: "0x7a3f…b21c", what: "Therapy verified", soc: "+50", t: "2m" },
  { who: "0x19de…88af", what: "Digital detox", soc: "+25", t: "11m" },
  { who: "0xc40b…7d12", what: "SOC retired", soc: "-120", t: "26m" },
  { who: "0x55a1…0e9f", what: "Exercise verified", soc: "+30", t: "41m" },
];

const testimonials = [
  {
    quote:
      "NeuroBalance turned 'I should take care of myself' into something I can actually measure and prove. The MFI is weirdly motivating.",
    name: "Ava Mendes",
    role: "Product Designer",
  },
  {
    quote:
      "We rolled it out to our team and finally have privacy-safe wellness signals — without ever touching anyone's personal data.",
    name: "Daniel Okoro",
    role: "Head of People",
  },
  {
    quote:
      "The on-chain verification is the part that sold our CFO. Recovery you can audit. It feels like the future of corporate wellness.",
    name: "Priya Nair",
    role: "Operations Lead",
  },
  {
    quote:
      "It's the first wellness app that doesn't feel like a chore. Earning SOC for a walk is genuinely delightful.",
    name: "Marco Bianchi",
    role: "Software Engineer",
  },
];

function StatChip({
  value,
  label,
  suffix,
  className,
}: {
  value: number;
  label: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`glass rounded-2xl px-5 py-4 ${className ?? ""}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="text-2xl font-bold font-display text-foreground">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </motion.div>
  );
}

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <Layout showSidebar={false}>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <Aurora />
        <ParticleField className="absolute inset-0 h-full w-full opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-24 w-full">
          <div className="text-center space-y-7 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              The Carbon Credit System for the Human Mind
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="text-5xl md:text-7xl font-bold font-display tracking-tight leading-[1.05]"
            >
              <span className="text-gradient">Measure. Heal. Offset.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Track your Mental Footprint. Verify recovery on-chain. Build
              psychological sustainability you can actually prove.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            >
              <MagneticButton
                onClick={() => setShowAuthModal(true)}
                className="group inline-flex items-center gap-2 bg-wellness-500 hover:bg-wellness-400 text-white px-7 py-3.5 rounded-xl font-medium glow-primary transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <button
                onClick={() => scrollTo("how")}
                className="inline-flex items-center gap-2 glass-strong hover:bg-white/5 text-foreground px-7 py-3.5 rounded-xl font-medium transition-colors"
              >
                Explore Platform
              </button>
            </motion.div>
          </div>

          {/* Floating stat chips */}
          <div className="hidden md:flex justify-between mt-20 px-6">
            <StatChip value={100} suffix="K+" label="Active minds" />
            <StatChip value={50} suffix="M+" label="SOC issued" className="mt-10" />
            <StatChip value={2.5} suffix="M+" label="Activities verified" />
            <StatChip value={150} suffix="+" label="Live proposals" className="mt-10" />
          </div>
        </div>

        <button
          onClick={() => scrollTo("mfi")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Scroll down"
        >
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="block"
          >
            <ChevronDown className="h-7 w-7" />
          </motion.span>
        </button>
      </section>

      {/* ──────────────── Mental Footprint Visualization ──────────────── */}
      <section id="mfi" className="relative py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-display">
                Your mind, quantified
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The Mental Footprint Index distills sleep, mood, workload,
                activity and recovery into a single living score — like a credit
                score for psychological sustainability.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { label: "Avg MFI lift", value: 23, suffix: "%" },
                  { label: "Day streaks", value: 14, suffix: "" },
                  { label: "Factors tracked", value: 7, suffix: "" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-4">
                    <div className="text-2xl font-bold font-display text-gradient">
                      <AnimatedCounter value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative glass-strong ring-gradient rounded-3xl p-8 flex flex-col items-center">
              <RadialScore value={81} />
              <div className="w-full mt-6 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="mfiArea" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(243 82% 63%)"
                          stopOpacity={0.5}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(243 82% 63%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="hsl(187 92% 56%)"
                      strokeWidth={2}
                      fill="url(#mfiArea)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 text-sm text-growth-300 mt-2">
                <TrendingUp className="h-4 w-4" />
                +36 points over 8 weeks
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── How It Works ───────────────────── */}
      <section id="how" className="relative py-24 px-4 md:px-6 bg-grid">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              How NeuroBalance works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three steps from feeling to verifiable, rewarded progress.
            </p>
          </Reveal>

          <div className="relative">
            {/* connecting line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-wellness-500/0 via-secondary/40 to-growth-500/0" />
            <RevealGroup className="grid md:grid-cols-3 gap-6">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <RevealItem key={s.title}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`group relative h-full glass rounded-2xl p-7 bg-gradient-to-b ${s.ring} to-transparent`}
                    >
                      <div className="h-14 w-14 rounded-xl glass-strong flex items-center justify-center mb-5">
                        <Icon className={`h-7 w-7 ${s.tint}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                      <p className="text-muted-foreground mb-5">{s.body}</p>
                      <ul className="space-y-2">
                        {s.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-center gap-2 text-sm text-foreground/80"
                          >
                            <Check className={`h-4 w-4 ${s.tint}`} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ─────────────── Blockchain Verification Flow ─────────────── */}
      <section className="relative py-24 px-4 md:px-6 overflow-hidden">
        <Aurora className="opacity-60" />
        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-secondary mb-4">
              <ShieldCheck className="h-4 w-4" />
              On-chain verification
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
              Recovery you can prove
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every verified activity flows through smart contracts to mint
              Stress Offset Credits — auditable, owned by you.
            </p>
          </Reveal>

          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-2 items-stretch">
            {flow.map((node, i) => {
              const Icon = node.icon;
              return (
                <RevealItem key={node.label} className="relative">
                  <div className="glass rounded-2xl p-6 text-center h-full">
                    <div className="mx-auto h-14 w-14 rounded-full glass-strong flex items-center justify-center mb-4 relative">
                      <Icon className="h-6 w-6 text-secondary" />
                      <span className="absolute inset-0 rounded-full ring-1 ring-secondary/40 animate-glow-pulse" />
                    </div>
                    <p className="font-medium text-sm">{node.label}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {node.sub}
                    </p>
                  </div>
                  {i < flow.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-1 z-10 -translate-y-1/2 text-secondary/60">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* ─────────────────── Marketplace Showcase ─────────────────── */}
      <section className="relative py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-6">
          <Reveal className="lg:col-span-2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              A living Stress Offset economy
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Watch credits flow as the community heals. Earn, retire, and
              redeem SOC in a transparent marketplace.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-5">
                <Zap className="h-5 w-5 text-growth-300 mb-2" />
                <div className="text-2xl font-bold font-display">
                  <AnimatedCounter value={50} suffix="M+" />
                </div>
                <div className="text-xs text-muted-foreground">SOC in circulation</div>
              </div>
              <div className="glass rounded-xl p-5">
                <Coins className="h-5 w-5 text-secondary mb-2" />
                <div className="text-2xl font-bold font-display">
                  <AnimatedCounter value={12400} />
                </div>
                <div className="text-xs text-muted-foreground">Daily transactions</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="glass-strong ring-gradient rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Live activity</p>
                <span className="flex items-center gap-2 text-xs text-growth-300">
                  <span className="h-2 w-2 rounded-full bg-growth-400 animate-pulse" />
                  Streaming
                </span>
              </div>
              <div className="space-y-1">
                {txns.map((t, i) => (
                  <motion.div
                    key={t.who}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-wellness-900 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-wellness-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.what}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {t.who}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        t.soc.startsWith("+")
                          ? "text-growth-300"
                          : "text-secondary"
                      }`}
                    >
                      {t.soc} SOC
                    </span>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {t.t}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Testimonials ───────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <Reveal className="text-center mb-14 px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">
            Loved by people who measure what matters
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-7 w-[340px] shrink-0 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-1 mb-4 text-secondary">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Sparkles key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-5">
                  “{t.quote}”
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-wellness-500 to-secondary flex items-center justify-center text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="relative py-24 px-4 md:px-6">
        <Reveal>
          <div className="relative max-w-4xl mx-auto glass-strong ring-gradient rounded-3xl p-12 text-center overflow-hidden">
            <Aurora className="opacity-70" />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                Start building a healthier mind
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Measure your Mental Footprint, verify your recovery, and turn
                well-being into measurable value.
              </p>
              <MagneticButton
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 bg-wellness-500 hover:bg-wellness-400 text-white px-8 py-4 rounded-xl font-medium glow-primary transition-colors"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-border px-4 md:px-6 py-14">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              className="bg-gradient-to-br from-wellness-500 to-secondary rounded-lg p-2"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-display font-bold text-lg">NeuroBalance</span>
          </div>
          <p className="text-sm text-muted-foreground order-last md:order-none">
            © {new Date().getFullYear()} NeuroBalance · Measure. Heal. Offset.
          </p>
          <div className="flex items-center gap-3">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </Layout>
  );
}
