import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNeuro } from "@/lib/neuro-store";
import { ACTIVITY_DEFINITIONS, BADGE_DEFINITIONS } from "@shared/wellness";
import {
  Reveal,
  RevealGroup,
  RevealItem,
  RadialScore,
  AnimatedCounter,
} from "@/components/motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Zap,
  Gift,
  ClipboardCheck,
  ShieldCheck,
  Flame,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const { assessments, activities, badges, stats } = useNeuro();

  const chartData = useMemo(
    () =>
      [...assessments]
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((a) => ({
          date: new Date(a.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          score: a.score,
        })),
    [assessments],
  );

  const feed = useMemo(() => {
    const items: {
      id: string;
      title: string;
      description: string;
      time: number;
      icon: typeof TrendingUp;
    }[] = [];
    assessments.forEach((a) =>
      items.push({
        id: a.id,
        title: "MFI Recorded",
        description: `Mental Footprint Index ${a.score} (${a.band})`,
        time: a.timestamp,
        icon: TrendingUp,
      }),
    );
    activities.forEach((a) =>
      items.push({
        id: a.id,
        title: "Activity Verified",
        description: `${ACTIVITY_DEFINITIONS[a.type].label} · +${a.reward} SOC`,
        time: a.timestamp,
        icon: ShieldCheck,
      }),
    );
    badges.forEach((b) =>
      items.push({
        id: b.id + b.timestamp,
        title: "Badge Unlocked",
        description: `${BADGE_DEFINITIONS[b.id].emblem} ${BADGE_DEFINITIONS[b.id].name}`,
        time: b.timestamp,
        icon: Gift,
      }),
    );
    return items.sort((a, b) => b.time - a.time).slice(0, 6);
  }, [assessments, activities, badges]);

  const timeAgo = (ts: number) => {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const hasData = stats.assessmentCount > 0;

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "there"}
              </h1>
              <p className="text-muted-foreground">
                Here's your mental wellness summary.
              </p>
            </div>
            <Link to="/assessment">
              <Button className="gap-2 bg-wellness-500 hover:bg-wellness-400 text-white glow-primary">
                <ClipboardCheck className="h-4 w-4" />
                New Assessment
              </Button>
            </Link>
          </div>
        </Reveal>

        {!hasData ? (
          <Reveal>
            <div className="glass-strong ring-gradient rounded-3xl p-12 text-center">
              <div className="h-16 w-16 bg-wellness-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="h-8 w-8 text-wellness-300" />
              </div>
              <h2 className="text-2xl font-bold font-display mb-2">
                Measure your Mental Footprint
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Take your first wellness assessment to generate your MFI, earn
                Stress Offset Credits, and unlock Proof-of-Care badges.
              </p>
              <Link to="/assessment">
                <Button className="bg-wellness-500 hover:bg-wellness-400 text-white gap-2 glow-primary">
                  <ClipboardCheck className="h-4 w-4" />
                  Start Assessment
                </Button>
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <RevealGroup className="grid md:grid-cols-3 gap-6 mb-6">
              {/* MFI radial */}
              <RevealItem className="md:col-span-1">
                <div className="glass-strong ring-gradient rounded-3xl p-8 h-full flex flex-col items-center justify-center">
                  <RadialScore value={stats.latestScore ?? 0} size={200} />
                  <div className="mt-5 flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {stats.riskBand}
                    </span>
                    {stats.scoreTrend !== null && (
                      <span
                        className={`inline-flex items-center gap-1 text-sm font-medium ${
                          stats.scoreTrend >= 0
                            ? "text-growth-300"
                            : "text-destructive"
                        }`}
                      >
                        {stats.scoreTrend >= 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {stats.scoreTrend >= 0 ? "+" : ""}
                        {stats.scoreTrend}
                      </span>
                    )}
                  </div>
                </div>
              </RevealItem>

              {/* Side stat cards */}
              <RevealItem className="md:col-span-2">
                <div className="grid sm:grid-cols-2 gap-6 h-full">
                  <StatCard
                    icon={Zap}
                    iconClass="text-growth-300"
                    label="SOC Balance"
                    value={stats.balance}
                    sub={`${stats.totalEarned} earned lifetime`}
                    to="/tokens"
                    cta="Manage tokens"
                  />
                  <StatCard
                    icon={Gift}
                    iconClass="text-secondary"
                    label="Proof-of-Care"
                    value={stats.badgeCount}
                    sub={`${stats.activityCount} activities verified`}
                    to="/nfts"
                    cta="View gallery"
                  />
                  <StatCard
                    icon={Flame}
                    iconClass="text-amber-400"
                    label="Recovery Streak"
                    value={stats.streak}
                    suffix=" days"
                    sub="Keep the momentum going"
                    to="/activities"
                    cta="Log activity"
                  />
                  <StatCard
                    icon={TrendingUp}
                    iconClass="text-wellness-300"
                    label="Assessments"
                    value={stats.assessmentCount}
                    sub="Total logged"
                    to="/assessment"
                    cta="Reassess"
                  />
                </div>
              </RevealItem>
            </RevealGroup>

            {/* Chart */}
            <Reveal>
              <div className="glass rounded-3xl p-6 md:p-8 mb-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold font-display">MFI Trend</h2>
                  <p className="text-sm text-muted-foreground">
                    Your Mental Footprint Index over time
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="dashLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(243 82% 63%)" />
                        <stop offset="100%" stopColor="hsl(187 92% 56%)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "12px" }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="url(#dashLine)"
                      strokeWidth={3}
                      dot={{ fill: "hsl(187 92% 56%)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Reveal>

            {/* Feed */}
            <Reveal>
              <div className="glass rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold font-display mb-6">
                  Latest Activity
                </h2>
                <div className="space-y-2">
                  {feed.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-wellness-900 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-wellness-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-xs text-muted-foreground">
                          {timeAgo(activity.time)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </Layout>
  );
}

function StatCard({
  icon: Icon,
  iconClass,
  label,
  value,
  suffix,
  sub,
  to,
  cta,
}: {
  icon: typeof Zap;
  iconClass: string;
  label: string;
  value: number;
  suffix?: string;
  sub: string;
  to: string;
  cta: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass rounded-2xl p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="h-10 w-10 rounded-lg glass-strong flex items-center justify-center">
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
      </div>
      <div className="text-3xl font-bold font-display">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <p className="text-xs text-muted-foreground mt-1 flex-1">{sub}</p>
      <Link
        to={to}
        className="text-sm text-wellness-300 hover:text-wellness-200 font-medium mt-4 inline-flex items-center gap-1"
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}
