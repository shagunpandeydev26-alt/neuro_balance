import { ReactNode, useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  walletAddress?: string;
  showSidebar?: boolean;
}

export function Layout({
  children,
  isLoggedIn = false,
  walletAddress,
  showSidebar = true,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        onMenuClick={showSidebar ? () => setSidebarOpen(!sidebarOpen) : undefined}
        isLoggedIn={isLoggedIn}
        walletAddress={walletAddress}
      />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && isLoggedIn && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isLoggedIn={isLoggedIn}
          />
        )}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
