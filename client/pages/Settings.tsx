import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/lib/auth-context";
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  Lock,
  Palette,
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
    dataPrivacy: true,
    twoFactorAuth: false,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your preferences and privacy settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Email Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your wellness progress
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.emailNotifications ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Push Notifications
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Get instant alerts on your device
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushNotifications")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.pushNotifications ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.pushNotifications ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Marketing Emails
                  </p>
                  <p className="text-sm text-muted-foreground">
                    News and offers from NeuroBalance
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("marketingEmails")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.marketingEmails ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.marketingEmails ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Appearance
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the entire application
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("darkMode")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.darkMode ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.darkMode ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Choose your preferred color theme
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 bg-wellness-500 rounded-lg border-2 border-wellness-500">
                    <span className="text-white text-xs font-medium">Blue</span>
                  </button>
                  <button className="p-3 bg-growth-500 rounded-lg border-2 border-border hover:border-growth-500 transition-colors">
                    <span className="text-white text-xs font-medium">
                      Green
                    </span>
                  </button>
                  <button className="p-3 bg-purple-500 rounded-lg border-2 border-border hover:border-purple-500 transition-colors">
                    <span className="text-white text-xs font-medium">
                      Purple
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Privacy & Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add extra security to your account
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("twoFactorAuth")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.twoFactorAuth ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.twoFactorAuth ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 hover:bg-muted rounded-lg transition-colors">
                <div>
                  <p className="font-medium text-foreground">Data Privacy</p>
                  <p className="text-sm text-muted-foreground">
                    Keep your data private and encrypted
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("dataPrivacy")}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    settings.dataPrivacy ? "bg-wellness-500" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.dataPrivacy ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-wellness-900/20 border border-wellness-700 rounded-lg">
                <p className="text-sm text-wellness-300">
                  Your privacy and security are our top priorities. All data is
                  encrypted and verified on the blockchain.
                </p>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="glass rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Active Sessions
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Current Device</p>
                  <p className="text-sm text-muted-foreground">
                    Active right now
                  </p>
                </div>
                <span className="h-3 w-3 bg-growth-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
