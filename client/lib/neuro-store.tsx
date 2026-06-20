import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { computeMFI, type AssessmentInput, type MFIResult } from "@shared/mfi";
import {
  ACTIVITY_DEFINITIONS,
  BADGE_DEFINITIONS,
  MARKETPLACE_ITEMS,
  assessmentReward,
  activityReward,
  evaluateBadges,
  type ActivityType,
  type BadgeId,
} from "@shared/wellness";
import { submitTx, generateWalletAddress, type TxReceipt } from "./chain";

export interface AssessmentRecord {
  id: string;
  timestamp: number;
  input: AssessmentInput;
  score: number;
  band: string;
  riskLevel: MFIResult["riskLevel"];
  burnoutRisk: boolean;
  reward: number;
  txHash: string;
  blockNumber: number;
}

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  minutes: number;
  note?: string;
  timestamp: number;
  reward: number;
  txHash: string;
  blockNumber: number;
}

export type LedgerKind = "earn" | "spend" | "retire";

export interface LedgerEntry {
  id: string;
  timestamp: number;
  kind: LedgerKind;
  amount: number;
  reason: string;
  txHash?: string;
}

export interface EarnedBadge {
  id: BadgeId;
  timestamp: number;
  txHash: string;
}

export interface Purchase {
  id: string;
  itemId: string;
  name: string;
  price: number;
  timestamp: number;
  txHash: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  votesFor: number;
  votesAgainst: number;
  voted?: "for" | "against";
  status: "active" | "passed" | "rejected";
}

interface NeuroState {
  assessments: AssessmentRecord[];
  activities: ActivityRecord[];
  ledger: LedgerEntry[];
  badges: EarnedBadge[];
  purchases: Purchase[];
  proposals: Proposal[];
}

const EMPTY_STATE: NeuroState = {
  assessments: [],
  activities: [],
  ledger: [],
  badges: [],
  purchases: [],
  proposals: [],
};

const SEED_PROPOSALS: Proposal[] = [
  {
    id: "prop-treasury",
    title: "Fund a community meditation library",
    description:
      "Allocate treasury SOC to commission 20 guided meditation sessions free for all members.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    votesFor: 124,
    votesAgainst: 18,
    status: "active",
  },
  {
    id: "prop-rewards",
    title: "Increase therapy session rewards to 60 SOC",
    description:
      "Raise the SOC reward for verified therapy sessions to better reflect their recovery impact.",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    votesFor: 89,
    votesAgainst: 41,
    status: "active",
  },
];

function storageKey(userId: string) {
  return `neuro:data:${userId}`;
}

function loadState(userId: string): NeuroState {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { ...EMPTY_STATE, proposals: SEED_PROPOSALS };
    const parsed = JSON.parse(raw) as Partial<NeuroState>;
    return {
      ...EMPTY_STATE,
      ...parsed,
      proposals:
        parsed.proposals && parsed.proposals.length
          ? parsed.proposals
          : SEED_PROPOSALS,
    };
  } catch {
    return { ...EMPTY_STATE, proposals: SEED_PROPOSALS };
  }
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export interface DerivedStats {
  balance: number;
  totalEarned: number;
  totalRetired: number;
  latestScore: number | null;
  previousScore: number | null;
  scoreTrend: number | null;
  riskBand: string | null;
  burnoutRisk: boolean;
  assessmentCount: number;
  activityCount: number;
  badgeCount: number;
  streak: number;
}

interface NeuroContextType extends NeuroState {
  ready: boolean;
  stats: DerivedStats;
  walletAddress: string;
  submitAssessment: (
    input: AssessmentInput,
  ) => Promise<{ result: MFIResult; reward: number; newBadges: BadgeId[] }>;
  logActivity: (
    type: ActivityType,
    minutes: number,
    note?: string,
  ) => Promise<{ reward: number; newBadges: BadgeId[]; receipt: TxReceipt }>;
  offsetStress: (amount: number) => Promise<TxReceipt>;
  purchaseItem: (itemId: string) => Promise<TxReceipt>;
  voteOnProposal: (proposalId: string, choice: "for" | "against") => void;
  resetData: () => void;
}

const NeuroContext = createContext<NeuroContextType | undefined>(undefined);

/** Count consecutive days (ending today or yesterday) with an assessment. */
function computeStreak(assessments: AssessmentRecord[]): number {
  if (!assessments.length) return 0;
  const days = new Set(
    assessments.map((a) => new Date(a.timestamp).toDateString()),
  );
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to count if the most recent entry was today or yesterday.
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(cursor.toDateString())) return 0;
  }
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function NeuroProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [state, setState] = useState<NeuroState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);
  // Fallback custodial address used when no external wallet is connected.
  const [fallbackAddress] = useState(() => generateWalletAddress());

  const walletAddress = user?.walletAddress ?? fallbackAddress;

  // Load this user's data whenever the active account changes.
  useEffect(() => {
    if (!userId) {
      setState(EMPTY_STATE);
      setReady(false);
      return;
    }
    setState(loadState(userId));
    setReady(true);
  }, [userId]);

  // Persist on every change.
  useEffect(() => {
    if (!userId || !ready) return;
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  }, [state, userId, ready]);

  const stats = useMemo<DerivedStats>(() => {
    const totalEarned = state.ledger
      .filter((e) => e.kind === "earn")
      .reduce((s, e) => s + e.amount, 0);
    const totalSpent = state.ledger
      .filter((e) => e.kind === "spend")
      .reduce((s, e) => s + e.amount, 0);
    const totalRetired = state.ledger
      .filter((e) => e.kind === "retire")
      .reduce((s, e) => s + e.amount, 0);
    const sorted = [...state.assessments].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    const latest = sorted[sorted.length - 1] ?? null;
    const previous = sorted[sorted.length - 2] ?? null;
    return {
      balance: totalEarned - totalSpent - totalRetired,
      totalEarned,
      totalRetired,
      latestScore: latest?.score ?? null,
      previousScore: previous?.score ?? null,
      scoreTrend:
        latest && previous ? latest.score - previous.score : null,
      riskBand: latest?.band ?? null,
      burnoutRisk: latest?.burnoutRisk ?? false,
      assessmentCount: state.assessments.length,
      activityCount: state.activities.length,
      badgeCount: state.badges.length,
      streak: computeStreak(state.assessments),
    };
  }, [state]);

  /** Award any newly-qualified badges; returns the ids newly minted. */
  function mintBadges(
    next: NeuroState,
    ctxOverrides: Partial<Parameters<typeof evaluateBadges>[0]> = {},
  ): { badges: EarnedBadge[]; ledger: LedgerEntry[]; newIds: BadgeId[] } {
    const sorted = [...next.assessments].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    const latest = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];
    const qualified = evaluateBadges({
      latestScore: latest?.score ?? 0,
      previousScore: previous?.score,
      assessmentCount: next.assessments.length,
      verifiedActivityCount: next.activities.length,
      hasOffset: next.ledger.some((e) => e.kind === "retire"),
      ...ctxOverrides,
    });
    const have = new Set(next.badges.map((b) => b.id));
    const newIds = qualified.filter((id) => !have.has(id));
    const badges = [...next.badges];
    const ledger = [...next.ledger];
    for (const id of newIds) {
      badges.push({ id, timestamp: Date.now(), txHash: "0x" });
    }
    return { badges, ledger, newIds };
  }

  const submitAssessment: NeuroContextType["submitAssessment"] = async (
    input,
  ) => {
    const result = computeMFI(input);
    const sorted = [...state.assessments].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    const prevScore = sorted[sorted.length - 1]?.score;
    const reward = assessmentReward(result.score, prevScore);

    const receipt = await submitTx({
      from: walletAddress,
      contract: "RecoveryRegistry",
      method: "recordAssessment",
    });

    const record: AssessmentRecord = {
      id: uid("mfi"),
      timestamp: Date.now(),
      input,
      score: result.score,
      band: result.band,
      riskLevel: result.riskLevel,
      burnoutRisk: result.burnoutRisk,
      reward,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
    const earn: LedgerEntry = {
      id: uid("led"),
      timestamp: Date.now(),
      kind: "earn",
      amount: reward,
      reason: `Assessment reward (MFI ${result.score})`,
      txHash: receipt.hash,
    };

    let newBadges: BadgeId[] = [];
    setState((prev) => {
      const next: NeuroState = {
        ...prev,
        assessments: [...prev.assessments, record],
        ledger: [...prev.ledger, earn],
      };
      const minted = mintBadges(next);
      newBadges = minted.newIds;
      return { ...next, badges: minted.badges, ledger: minted.ledger };
    });

    return { result, reward, newBadges };
  };

  const logActivity: NeuroContextType["logActivity"] = async (
    type,
    minutes,
    note,
  ) => {
    const reward = activityReward(type);
    const receipt = await submitTx({
      from: walletAddress,
      contract: "RecoveryRegistry",
      method: "registerRecovery",
    });

    const record: ActivityRecord = {
      id: uid("act"),
      type,
      minutes,
      note,
      timestamp: Date.now(),
      reward,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
    const earn: LedgerEntry = {
      id: uid("led"),
      timestamp: Date.now(),
      kind: "earn",
      amount: reward,
      reason: `${ACTIVITY_DEFINITIONS[type].label} verified`,
      txHash: receipt.hash,
    };

    let newBadges: BadgeId[] = [];
    setState((prev) => {
      const next: NeuroState = {
        ...prev,
        activities: [...prev.activities, record],
        ledger: [...prev.ledger, earn],
      };
      const minted = mintBadges(next);
      newBadges = minted.newIds;
      return { ...next, badges: minted.badges, ledger: minted.ledger };
    });

    return { reward, newBadges, receipt };
  };

  const offsetStress: NeuroContextType["offsetStress"] = async (amount) => {
    if (amount <= 0) throw new Error("Amount must be positive");
    if (amount > stats.balance) throw new Error("Insufficient SOC balance");
    const receipt = await submitTx({
      from: walletAddress,
      contract: "StressOffsetCredit",
      method: "retire",
    });
    const entry: LedgerEntry = {
      id: uid("led"),
      timestamp: Date.now(),
      kind: "retire",
      amount,
      reason: "Retired SOC to offset stress",
      txHash: receipt.hash,
    };
    setState((prev) => {
      const next: NeuroState = { ...prev, ledger: [...prev.ledger, entry] };
      const minted = mintBadges(next);
      return { ...next, badges: minted.badges };
    });
    return receipt;
  };

  const purchaseItem: NeuroContextType["purchaseItem"] = async (itemId) => {
    const item = MARKETPLACE_ITEMS.find((i) => i.id === itemId);
    if (!item) throw new Error("Unknown item");
    if (item.price > stats.balance) throw new Error("Insufficient SOC balance");
    const receipt = await submitTx({
      from: walletAddress,
      contract: "Marketplace",
      method: "purchase",
    });
    const purchase: Purchase = {
      id: uid("buy"),
      itemId: item.id,
      name: item.name,
      price: item.price,
      timestamp: Date.now(),
      txHash: receipt.hash,
    };
    const entry: LedgerEntry = {
      id: uid("led"),
      timestamp: Date.now(),
      kind: "spend",
      amount: item.price,
      reason: `Purchased ${item.name}`,
      txHash: receipt.hash,
    };
    setState((prev) => ({
      ...prev,
      purchases: [...prev.purchases, purchase],
      ledger: [...prev.ledger, entry],
    }));
    return receipt;
  };

  const voteOnProposal: NeuroContextType["voteOnProposal"] = (
    proposalId,
    choice,
  ) => {
    setState((prev) => ({
      ...prev,
      proposals: prev.proposals.map((p) => {
        if (p.id !== proposalId || p.voted) return p;
        return {
          ...p,
          voted: choice,
          votesFor: p.votesFor + (choice === "for" ? 1 : 0),
          votesAgainst: p.votesAgainst + (choice === "against" ? 1 : 0),
        };
      }),
    }));
  };

  const resetData = () => {
    if (userId) localStorage.removeItem(storageKey(userId));
    setState({ ...EMPTY_STATE, proposals: SEED_PROPOSALS });
  };

  return (
    <NeuroContext.Provider
      value={{
        ...state,
        ready,
        stats,
        walletAddress,
        submitAssessment,
        logActivity,
        offsetStress,
        purchaseItem,
        voteOnProposal,
        resetData,
      }}
    >
      {children}
    </NeuroContext.Provider>
  );
}

export function useNeuro() {
  const ctx = useContext(NeuroContext);
  if (!ctx) throw new Error("useNeuro must be used within a NeuroProvider");
  return ctx;
}

export { BADGE_DEFINITIONS, MARKETPLACE_ITEMS, ACTIVITY_DEFINITIONS };
