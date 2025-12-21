import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function Profile() {
  const walletAddress = "0x742d...8B2f";

  return (
    <Layout isLoggedIn={true} walletAddress={walletAddress} showSidebar={true}>
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-16 w-16 bg-wellness-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-wellness-600" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Profile Page
              </h2>
              <p className="text-muted-foreground max-w-md">
                This page is ready to be built out. It will show your personal info,
                wallet connections, and account preferences.
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
