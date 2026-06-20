import { useState } from "react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNeuro, MARKETPLACE_ITEMS } from "@/lib/neuro-store";
import { Zap, Check, Loader2 } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  bundle: "Bundle",
  service: "Service",
  premium: "Premium",
};

export default function Marketplace() {
  const { user } = useAuth();
  const { stats, purchases, purchaseItem } = useNeuro();
  const [busyId, setBusyId] = useState<string | null>(null);

  const ownedIds = new Set(purchases.map((p) => p.itemId));

  const handleBuy = async (id: string) => {
    setBusyId(id);
    try {
      await purchaseItem(id);
      toast.success("Purchase complete", {
        description: "Settled via the Marketplace contract.",
      });
    } catch (err) {
      toast.error("Purchase failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Redeem your Stress Offset Credits for wellness bundles and
              services.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-growth-900/30 border border-growth-700 rounded-lg">
            <Zap className="h-5 w-5 text-growth-400" />
            <span className="font-semibold text-growth-400">
              {stats.balance} SOC
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETPLACE_ITEMS.map((item) => {
            const owned = ownedIds.has(item.id);
            const affordable = stats.balance >= item.price;
            return (
              <div
                key={item.id}
                className="glass rounded-2xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{item.emblem}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {CATEGORY_LABEL[item.category]}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground flex-1">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-5">
                  <span className="font-bold text-foreground flex items-center gap-1">
                    <Zap className="h-4 w-4 text-growth-500" />
                    {item.price}
                  </span>
                  {owned ? (
                    <Button
                      disabled
                      variant="outline"
                      className="gap-1 border-growth-500 text-growth-500"
                    >
                      <Check className="h-4 w-4" />
                      Owned
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleBuy(item.id)}
                      disabled={!affordable || busyId === item.id}
                      className="bg-wellness-500 hover:bg-wellness-600 text-white"
                    >
                      {busyId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : affordable ? (
                        "Redeem"
                      ) : (
                        "Need more SOC"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
