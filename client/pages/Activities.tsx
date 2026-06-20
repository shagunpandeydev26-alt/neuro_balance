import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNeuro } from "@/lib/neuro-store";
import {
  ACTIVITY_DEFINITIONS,
  ACTIVITY_TYPES,
  BADGE_DEFINITIONS,
  type ActivityType,
} from "@shared/wellness";
import { shortHash, explorerTxUrl } from "@/lib/chain";
import { Loader2, ShieldCheck, ExternalLink, Plus, Minus } from "lucide-react";

const ACTIVITY_EMBLEM: Record<ActivityType, string> = {
  meditation: "🧘",
  exercise: "🏃",
  therapy: "💬",
  digital_detox: "📵",
  wellness_challenge: "🏆",
};

export default function Activities() {
  const { user } = useAuth();
  const { activities, logActivity } = useNeuro();

  const [type, setType] = useState<ActivityType>("meditation");
  const [minutes, setMinutes] = useState(
    ACTIVITY_DEFINITIONS.meditation.defaultMinutes,
  );
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectType = (t: ActivityType) => {
    setType(t);
    setMinutes(ACTIVITY_DEFINITIONS[t].defaultMinutes);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { reward, newBadges } = await logActivity(type, minutes, note);
      toast.success(`${ACTIVITY_DEFINITIONS[type].label} verified`, {
        description: `+${reward} SOC · recorded on RecoveryRegistry`,
      });
      newBadges.forEach((id) =>
        toast(`Badge unlocked: ${BADGE_DEFINITIONS[id].name}`, {
          description: BADGE_DEFINITIONS[id].description,
          icon: BADGE_DEFINITIONS[id].emblem,
        }),
      );
      setNote("");
    } catch (err) {
      toast.error("Verification failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sorted = [...activities].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Recovery Activities
          </h1>
          <p className="text-muted-foreground">
            Log and verify recovery activities. Each is written to the
            RecoveryRegistry as an immutable, tamper-resistant record and earns
            Stress Offset Credits.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Log form */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 shadow-sm space-y-6 h-fit">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Activity type
              </p>
              <div className="grid grid-cols-1 gap-2">
                {ACTIVITY_TYPES.map((t) => {
                  const def = ACTIVITY_DEFINITIONS[t];
                  const active = t === type;
                  return (
                    <button
                      key={t}
                      onClick={() => selectType(t)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                        active
                          ? "border-wellness-500 bg-wellness-500/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="text-2xl">{ACTIVITY_EMBLEM[t]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {def.label}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {def.description}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-growth-500 whitespace-nowrap">
                        +{def.reward}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Duration (minutes)
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMinutes((m) => Math.max(5, m - 5))}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center text-lg font-semibold tabular-nums">
                  {minutes}
                </span>
                <button
                  onClick={() => setMinutes((m) => Math.min(240, m + 5))}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Note <span className="text-muted-foreground">(optional)</span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Supporting evidence or how it went…"
                rows={3}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-wellness-500 resize-none"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-wellness-500 hover:bg-wellness-600 text-white h-11 gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying on-chain…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Verify & Record
                </>
              )}
            </Button>
          </div>

          {/* Verified history */}
          <div className="lg:col-span-3 glass rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Verified History
            </h2>
            {sorted.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No verified activities yet.</p>
                <p className="text-sm">Log your first recovery session.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map((a) => {
                  const def = ACTIVITY_DEFINITIONS[a.type];
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border"
                    >
                      <span className="text-2xl">{ACTIVITY_EMBLEM[a.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {def.label} · {a.minutes} min
                        </p>
                        <a
                          href={explorerTxUrl(a.txHash)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-wellness-500 hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          {shortHash(a.txHash)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-growth-500">
                          +{a.reward} SOC
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(a.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
