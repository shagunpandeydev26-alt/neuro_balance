import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: (walletAddress: string) => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "neuro:users";
const SESSION_KEY = "neuro:session";

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function stripPassword({ password: _password, ...rest }: StoredUser): User {
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore session on first load.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore corrupt session */
    }
  }, []);

  // Persist the active session and keep the users table in sync.
  function persistUser(next: User | null) {
    setUser(next);
    if (next) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      const users = loadUsers();
      const idx = users.findIndex((u) => u.id === next.id);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...next };
        saveUsers(users);
      }
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users = loadUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!match || match.password !== password) {
      throw new Error("Invalid email or password");
    }
    persistUser(stripPassword(match));
  };

  const register = async (email: string, name: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists");
    }
    const newUser: StoredUser = {
      id: "user-" + Date.now(),
      email,
      name,
      password,
    };
    saveUsers([...users, newUser]);
    persistUser(stripPassword(newUser));
  };

  const logout = () => persistUser(null);

  const connectWallet = (walletAddress: string) => {
    if (user) persistUser({ ...user, walletAddress });
  };

  const disconnectWallet = () => {
    if (user) {
      const { walletAddress: _drop, ...rest } = user;
      persistUser(rest);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
