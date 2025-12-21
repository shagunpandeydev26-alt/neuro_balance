import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export default function NFTs() {
  const walletAddress = "0x742d...8B2f";

  return (
    <Layout isLoggedIn={true} walletAddress={walletAddress} showSidebar={true}>
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            NFT Gallery
          </h1>
          <p className="text-muted-foreground">
            View your Proof-of-Care NFTs
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-purple-600" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                NFT Gallery
              </h2>
              <p className="text-muted-foreground max-w-md">
                This page is ready to be built out. It will display your Proof-of-Care
                NFTs with filtering by status and detailed information.
              </p>
            </div>

            <Button className="bg-wellness-500 hover:bg-wellness-600">
              Continue Building This Page
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
