import React, { createContext, useState, useEffect, useCallback } from "react";
import { supabase, isMockMode } from "@/lib/supabaseClient";

export interface User {
  id: string;
  auth_user_id?: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role?: string;
}

interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void | Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
}

const STORAGE_KEY = "kashi_user";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (!isMockMode() && !session.user.email_confirmed_at) {
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
            setIsLoading(false);
            return;
          }
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single();

          const mappedUser: User = {
            id: String(profile?.id || session.user.id),
            auth_user_id: session.user.id,
            fullName: profile?.display_name || profile?.fullName || session.user.user_metadata?.fullName || "Aditya Rai",
            username: profile?.username || session.user.user_metadata?.username || "aditya",
            email: session.user.email || "",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            role: profile?.role || "user",
          };
          setUser(mappedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Supabase session check failed:", err);
      }

      if (isMockMode()) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setUser(JSON.parse(stored));
          }
        } catch {}
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        if (!isMockMode() && !session.user.email_confirmed_at) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          return;
        }
        try {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single();

          const mappedUser: User = {
            id: String(profile?.id || session.user.id),
            auth_user_id: session.user.id,
            fullName: profile?.display_name || profile?.fullName || session.user.user_metadata?.fullName || "Aditya Rai",
            username: profile?.username || session.user.user_metadata?.username || "aditya",
            email: session.user.email || "",
            phone: profile?.phone || session.user.user_metadata?.phone || "",
            role: profile?.role || "user",
          };
          setUser(mappedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
        } catch {
          // keep existing user if query fails
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const email = identifier.includes("@") ? identifier : `${identifier}@kashi.in`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (!isMockMode() && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error("Please verify your email address before signing in.");
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", data.user.id)
        .single();

      const mappedUser: User = {
        id: String(profile?.id || data.user.id),
        auth_user_id: data.user.id,
        fullName: profile?.display_name || data.user.user_metadata?.fullName || "Aditya Rai",
        username: profile?.username || data.user.user_metadata?.username || "aditya",
        email: data.user.email || "",
        phone: profile?.phone || data.user.user_metadata?.phone || "",
        role: profile?.role || "user",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
      setUser(mappedUser);
    } catch (err: any) {
      if (err.message?.includes("Email not confirmed") || err.message?.includes("confirmation required")) {
        throw new Error("Please verify your email address before signing in.");
      }
      if (isMockMode()) {
        console.warn("Supabase login failed, using local mock fallback:", err);
        const mockUser: User = {
          id: "usr_1",
          fullName: "Aditya Rai",
          username: "aditya",
          email: identifier.includes("@") ? identifier : "aditya@kashi.in",
          phone: identifier.includes("@") ? undefined : identifier,
          role: "user",
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
      } else {
        throw new Error(err.message || "Failed to authenticate with Supabase.");
      }
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: data.fullName,
            full_name: data.fullName,
            fullName: data.fullName,
            username: data.username,
            phone: data.phone,
          }
        }
      });
      if (error) {
        if (error.message?.includes("Database error saving new user") || error.message?.includes("already registered")) {
          throw new Error("An account with this email, username, or phone number already exists. Please log in instead.");
        }
        throw error;
      }
      if (!signUpData.user) throw new Error("Registration returned no user details.");
    } catch (err: any) {
      if (isMockMode()) {
        console.warn("Supabase registration failed, using local mock fallback:", err);
      } else {
        const msg = err.message || "";
        if (msg.includes("Database error saving new user") || msg.includes("already registered")) {
          throw new Error("An account with this email, username, or phone number already exists. Please log in instead.");
        }
        throw new Error(msg || "Failed to register account with Supabase.");
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut failed:", err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedFields: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      if (prev.auth_user_id) {
        supabase.from("users")
          .update({
            display_name: updated.fullName,
            username: updated.username,
            phone: updated.phone,
          })
          .eq("auth_user_id", prev.auth_user_id)
          .then(({ error }) => {
            if (error) console.warn("Could not sync user profile update to Supabase public.users:", error);
          });
      }

      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
