import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNeuro, type LedgerKind } from "@/lib/neuro-store";
import { BADGE_DEFINITIONS } from "@shared/wellness";
import { shortHash, explorerTxUrl } from "@/lib/chain";
import {
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  Recycle,
  ExternalLink,
  Loader2,
} from "lucide-react";

const KIND_META: Record<
  LedgerKind,
  { label: string; icon: typeof Zap; color: string; sign: string }
> = {
  earn: {
    label: "Earned",
    icon: ArrowDownLeft,
    color: "text-growth-500",
    sign: "+",
  },
  spend: {
    label: "Spent",
    icon: ArrowUpRight,
    color: "text-destructive",
    sign: "-",
  },
  retire: {
    label: "Retired",
    icon: Recycle,
    color: "text-wellness-500",
    sign: "-",
  },
};

export default function Tokens() {
  const { user } = useAuth();
  const { ledger, stats, offsetStress } = useNeuro();
  const [amount, setAmount] = useState(50);
  const [busy, setBusy] = useState(false);

  const sorted = [...ledger].sort((a, b) => b.timestamp - a.timestamp);

  const handleOffset = async () => {
    setBusy(true);
    try {
      const before = stats.totalRetired;
      await offsetStress(amount);
      toast.success(`Retired ${amount} SOC`, {
        description: "Your stress offset is recorded on-chain.",
      });
      if (before === 0) {
        toast(`Badge unlocked: ${BADGE_DEFINITIONS.offsetter.name}`, {
          description: BADGE_DEFINITIONS.offsetter.description,
          icon: BADGE_DEFINITIONS.offsetter.emblem,
        });
      }
    } catch (err) {
      toast.error("Offset failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Stress Offset Credits
          </h1>
          <p className="text-muted-foreground">
            Earn SOC for verified wellness actions, then retire them to offset
            stress.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-growth-900 to-growth-800 border border-growth-700 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-growth-400">Balance</p>
              <Zap className="h-5 w-5 text-growth-400" />
            </div>
            <p className="text-4xl font-bold text-growth-300">
              {stats.balance}
            </p>
            <p className="text-sm text-growth-400 mt-1">SOC available</p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Lifetime earned
            </p>
            <p className="text-4xl font-bold text-foreground">
              {stats.totalEarned}
            </p>
            <p className="text-sm text-muted-foreground mt-1">SOC</p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Stress offset
            </p>
            <p className="text-4xl font-bold text-foreground">
              {stats.totalRetired}
            </p>
            <p className="text-sm text-muted-foreground mt-1">SOC retired</p>
          </div>
        </div>

        {/* Offset panel */}
        <div className="glass rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Recycle className="h-5 w-5 text-wellness-500" />
            Offset Stress
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Retiring SOC permanently removes it from circulation as a verifiable
            record of your recovery — like retiring a carbon credit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="number"
              min={1}
              max={stats.balance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full sm:w-40 px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-wellness-500"
            />
            <Button
              onClick={handleOffset}
              disabled={busy || amount <= 0 || amount > stats.balance}
              className="bg-wellness-500 hover:bg-wellness-600 text-white gap-2"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Retiring…
                </>
              ) : (
                <>Retire {amount} SOC</>
              )}
            </Button>
          </div>
        </div>

        {/* Ledger */}
        <div className="glass rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Transaction History
          </h2>
          {sorted.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Zap className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No transactions yet.</p>
              <p className="text-sm">
                Complete an assessment or activity to earn SOC.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.map((e) => {
                const meta = KIND_META[e.kind];
                const Icon = meta.icon;
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {e.reason}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(e.timestamp).toLocaleString()}</span>
                        {e.txHash && (
                          <a
                            href={explorerTxUrl(e.txHash)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-wellness-500 hover:underline inline-flex items-center gap-1 font-mono"
                          >
                            {shortHash(e.txHash)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <span className={`font-semibold ${meta.color} tabular-nums`}>
                      {meta.sign}
                      {e.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
