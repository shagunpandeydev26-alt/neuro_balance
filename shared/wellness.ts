/**
 * Shared domain model for recovery activities, Stress Offset Credit (SOC)
 * rewards, and Proof-of-Care badge rules. Used by the client store and any
 * server-side verification logic.
 */

import type { AssessmentInput, MFIResult } from "./mfi";

export type ActivityType =
  | "meditation"
  | "exercise"
  | "therapy"
  | "digital_detox"
  | "wellness_challenge";

export interface ActivityDefinition {
  type: ActivityType;
  label: string;
  description: string;
  /** SOC awarded when a session of this type is verified on-chain. */
  reward: number;
  /** Suggested duration in minutes (used for the log form). */
  defaultMinutes: number;
}

export const ACTIVITY_DEFINITIONS: Record<ActivityType, ActivityDefinition> = {
  meditation: {
    type: "meditation",
    label: "Meditation",
    description: "Mindfulness, breathing, or guided meditation session.",
    reward: 20,
    defaultMinutes: 10,
  },
  exercise: {
    type: "exercise",
    label: "Exercise",
    description: "Physical movement: walk, run, gym, yoga, or sport.",
    reward: 30,
    defaultMinutes: 30,
  },
  therapy: {
    type: "therapy",
    label: "Therapy Session",
    description: "A session with a counsellor, therapist, or coach.",
    reward: 50,
    defaultMinutes: 50,
  },
  digital_detox: {
    type: "digital_detox",
    label: "Digital Detox",
    description: "Intentional screen-free recovery time.",
    reward: 25,
    defaultMinutes: 60,
  },
  wellness_challenge: {
    type: "wellness_challenge",
    label: "Wellness Challenge",
    description: "Complete a structured wellness or resilience challenge.",
    reward: 40,
    defaultMinutes: 20,
  },
};

export const ACTIVITY_TYPES = Object.keys(
  ACTIVITY_DEFINITIONS,
) as ActivityType[];

export function activityReward(type: ActivityType): number {
  return ACTIVITY_DEFINITIONS[type]?.reward ?? 0;
}

/** Base SOC granted for completing a wellness assessment. */
export const ASSESSMENT_BASE_REWARD = 50;
/** Extra SOC per point of MFI improvement over the previous assessment. */
export const IMPROVEMENT_REWARD_PER_POINT = 2;

/**
 * SOC awarded for an assessment: a flat base plus a bonus proportional to how
 * much the score improved since last time. Never negative.
 */
export function assessmentReward(score: number, previousScore?: number): number {
  let reward = ASSESSMENT_BASE_REWARD;
  if (typeof previousScore === "number" && score > previousScore) {
    reward += Math.round((score - previousScore) * IMPROVEMENT_REWARD_PER_POINT);
  }
  return reward;
}

// ---------------------------------------------------------------------------
// Proof-of-Care badges (the app's "NFTs")
// ---------------------------------------------------------------------------

export type BadgeId =
  | "first_steps"
  | "balanced_mind"
  | "thriving"
  | "comeback"
  | "consistency"
  | "recovery_pro"
  | "offsetter";

export interface BadgeDefinition {
  id: BadgeId;
  name: string;
  description: string;
  /** Emoji used as a lightweight on-card artwork. */
  emblem: string;
  tier: "bronze" | "silver" | "gold";
}

export const BADGE_DEFINITIONS: Record<BadgeId, BadgeDefinition> = {
  first_steps: {
    id: "first_steps",
    name: "First Steps",
    description: "Completed your first wellness assessment.",
    emblem: "🌱",
    tier: "bronze",
  },
  balanced_mind: {
    id: "balanced_mind",
    name: "Balanced Mind",
    description: "Reached an MFI of 60 or higher.",
    emblem: "⚖️",
    tier: "silver",
  },
  thriving: {
    id: "thriving",
    name: "Thriving",
    description: "Reached an MFI of 75 or higher.",
    emblem: "🌟",
    tier: "gold",
  },
  comeback: {
    id: "comeback",
    name: "Comeback",
    description: "Improved your MFI by 15+ points between assessments.",
    emblem: "📈",
    tier: "silver",
  },
  consistency: {
    id: "consistency",
    name: "Consistency",
    description: "Logged 5 or more wellness assessments.",
    emblem: "🔁",
    tier: "silver",
  },
  recovery_pro: {
    id: "recovery_pro",
    name: "Recovery Pro",
    description: "Verified 10 or more recovery activities.",
    emblem: "🧘",
    tier: "gold",
  },
  offsetter: {
    id: "offsetter",
    name: "Stress Offsetter",
    description: "Retired SOC to offset stress for the first time.",
    emblem: "♻️",
    tier: "bronze",
  },
};

export interface BadgeProgressContext {
  latestScore: number;
  previousScore?: number;
  assessmentCount: number;
  verifiedActivityCount: number;
  hasOffset: boolean;
}

/**
 * Given the current account context, return the set of badge ids that should
 * be unlocked. Pure and idempotent — callers diff against already-earned
 * badges to decide what is newly minted.
 */
export function evaluateBadges(ctx: BadgeProgressContext): BadgeId[] {
  const earned: BadgeId[] = [];
  if (ctx.assessmentCount >= 1) earned.push("first_steps");
  if (ctx.latestScore >= 60) earned.push("balanced_mind");
  if (ctx.latestScore >= 75) earned.push("thriving");
  if (
    typeof ctx.previousScore === "number" &&
    ctx.latestScore - ctx.previousScore >= 15
  ) {
    earned.push("comeback");
  }
  if (ctx.assessmentCount >= 5) earned.push("consistency");
  if (ctx.verifiedActivityCount >= 10) earned.push("recovery_pro");
  if (ctx.hasOffset) earned.push("offsetter");
  return earned;
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  /** Price in SOC. */
  price: number;
  emblem: string;
  category: "bundle" | "service" | "premium";
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "calm-bundle",
    name: "Calm Starter Bundle",
    description: "A week of guided meditations and breathing exercises.",
    price: 120,
    emblem: "🧘",
    category: "bundle",
  },
  {
    id: "sleep-kit",
    name: "Sleep Reset Kit",
    description: "Sleep-tracking insights and a wind-down routine plan.",
    price: 180,
    emblem: "😴",
    category: "bundle",
  },
  {
    id: "coach-session",
    name: "1:1 Wellness Coaching",
    description: "A live 30-minute session with a certified wellness coach.",
    price: 400,
    emblem: "🤝",
    category: "service",
  },
  {
    id: "analytics-pro",
    name: "Analytics Pro (30 days)",
    description: "Advanced MFI trend analytics and long-term reporting.",
    price: 300,
    emblem: "📊",
    category: "premium",
  },
];

/** Re-export so consumers can import the assessment/result types from one place. */
export type { AssessmentInput, MFIResult };
