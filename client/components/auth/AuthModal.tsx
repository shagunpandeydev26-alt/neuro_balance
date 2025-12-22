import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!email || !password || !name) {
          setError("Please fill in all fields");
          setLoading(false);
          return;
        }
        await register(email, name, password);
      }
      
      // Close modal on successful auth
      onClose();
      
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl max-w-md w-full relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {mode === "login" ? "Welcome Back" : "Join NeuroBalance"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to your account"
              : "Create a new account to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
          {/* Name Field (Register Only) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-wellness-500"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-wellness-500"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-wellness-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-wellness-500 hover:bg-wellness-600 text-white py-2 mt-6"
          >
            {loading
              ? "Loading..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </Button>

          {/* Toggle Mode */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-wellness-500 hover:text-wellness-600 font-medium transition-colors"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
