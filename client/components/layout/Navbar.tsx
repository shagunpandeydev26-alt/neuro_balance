import { Link } from "react-router-dom";
import { Brain, LogOut, Menu, Settings, User, Wallet } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { generateWalletAddress } from "@/lib/chain";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, connectWallet } = useAuth();

  const handleDisconnect = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 h-16 glass-strong border-b border-border">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-3">
          {onMenuClick && isAuthenticated && (
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 font-bold text-lg"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-wellness-500 to-secondary rounded-lg p-2 glow-primary"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-display text-foreground hidden sm:inline">
              NeuroBalance
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {!user?.walletAddress ? (
                <Button
                  onClick={() => connectWallet(generateWalletAddress())}
                  variant="outline"
                  className="hidden sm:flex items-center gap-2 border-wellness-700 text-wellness-300 hover:bg-wellness-500/10 bg-transparent"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              ) : (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 glass rounded-lg text-sm">
                  <span className="h-2 w-2 bg-growth-400 rounded-full animate-pulse" />
                  <span className="text-muted-foreground font-mono">
                    {user.walletAddress.slice(0, 6)}…
                    {user.walletAddress.slice(-4)}
                  </span>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((s) => !s)}
                  className="flex items-center gap-2 p-1 hover:bg-white/5 rounded-lg transition-colors"
                  title={user?.email}
                >
                  <div className="h-9 w-9 bg-gradient-to-br from-wellness-500 to-secondary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <button
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setShowUserMenu(false)}
                      aria-hidden="true"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-strong border border-border rounded-xl shadow-xl py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-sm transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-sm transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleDisconnect}
                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 text-sm text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
