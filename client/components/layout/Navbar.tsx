import { Link } from "react-router-dom";
import { Brain, LogOut, Menu, Settings, User, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Safely use useAuth - guard against context not being available
  let user, isAuthenticated, logout, connectWallet;
  try {
    const auth = useAuth();
    user = auth.user;
    isAuthenticated = auth.isAuthenticated;
    logout = auth.logout;
    connectWallet = auth.connectWallet;
  } catch (e) {
    // If useAuth is not available, set defaults
    user = null;
    isAuthenticated = false;
    logout = () => {};
    connectWallet = () => {};
  }

  const handleDisconnect = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-gradient-to-br from-wellness-500 to-growth-500 rounded-lg p-2">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-foreground hidden sm:inline">NeuroBalance</span>
        </Link>

        {/* Menu Button (Mobile) */}
        {onMenuClick && isAuthenticated && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {isAuthenticated ? (
            <>
              {/* Connect Wallet Button (if not connected) */}
              {!user?.walletAddress && (
                <Button
                  onClick={() => {
                    const walletAddress = "0x" + Math.random().toString(16).slice(2, 14) + Math.random().toString(16).slice(2, 14);
                    connectWallet(walletAddress);
                  }}
                  variant="outline"
                  className="hidden sm:flex items-center gap-2 border-wellness-300 text-wellness-600 hover:bg-wellness-500/10"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              )}

              {/* Wallet Address (if connected) */}
              {user?.walletAddress && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <div className="h-2 w-2 bg-growth-500 rounded-full"></div>
                  <span className="text-muted-foreground">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                </div>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                  title={user?.email}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-wellness-400 to-wellness-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-muted text-sm transition-colors text-foreground"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-muted text-sm transition-colors text-foreground"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={handleDisconnect}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted text-sm text-destructive transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
