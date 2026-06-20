import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/auth-context";
import { useNeuro } from "@/lib/neuro-store";
import { BADGE_DEFINITIONS } from "@shared/wellness";
import {
  computeMFI,
  neutralAssessment,
  FACTOR_ORDER,
  FACTOR_LABELS,
  type AssessmentInput,
  type FactorKey,
} from "@shared/mfi";
import { ArrowRight, Brain, Loader2, ShieldCheck } from "lucide-react";

const FACTOR_HINTS: Record<FactorKey, { low: string; high: string }> = {
  sleepQuality: { low: "Poor / restless", high: "Deep & restful" },
  mood: { low: "Low / down", high: "Positive & bright" },
  workload: { low: "Very light", high: "Overwhelming" },
  physicalActivity: { low: "Sedentary", high: "Very active" },
  screenTime: { low: "Minimal", high: "All day" },
  socialInteraction: { low: "Isolated", high: "Well connected" },
  recoveryHabits: { low: "None", high: "Daily ritual" },
};

function scoreColor(score: number): string {
  if (score >= 75) return "text-growth-400";
  if (score >= 60) return "text-wellness-400";
  if (score >= 45) return "text-amber-500";
  return "text-destructive";
}

export default function Assessment() {
  const { user } = useAuth();
  const { submitAssessment } = useNeuro();
  const navigate = useNavigate();

  const [input, setInput] = useState<AssessmentInput>(neutralAssessment());
  const [submitting, setSubmitting] = useState(false);

  const preview = useMemo(() => computeMFI(input), [input]);

  const setFactor = (key: FactorKey, value: number) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { result, reward, newBadges } = await submitAssessment(input);
      toast.success(`MFI recorded: ${result.score}/100`, {
        description: `+${reward} SOC earned · verified on-chain`,
      });
      newBadges.forEach((id) =>
        toast(`Badge unlocked: ${BADGE_DEFINITIONS[id].name}`, {
          description: BADGE_DEFINITIONS[id].description,
          icon: BADGE_DEFINITIONS[id].emblem,
        }),
      );
      navigate("/dashboard");
    } catch (err) {
      toast.error("Could not record assessment", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Wellness Assessment
          </h1>
          <p className="text-muted-foreground">
            Rate how you've been over the last few days. Your Mental Footprint
            Index is calculated live and recorded on-chain when you submit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sliders */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
            {FACTOR_ORDER.map((key) => {
              const hint = FACTOR_HINTS[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium text-foreground">
                      {FACTOR_LABELS[key]}
                    </label>
                    <span className="text-sm font-semibold text-wellness-500 tabular-nums">
                      {input[key]}/10
                    </span>
                  </div>
                  <Slider
                    value={[input[key]]}
                    min={0}
                    max={10}
                    step={1}
                    onValueChange={([v]) => setFactor(key, v)}
                    aria-label={FACTOR_LABELS[key]}
                  />
                  <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                    <span>{hint.low}</span>
                    <span>{hint.high}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live preview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-wellness-900 to-wellness-800 border border-wellness-700 rounded-2xl p-6 shadow-md text-center">
              <div className="flex items-center justify-center gap-2 text-wellness-400 mb-3">
                <Brain className="h-5 w-5" />
                <span className="text-sm font-medium">Live MFI Preview</span>
              </div>
              <div
                className={`text-6xl font-bold ${scoreColor(preview.score)}`}
              >
                {preview.score}
              </div>
              <p className="text-sm text-wellness-300 mt-1">{preview.band}</p>
              <div className="h-2 bg-wellness-700 rounded-full overflow-hidden mt-4">
                <div
                  className="h-full bg-gradient-to-r from-wellness-500 to-growth-400 rounded-full transition-all"
                  style={{ width: `${preview.score}%` }}
                />
              </div>
            </div>

            {preview.topRisks.length > 0 && (
              <div className="glass rounded-2xl p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground mb-3">
                  What's dragging you down
                </p>
                <ul className="space-y-2">
                  {preview.topRisks.map((c) => (
                    <li
                      key={c.key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{c.label}</span>
                      <span className="text-destructive font-medium tabular-nums">
                        {c.impact.toFixed(1)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-wellness-500 hover:bg-wellness-600 text-white h-12 gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Recording on-chain…
                </>
              ) : (
                <>
                  Submit & Record
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            <p className="flex items-center gap-1.5 justify-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Tamper-resistant record · earns SOC
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
