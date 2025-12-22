import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ArrowUpRight, TrendingUp, Zap, Gift, Wallet } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mfiData = [
  { date: "Jan 1", score: 45 },
  { date: "Jan 8", score: 52 },
  { date: "Jan 15", score: 48 },
  { date: "Jan 22", score: 61 },
  { date: "Jan 29", score: 58 },
  { date: "Feb 5", score: 67 },
  { date: "Feb 12", score: 72 },
];

const activities = [
  {
    id: 1,
    type: "score_update",
    title: "MFI Score Updated",
    description: "Your Mental Fitness Index increased to 72",
    time: "2 hours ago",
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "nft_earned",
    title: "NFT Earned",
    description: "Proof-of-Care NFT: Week 5 Warrior",
    time: "1 day ago",
    icon: Gift,
  },
  {
    id: 3,
    type: "tokens_minted",
    title: "Tokens Minted",
    description: "250 SOT minted for stress offset",
    time: "3 days ago",
    icon: Zap,
  },
];

export default function Dashboard() {
  const { user, connectWallet } = useAuth();

  const mfiScore = 72;
  const mfiTrend = 7;
  const tokenBalance = 1250;
  const nftCount = 12;

  const handleConnectWallet = () => {
    const walletAddress =
      "0x" +
      Math.random().toString(16).slice(2, 14) +
      Math.random().toString(16).slice(2, 14);
    connectWallet(walletAddress);
  };

  return (
    <Layout
      isLoggedIn={true}
      walletAddress={user?.walletAddress}
      showSidebar={true}
    >
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your mental wellness summary.
          </p>
        </div>

        {/* MFI Score Card */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Main MFI Card */}
          <div className="md:col-span-1 bg-gradient-to-br from-wellness-900 to-wellness-800 border border-wellness-700 rounded-2xl p-8 shadow-md">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-wellness-400 mb-2">
                  MFI Score
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-wellness-300">
                    {mfiScore}
                  </span>
                  <span className="text-sm text-wellness-400">/100</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2 bg-wellness-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-wellness-500 to-wellness-400 rounded-full transition-all"
                    style={{ width: `${mfiScore}%` }}
                  ></div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-growth-400" />
                  <span className="text-sm font-medium text-growth-400">
                    +{mfiTrend} this week
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-wellness-700">
                <p className="text-xs font-medium text-wellness-400 mb-3">
                  Risk Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-growth-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">
                    Low
                  </span>
                </div>
              </div>

              <Button className="w-full bg-wellness-600 hover:bg-wellness-700 text-white">
                View Details
              </Button>
            </div>
          </div>

          {/* Token Card */}
          <div className="bg-gradient-to-br from-growth-900 to-growth-800 border border-growth-700 rounded-2xl p-8 shadow-md">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-growth-400 mb-2">
                    SOT Balance
                  </p>
                  <div className="text-3xl font-bold text-growth-300">
                    {tokenBalance}
                  </div>
                </div>
                <div className="h-12 w-12 bg-growth-800 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-growth-400" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-growth-400">
                  Equivalent Value
                </p>
                <p className="text-2xl font-bold text-growth-300">
                  ${(tokenBalance * 0.45).toFixed(2)}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full border-growth-700 text-growth-400 hover:bg-growth-900/50"
              >
                Offset Stress
              </Button>
            </div>
          </div>

          {/* NFT Card */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-2xl p-8 shadow-md">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-400 mb-2">
                    Proof-of-Care NFTs
                  </p>
                  <div className="text-3xl font-bold text-purple-300">
                    {nftCount}
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-800 rounded-lg flex items-center justify-center">
                  <Gift className="h-6 w-6 text-purple-400" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-purple-400">
                  Latest Achievement
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Week 5 Warrior
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full border-purple-700 text-purple-400 hover:bg-purple-900/50"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              MFI Trend
            </h2>
            <p className="text-sm text-muted-foreground">
              Your Mental Fitness Index over the last 6 weeks
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mfiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                style={{ fontSize: "12px" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--wellness-500))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--wellness-500))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Feed */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Latest Activity
          </h2>

          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-wellness-900 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-wellness-400" />
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
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
