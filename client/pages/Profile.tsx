import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { generateWalletAddress } from "@/lib/chain";
import { User, Mail, Wallet, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user, connectWallet, disconnectWallet } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnectWallet = () => {
    connectWallet(generateWalletAddress());
  };

  return (
    <Layout
      isLoggedIn={true}
      walletAddress={user?.walletAddress}
      showSidebar={true}
    >
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Picture and Basic Info */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              {/* Avatar */}
              <div className="flex flex-col items-center md:items-start">
                <div className="h-24 w-24 bg-gradient-to-br from-wellness-400 to-wellness-600 rounded-full flex items-center justify-center text-white mb-4">
                  <User className="h-12 w-12" />
                </div>
                <Button variant="outline" className="border-wellness-700">
                  Upload Photo
                </Button>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {user?.name || "User"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <p className="text-lg font-semibold text-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Member Since
                  </label>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              Wallet Connection
            </h2>

            {user?.walletAddress ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Connected Wallet
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-foreground font-semibold">
                      {user.walletAddress}
                    </p>
                    <button
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-border rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-growth-500" />
                      ) : (
                        <Copy className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-growth-900/20 border border-growth-700 rounded-lg">
                  <p className="text-sm text-growth-400">
                    ✓ Wallet is connected and verified
                  </p>
                </div>

                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Connect a blockchain wallet to enable token transactions and
                  governance voting.
                </p>
                <Button
                  onClick={handleConnectWallet}
                  className="bg-wellness-500 hover:bg-wellness-600 text-white"
                >
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Account Actions
            </h2>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full border-border justify-start text-foreground hover:bg-muted"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full border-border justify-start text-foreground hover:bg-muted"
              >
                Download My Data
              </Button>
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive justify-start hover:bg-destructive/10"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
