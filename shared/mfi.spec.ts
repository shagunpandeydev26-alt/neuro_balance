import { describe, it, expect } from "vitest";
import {
  computeMFI,
  classifyRisk,
  neutralAssessment,
  FACTOR_WEIGHTS,
  FACTOR_ORDER,
  type AssessmentInput,
} from "./mfi";
import { assessmentReward, evaluateBadges } from "./wellness";

const best: AssessmentInput = {
  sleepQuality: 10,
  mood: 10,
  workload: 0, // load factors at 0 = ideal
  physicalActivity: 10,
  screenTime: 0,
  socialInteraction: 10,
  recoveryHabits: 10,
};

const worst: AssessmentInput = {
  sleepQuality: 0,
  mood: 0,
  workload: 10,
  physicalActivity: 0,
  screenTime: 10,
  socialInteraction: 0,
  recoveryHabits: 0,
};

describe("computeMFI", () => {
  it("weights sum to 1", () => {
    const total = FACTOR_ORDER.reduce((s, k) => s + FACTOR_WEIGHTS[k], 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it("scores an ideal profile at 100", () => {
    expect(computeMFI(best).score).toBe(100);
  });

  it("scores a worst-case profile at 0", () => {
    expect(computeMFI(worst).score).toBe(0);
  });

  it("scores a neutral profile at 50", () => {
    expect(computeMFI(neutralAssessment()).score).toBe(50);
  });

  it("contribution points sum to the score", () => {
    const r = computeMFI({
      sleepQuality: 7,
      mood: 6,
      workload: 4,
      physicalActivity: 8,
      screenTime: 3,
      socialInteraction: 5,
      recoveryHabits: 6,
    });
    const sum = r.contributions.reduce((s, c) => s + c.points, 0);
    expect(Math.round(sum)).toBe(r.score);
  });

  it("reverse-scores load factors (high workload drags the score down)", () => {
    const low = computeMFI({ ...neutralAssessment(), workload: 0 }).score;
    const high = computeMFI({ ...neutralAssessment(), workload: 10 }).score;
    expect(low).toBeGreaterThan(high);
  });

  it("flags burnout risk for a poor profile", () => {
    const r = computeMFI(worst);
    expect(r.burnoutRisk).toBe(true);
    expect(r.riskLevel).toBe("high");
  });

  it("surfaces the worst factor as a top risk", () => {
    const r = computeMFI({ ...best, sleepQuality: 0 });
    expect(r.topRisks[0]?.key).toBe("sleepQuality");
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it("clamps out-of-range input", () => {
    const r = computeMFI({ ...neutralAssessment(), mood: 999, sleepQuality: -5 });
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe("classifyRisk", () => {
  it("bands scores correctly", () => {
    expect(classifyRisk(80).band).toBe("Thriving");
    expect(classifyRisk(65).band).toBe("Balanced");
    expect(classifyRisk(50).band).toBe("Strained");
    expect(classifyRisk(20).band).toBe("Burnout Risk");
    expect(classifyRisk(20).burnoutRisk).toBe(true);
  });
});

describe("assessmentReward", () => {
  it("grants the base reward with no prior score", () => {
    expect(assessmentReward(60)).toBe(50);
  });

  it("adds an improvement bonus", () => {
    expect(assessmentReward(70, 60)).toBe(50 + 20);
  });

  it("never penalises a drop", () => {
    expect(assessmentReward(40, 70)).toBe(50);
  });
});

describe("evaluateBadges", () => {
  it("awards first steps after one assessment", () => {
    const badges = evaluateBadges({
      latestScore: 40,
      assessmentCount: 1,
      verifiedActivityCount: 0,
      hasOffset: false,
    });
    expect(badges).toContain("first_steps");
  });

  it("awards comeback on a 15+ jump", () => {
    const badges = evaluateBadges({
      latestScore: 80,
      previousScore: 60,
      assessmentCount: 2,
      verifiedActivityCount: 0,
      hasOffset: false,
    });
    expect(badges).toContain("comeback");
    expect(badges).toContain("thriving");
  });
});
