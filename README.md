<div align="center">

# 🧠 NeuroBalance

### The Carbon Credit System for the Human Mind

**Measure. Heal. Offset.**

A blockchain-powered wellness platform that quantifies mental well-being, verifies recovery
activities, and turns positive mental-health actions into measurable value through a transparent
**Stress Offset Economy**.

### 🌐 [**Live Demo → neuro-balancee.netlify.app**](https://neuro-balancee.netlify.app/)

</div>

---

## ✨ Overview

Mental well-being is **unquantified, undetected, unincentivized, and unverified**. NeuroBalance
fixes that with a single, measurable loop:

| Step | What happens | Where it lives |
| --- | --- | --- |
| **Measure** | A seven-factor wellness assessment computes your **Mental Footprint Index (MFI)** — a live 0–100 score with explainable, SHAP-style factor breakdowns. | [`shared/mfi.ts`](shared/mfi.ts) |
| **Verify** | Recovery activities (meditation, exercise, therapy, digital detox, challenges) are written to a tamper-resistant on-chain registry. | [`client/lib/chain.ts`](client/lib/chain.ts) |
| **Offset & Reward** | Verified recovery mints **Stress Offset Credits (SOC)** you can retire to offset stress, redeem in the marketplace, or use for DAO governance. | [`client/lib/neuro-store.tsx`](client/lib/neuro-store.tsx) |

Just as carbon credits incentivize environmental sustainability, NeuroBalance creates incentives for
**psychological sustainability**.

> [!NOTE]
> **Blockchain is currently simulated in-app.** A fully working ledger, wallet, and transaction
> receipts run client-side with no real Ethereum, MetaMask, or gas required — so the whole app works
> offline immediately. The code is structured so the simulated layer can be swapped for real
> Solidity contracts + ethers.js without changing the calling code (see [Roadmap](#-roadmap)).

---

## 🎯 Features

- **Mental Footprint Index** — dynamic 0–100 score from sleep, mood, workload, physical activity,
  screen time, social interaction, and recovery habits, with burnout-risk signals and personalized
  recommendations.
- **Recovery verification** — log activities and get immutable, timestamped on-chain records with
  block-explorer-style transaction links.
- **Stress Offset Credits (SOC)** — earn for verified actions, view a full transaction ledger, and
  **retire** credits to offset stress (like retiring a carbon credit).
- **Proof-of-Care badges** — rule-based NFT-style achievements (First Steps, Balanced Mind, Thriving,
  Comeback, Consistency, Recovery Pro, Offsetter).
- **Marketplace** — redeem SOC for wellness bundles, coaching, and premium analytics.
- **DAO governance** — vote on community proposals using your SOC as voting power.
- **Insightful dashboard** — animated MFI radial gauge, trend charts, recovery streaks, and a live
  activity feed.
- **Persistence** — sessions and per-user data survive refreshes via `localStorage`.

---

## 🎨 Design

A premium, dark-by-default interface inspired by Stripe, Linear, and Headspace.

- **Palette** — Deep Indigo (primary) · Electric Cyan (secondary) · Emerald (accent) on near-black,
  with dark-slate glass surfaces.
- **Motion** — built with Framer Motion: scroll reveals, animated counters, a mouse-reactive neural
  particle hero, magnetic buttons, page transitions, and a collapsible sidebar.
- **Reusable primitives** live in [`client/components/motion/`](client/components/motion):
  `Reveal`, `AnimatedCounter`, `RadialScore`, `ParticleField`, `MagneticButton`, `Aurora`.
- **Theme tokens** live in [`client/global.css`](client/global.css); utility classes include
  `.glass`, `.glass-strong`, `.text-gradient`, and `.glow-primary`.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, TypeScript, React Router 6 (SPA), Vite 7 |
| **Styling** | Tailwind CSS 3, Radix UI / shadcn, Lucide icons |
| **Motion & Charts** | Framer Motion, Recharts |
| **Backend** | Express 5 (integrated with the Vite dev server) |
| **Testing** | Vitest |
| **Package manager** | pnpm |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Install & run

```bash
pnpm install        # install dependencies
pnpm dev            # start the dev server at http://localhost:8080
```

Then open **http://localhost:8080**, click **Get Started** to register an account, take your first
**Assessment**, and watch your MFI, SOC balance, and badges come to life.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the client + server dev environment (port 8080) |
| `pnpm build` | Production build (client + server) |
| `pnpm start` | Run the production server |
| `pnpm test` | Run the Vitest suite |
| `pnpm typecheck` | TypeScript validation |
| `pnpm format.fix` | Format with Prettier |

---

## 📁 Project Structure

```
client/                      # React SPA
├── components/
│   ├── auth/                # AuthModal
│   ├── layout/              # Navbar, Sidebar, Layout (collapsible shell + page transitions)
│   ├── motion/              # Framer Motion primitives (Reveal, RadialScore, ParticleField…)
│   └── ui/                  # shadcn/Radix component library
├── lib/
│   ├── auth-context.tsx     # Persisted mock auth (localStorage)
│   ├── neuro-store.tsx      # Central data store: MFI, SOC ledger, badges, marketplace, DAO
│   └── chain.ts             # Simulated on-chain layer (tx receipts, wallet helpers)
├── pages/                   # Landing, Dashboard, Assessment, Activities, Tokens, NFTs,
│                            #   Marketplace, DAO, Profile, Settings
└── global.css               # Theme tokens + utilities

shared/                      # Pure logic shared across the app (and testable)
├── mfi.ts                   # Mental Footprint Index engine
├── mfi.spec.ts              # MFI + reward/badge tests
└── wellness.ts              # Activity types, SOC rewards, badge & marketplace rules

server/                      # Express API (currently a thin demo layer)
```

---

## 🧪 Testing

The MFI engine and reward/badge logic are pure and fully unit-tested:

```bash
pnpm test
```

---

## 🗺️ Roadmap

The simulated blockchain layer is designed to be replaced by real contracts with no changes to the
UI logic:

- [ ] `RecoveryRegistry.sol` — on-chain recovery activity & assessment records
- [ ] `StressOffsetCredit.sol` — ERC-20 SOC token (OpenZeppelin)
- [ ] `Marketplace.sol` — credit listings, purchases, and retirement
- [ ] Hardhat tooling + ethers.js wiring + MetaMask wallet connection
- [ ] Optional backend persistence (PostgreSQL / Supabase) and organization analytics

---

## ☁️ Deployment

Live at **[neuro-balancee.netlify.app](https://neuro-balancee.netlify.app/)**, deployed on
**Netlify** (see [`netlify.toml`](netlify.toml)). The SPA builds to `dist/spa` for any static host,
with the Express server bundled to `dist/server`.

```bash
pnpm build
pnpm start
```

---

<div align="center">

Built for wellness, powered by community. **Measure. Heal. Offset.**

</div>
