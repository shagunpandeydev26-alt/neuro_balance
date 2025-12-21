import { Link } from "react-router-dom";
import { Brain, LogOut, Menu, Settings, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
  isLoggedIn?: boolean;
  walletAddress?: string;
}

export function Navbar({
  onMenuClick,
  isLoggedIn = false,
  walletAddress,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-gradient-to-br from-wellness-500 to-growth-500 rounded-lg p-2">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-foreground hidden sm:inline">NeuroBalance</span>
        </Link>

        {/* Menu Button (Mobile) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Wallet Address */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                <div className="h-2 w-2 bg-growth-500 rounded-full"></div>
                <span className="text-muted-foreground">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connected"}
                </span>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-wellness-400 to-wellness-600 rounded-full"></div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-border" />
                    <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm text-destructive transition-colors">
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/dashboard">
              <Button className="bg-wellness-500 hover:bg-wellness-600">
                Connect Wallet
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
