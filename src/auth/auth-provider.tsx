"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi, clearAuthSession, getAuthSession, type AuthUser } from "./client";

type AuthContextValue = {
  user: AuthUser;
  can(permission: string): boolean;
  signOut(): Promise<void>;
  changePassword(currentPassword: string, password: string, passwordConfirmation: string): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let active = true;
    if (!getAuthSession()) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    authApi.profile()
      .then((profile) => { if (active) setUser(profile); })
      .catch(() => {
        clearAuthSession();
        if (active) router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      });
    return () => { active = false; };
  }, [pathname, router]);

  useEffect(() => {
    const redirect = () => router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    window.addEventListener("doctor-tracker-auth-expired", redirect);
    return () => window.removeEventListener("doctor-tracker-auth-expired", redirect);
  }, [pathname, router]);

  const value = useMemo<AuthContextValue | null>(() => user ? {
    user,
    can: (permission) => user.permissions.includes(permission),
    changePassword: async (currentPassword, password, passwordConfirmation) => {
      await authApi.changePassword(currentPassword, password, passwordConfirmation);
      router.replace("/signin");
    },
    signOut: async () => {
      try {
        await authApi.signOut();
      } finally {
        router.replace("/signin");
      }
    },
  } : null, [router, user]);

  if (!value) return <div className="grid min-h-screen place-items-center bg-base-200" data-theme="forest"><span className="loading loading-spinner loading-lg text-primary" aria-label="Checking authentication" /></div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
