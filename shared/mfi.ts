/**
 * Mental Footprint Index (MFI) engine.
 *
 * Pure, dependency-free scoring logic shared between client and server.
 * Takes a wellness assessment (each factor on a 0-10 scale) and produces an
 * MFI score from 0-100 along with an explainable, SHAP-style breakdown of
 * which factors drove the score up or down.
 */

export interface AssessmentInput {
  /** Quality / restfulness of sleep. Higher is better. */
  sleepQuality: number;
  /** Overall mood. Higher is better. */
  mood: number;
  /** Perceived workload / pressure. Higher means MORE load (worse). */
  workload: number;
  /** Amount of physical activity / exercise. Higher is better. */
  physicalActivity: number;
  /** Daily screen time. Higher means MORE screen time (worse). */
  screenTime: number;
  /** Quality of social interaction. Higher is better. */
  socialInteraction: number;
  /** Consistency of recovery habits (meditation, breaks, journaling). Higher is better. */
  recoveryHabits: number;
}

export type FactorKey = keyof AssessmentInput;

/** Factors where a HIGHER raw value reduces wellness (load factors). */
const NEGATIVE_FACTORS: ReadonlySet<FactorKey> = new Set([
  "workload",
  "screenTime",
]);

/** Relative weight of each factor. Weights sum to 1. */
export const FACTOR_WEIGHTS: Record<FactorKey, number> = {
  sleepQuality: 0.2,
  mood: 0.2,
  workload: 0.15,
  physicalActivity: 0.15,
  screenTime: 0.1,
  socialInteraction: 0.1,
  recoveryHabits: 0.1,
};

export const FACTOR_LABELS: Record<FactorKey, string> = {
  sleepQuality: "Sleep Quality",
  mood: "Mood",
  workload: "Workload",
  physicalActivity: "Physical Activity",
  screenTime: "Screen Time",
  socialInteraction: "Social Interaction",
  recoveryHabits: "Recovery Habits",
};

export const FACTOR_ORDER: FactorKey[] = [
  "sleepQuality",
  "mood",
  "workload",
  "physicalActivity",
  "screenTime",
  "socialInteraction",
  "recoveryHabits",
];

export type RiskLevel = "low" | "moderate" | "high";

export interface FactorContribution {
  key: FactorKey;
  label: string;
  /** Raw 0-10 input value. */
  value: number;
  /** Points this factor adds to the final score (always >= 0, sums to MFI). */
  points: number;
  /**
   * Signed impact relative to a neutral baseline (5/10). Positive means the
   * factor is pulling the score up, negative means it's dragging it down.
   * This is the "explainable" / SHAP-style driver value.
   */
  impact: number;
  /** True for load factors (workload, screen time) that are reverse-scored. */
  isLoad: boolean;
}

export interface MFIResult {
  /** Final Mental Footprint Index, 0-100, rounded. */
  score: number;
  riskLevel: RiskLevel;
  /** True when the score indicates elevated burnout risk. */
  burnoutRisk: boolean;
  /** Human-readable status band, e.g. "Balanced". */
  band: string;
  contributions: FactorContribution[];
  /** Factors dragging the score down most, worst first. */
  topRisks: FactorContribution[];
  /** Factors lifting the score most, best first. */
  topStrengths: FactorContribution[];
  recommendations: string[];
}

const NEUTRAL = 5; // midpoint of the 0-10 scale

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Normalise a raw 0-10 value into a 0-1 wellness contribution. */
function toWellness01(key: FactorKey, raw: number): number {
  const v = clamp(raw, 0, 10) / 10;
  return NEGATIVE_FACTORS.has(key) ? 1 - v : v;
}

const RECOMMENDATIONS: Record<FactorKey, string> = {
  sleepQuality:
    "Prioritise a consistent sleep schedule and aim for 7-9 hours of rest.",
  mood: "Try a short daily gratitude or journaling practice to lift your mood.",
  workload:
    "Your workload is high — block recovery time and delegate where possible.",
  physicalActivity:
    "Add light movement: a 20-minute walk can meaningfully reduce stress.",
  screenTime:
    "Screen time is elevated — schedule a daily digital detox window.",
  socialInteraction:
    "Reach out to a friend or colleague; social connection buffers stress.",
  recoveryHabits:
    "Build a small daily recovery ritual such as a 5-minute breathing exercise.",
};

export function classifyRisk(score: number): {
  riskLevel: RiskLevel;
  band: string;
  burnoutRisk: boolean;
} {
  if (score >= 75) return { riskLevel: "low", band: "Thriving", burnoutRisk: false };
  if (score >= 60)
    return { riskLevel: "low", band: "Balanced", burnoutRisk: false };
  if (score >= 45)
    return { riskLevel: "moderate", band: "Strained", burnoutRisk: false };
  return { riskLevel: "high", band: "Burnout Risk", burnoutRisk: true };
}

/**
 * Compute the Mental Footprint Index and an explainable breakdown for a single
 * assessment. Pure function: same input always yields the same output.
 */
export function computeMFI(input: AssessmentInput): MFIResult {
  const contributions: FactorContribution[] = FACTOR_ORDER.map((key) => {
    const value = clamp(input[key], 0, 10);
    const weight = FACTOR_WEIGHTS[key];
    const wellness01 = toWellness01(key, value);
    const points = weight * wellness01 * 100;
    // Impact vs. a neutral (5/10) baseline.
    const baseline01 = NEGATIVE_FACTORS.has(key) ? 0.5 : 0.5;
    const impact = weight * (wellness01 - baseline01) * 100;
    return {
      key,
      label: FACTOR_LABELS[key],
      value,
      points,
      impact,
      isLoad: NEGATIVE_FACTORS.has(key),
    };
  });

  const rawScore = contributions.reduce((sum, c) => sum + c.points, 0);
  const score = Math.round(clamp(rawScore, 0, 100));
  const { riskLevel, band, burnoutRisk } = classifyRisk(score);

  const byImpactAsc = [...contributions].sort((a, b) => a.impact - b.impact);
  const topRisks = byImpactAsc.filter((c) => c.impact < 0).slice(0, 3);
  const topStrengths = [...byImpactAsc]
    .reverse()
    .filter((c) => c.impact > 0)
    .slice(0, 3);

  const recommendations = (topRisks.length ? topRisks : byImpactAsc.slice(0, 2))
    .slice(0, 3)
    .map((c) => RECOMMENDATIONS[c.key]);

  return {
    score,
    riskLevel,
    band,
    burnoutRisk,
    contributions,
    topRisks,
    topStrengths,
    recommendations,
  };
}

/** A neutral assessment (all factors at the midpoint). Handy as a form default. */
export function neutralAssessment(): AssessmentInput {
  return {
    sleepQuality: 5,
    mood: 5,
    workload: 5,
    physicalActivity: 5,
    screenTime: 5,
    socialInteraction: 5,
    recoveryHabits: 5,
  };
}
