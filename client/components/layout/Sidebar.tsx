import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldCheck,
  Coins,
  Image,
  ShoppingCart,
  Vote,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isLoggedIn?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assessment", href: "/assessment", icon: ClipboardCheck },
  { label: "Activities", href: "/activities", icon: ShieldCheck },
  { label: "Tokens", href: "/tokens", icon: Coins },
  { label: "NFTs", href: "/nfts", icon: Image },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  { label: "DAO", href: "/dao", icon: Vote },
];

export function Sidebar({
  isOpen = true,
  onClose,
  isLoggedIn = false,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const isActive = (href: string) => location.pathname === href;

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky md:top-16 left-0 top-0 z-40 flex flex-col",
          "h-screen md:h-[calc(100vh-4rem)] glass-strong border-r border-sidebar-border",
          "transition-[width,transform] duration-300 ease-out",
          collapsed ? "md:w-20" : "md:w-64",
          "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  collapsed && "md:justify-center",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-wellness-600 to-wellness-500 glow-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 relative z-10 shrink-0" />
                <span
                  className={cn(
                    "relative z-10 whitespace-nowrap transition-all",
                    collapsed && "md:hidden",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden md:block p-3 border-t border-sidebar-border">
          <button
            onClick={onToggleCollapse}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
              collapsed && "justify-center",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <>
                <PanelLeftClose className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
