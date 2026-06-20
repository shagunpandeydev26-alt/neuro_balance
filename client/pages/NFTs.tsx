import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth-context";
import { useNeuro } from "@/lib/neuro-store";
import { BADGE_DEFINITIONS, type BadgeId } from "@shared/wellness";
import { Lock } from "lucide-react";

const TIER_RING: Record<string, string> = {
  bronze: "border-amber-700/50",
  silver: "border-slate-400/50",
  gold: "border-yellow-500/60",
};

const TIER_GLOW: Record<string, string> = {
  bronze: "from-amber-900/40",
  silver: "from-slate-700/40",
  gold: "from-yellow-700/40",
};

export default function NFTs() {
  const { user } = useAuth();
  const { badges } = useNeuro();

  const earnedMap = new Map(badges.map((b) => [b.id, b]));
  const all = Object.values(BADGE_DEFINITIONS);
  const earnedCount = all.filter((b) => earnedMap.has(b.id)).length;

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Proof-of-Care NFTs
          </h1>
          <p className="text-muted-foreground">
            Badges minted to your wallet for wellness milestones. {earnedCount}{" "}
            of {all.length} unlocked.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((badge) => {
            const earned = earnedMap.get(badge.id as BadgeId);
            return (
              <div
                key={badge.id}
                className={`relative rounded-2xl border-2 p-6 shadow-sm transition-all ${
                  earned
                    ? `bg-gradient-to-br ${TIER_GLOW[badge.tier]} to-card ${TIER_RING[badge.tier]}`
                    : "bg-card border-border opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`text-5xl ${earned ? "" : "grayscale opacity-50"}`}
                  >
                    {badge.emblem}
                  </div>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                      badge.tier === "gold"
                        ? "bg-yellow-500/20 text-yellow-600"
                        : badge.tier === "silver"
                          ? "bg-slate-400/20 text-slate-500"
                          : "bg-amber-700/20 text-amber-700"
                    }`}
                  >
                    {badge.tier}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  {badge.name}
                  {!earned && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {badge.description}
                </p>
                {earned && (
                  <p className="text-xs text-growth-500 mt-3 font-medium">
                    Minted {new Date(earned.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
