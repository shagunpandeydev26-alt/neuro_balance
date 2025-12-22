import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth-context";
import {
  Brain,
  TrendingUp,
  Zap,
  ShoppingBag,
  Vote,
  Lock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    window.location.href = "/dashboard";
    return null;
  }

  const handleButtonClick = () => {
    setShowAuthModal(true);
  };

  return (
    <Layout showSidebar={false}>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <div className="bg-gradient-to-b from-wellness-900 via-background to-background">
        {/* Hero Section */}
        <section className="px-4 md:px-6 py-20 md:py-32 max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-wellness-400 to-growth-400 rounded-full blur-3xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-wellness-500 to-growth-500 rounded-full p-4 w-fit mx-auto">
                  <Brain className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Measure. Heal. Offset.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              NeuroBalance is a mental wellness platform powered by AI scoring,
              blockchain verification, and decentralized governance. Track your
              mental fitness, earn tokens, and participate in the future of
              wellness.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleButtonClick}
                className="gap-2 bg-wellness-500 hover:bg-wellness-600 text-white px-8 py-6 text-base h-auto"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
              <a href="#features">
                <Button
                  variant="outline"
                  className="border-wellness-300 text-wellness-600 hover:bg-wellness-900/50 px-8 py-6 text-base h-auto"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-wellness-200 via-growth-200 to-wellness-200 rounded-3xl blur-2xl opacity-10"></div>
            <div className="relative bg-card rounded-3xl border border-border p-8 md:p-12 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 bg-wellness-900 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-wellness-400" />
                  </div>
                  <h3 className="font-semibold mb-2">MFI Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time mental fitness scoring with explainable AI
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 bg-growth-900 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-growth-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn and trade Stress Offset Tokens (SOT)
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-4">
                  <div className="h-12 w-12 bg-wellness-900 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-wellness-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Blockchain</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified metrics and secure smart contracts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="px-4 md:px-6 py-20 max-w-6xl mx-auto border-t border-border"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Core Features
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-wellness-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-wellness-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    MFI Score & SHAP
                  </h3>
                  <p className="text-muted-foreground">
                    Mental Fitness Index powered by explainable AI. Understand
                    exactly what factors influence your wellness score.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-growth-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-growth-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Proof-of-Care NFTs
                  </h3>
                  <p className="text-muted-foreground">
                    Earn unique NFTs for completing wellness goals and
                    milestones. Unlock achievements and build your wellness
                    portfolio.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-wellness-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-wellness-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Stress Offset Tokens
                  </h3>
                  <p className="text-muted-foreground">
                    ERC-20 tokens that represent your wellness impact. Trade,
                    offset stress, and participate in the ecosystem.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-growth-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Vote className="h-6 w-6 text-growth-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">DAO Governance</h3>
                  <p className="text-muted-foreground">
                    Vote on platform proposals and shape the future of
                    NeuroBalance. Your voice matters.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-wellness-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-6 w-6 text-wellness-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                  <p className="text-muted-foreground">
                    Browse and purchase wellness bundles, services, and premium
                    features using your tokens.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-growth-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-growth-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                  <p className="text-muted-foreground">
                    Your data is encrypted and verifiable. Control what you
                    share and with whom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 md:px-6 py-20 max-w-6xl mx-auto border-t border-border">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-wellness-400 mb-2">
                100K+
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-growth-400 mb-2">
                50M+
              </div>
              <p className="text-muted-foreground">SOT Distributed</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-wellness-400 mb-2">
                2.5M+
              </div>
              <p className="text-muted-foreground">NFTs Earned</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-growth-400 mb-2">
                150+
              </div>
              <p className="text-muted-foreground">Active Proposals</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 md:px-6 py-20 max-w-6xl mx-auto border-t border-border">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-wellness-500 to-growth-500 rounded-3xl opacity-10 blur-2xl"></div>
            <div className="relative bg-card border border-wellness-700 rounded-3xl p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Take Control?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sign up and start tracking your mental wellness today. Measure
                your progress, heal your mind, and offset your stress.
              </p>
              <Button
                onClick={handleButtonClick}
                className="gap-2 bg-wellness-500 hover:bg-wellness-600 text-white px-8 py-6 text-base h-auto"
              >
                Sign Up Now
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-4 md:px-6 py-12 max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 NeuroBalance. Built for wellness, powered by community.</p>
        </footer>
      </div>
    </Layout>
  );
}
