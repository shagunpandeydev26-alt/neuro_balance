/**
 * Simulated on-chain layer.
 *
 * Stands in for the Ethereum smart contracts described in the NeuroBalance
 * design (RecoveryRegistry, StressOffsetCredit ERC-20, Marketplace). It mints
 * realistic-looking transaction receipts so the rest of the app can treat
 * recovery verification, SOC issuance, and marketplace activity as if they
 * were settled on a public ledger — without requiring a wallet, gas, or a
 * testnet. Swapping this module for a real ethers.js client later would not
 * change the calling code.
 */

export type ContractName =
  | "RecoveryRegistry"
  | "StressOffsetCredit"
  | "Marketplace";

export type ChainMethod =
  | "registerRecovery"
  | "mint"
  | "transfer"
  | "retire"
  | "purchase"
  | "recordAssessment";

export interface TxReceipt {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  contract: ContractName;
  method: ChainMethod;
  timestamp: number;
  status: "confirmed";
  gasUsed: number;
}

/** Deterministic-ish pseudo-random hex string of a given byte length. */
function randomHex(bytes: number): string {
  let out = "";
  for (let i = 0; i < bytes; i++) {
    out += Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  }
  return out;
}

/** A plausible contract address per contract, stable within a session. */
const CONTRACT_ADDRESSES: Record<ContractName, string> = {
  RecoveryRegistry: "0x" + randomHex(20),
  StressOffsetCredit: "0x" + randomHex(20),
  Marketplace: "0x" + randomHex(20),
};

export function contractAddress(contract: ContractName): string {
  return CONTRACT_ADDRESSES[contract];
}

// Monotonically increasing simulated block height.
let blockHeight = 18_000_000 + Math.floor(Math.random() * 100_000);

export interface SubmitTxArgs {
  from: string;
  contract: ContractName;
  method: ChainMethod;
}

/**
 * Simulate submitting a transaction. Resolves after a short, realistic delay
 * to mimic block confirmation latency.
 */
export async function submitTx({
  from,
  contract,
  method,
}: SubmitTxArgs): Promise<TxReceipt> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 500));
  blockHeight += 1;
  return {
    hash: "0x" + randomHex(32),
    blockNumber: blockHeight,
    from,
    to: CONTRACT_ADDRESSES[contract],
    contract,
    method,
    timestamp: Date.now(),
    status: "confirmed",
    gasUsed: 21000 + Math.floor(Math.random() * 60000),
  };
}

/** Generate a fresh pseudo wallet address (used by the "Connect Wallet" flow). */
export function generateWalletAddress(): string {
  return "0x" + randomHex(20);
}

/** Short display form for an address or tx hash: 0x1234…abcd. */
export function shortHash(value: string, lead = 6, tail = 4): string {
  if (!value || value.length <= lead + tail) return value;
  return `${value.slice(0, lead)}…${value.slice(-tail)}`;
}

/** Block-explorer-style URL (points at Etherscan's address/tx pages). */
export function explorerTxUrl(hash: string): string {
  return `https://etherscan.io/tx/${hash}`;
}
