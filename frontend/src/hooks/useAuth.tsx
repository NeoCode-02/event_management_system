import React from 'react';

type User = {
  id: string;
  email: string;
  is_admin: boolean;
  is_confirmed: boolean;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<{ needsVerification: boolean; email: string }>; 
  verify: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'ems_access_token';
const REFRESH_TOKEN_KEY = 'ems_refresh_token';
const EMAIL_KEY = 'ems_email';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY));

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? 'Login failed');
    setTokens(data.access_token, data.refresh_token);
    await fetchMe();
  };

  const register = async (email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? 'Registration failed');
    localStorage.setItem(EMAIL_KEY, email);
    const detail: string = (data as any)?.detail ?? '';
    const needsVerification = !detail.toLowerCase().includes('first user');
    return { needsVerification, email };
  };

  const verify = async (email: string, code: string) => {
    const res = await fetch('/api/auth/verify-code/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? 'Verification failed');
  };

  const resendCode = async (email: string) => {
    const res = await fetch('/api/auth/resend-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as any)?.detail ?? 'Failed to resend verification code');
  };

  const fetchMe = async () => {
    if (!accessToken) return;
    const res = await fetch('/api/auth/me/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.ok) {
      const me = await res.json();
      setUser(me);
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  React.useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const value: AuthContextValue = { user, accessToken, login, register, verify, resendCode, logout, fetchMe };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}


