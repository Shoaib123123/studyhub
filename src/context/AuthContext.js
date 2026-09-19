import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const getCurrentSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
      }

      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email, password) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error("Supabase is not configured."),
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return {
      data,
      error,
    };
  };

  const login = async (email, password) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error("Supabase is not configured."),
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      data,
      error,
    };
  };

  const logout = async () => {
    if (!supabase) {
      return {
        error: new Error("Supabase is not configured."),
      };
    }

    const { error } = await supabase.auth.signOut();

    return {
      error,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
