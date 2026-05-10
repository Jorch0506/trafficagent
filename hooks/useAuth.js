// hooks/useAuth.js
// Maneja sesión, datos del usuario y estado de onboarding

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("plan, analyses_used, analyses_limit, subscription_status, onboarding_completed")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
    if (data) setUserData(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
  };

  const markOnboardingComplete = () => {
    setUserData(prev => prev ? { ...prev, onboarding_completed: true } : prev);
  };

  return {
    user,
    userData,
    userPlan:          userData?.plan || "free",
    analysesUsed:      userData?.analyses_used ?? 0,
    analysesLimit:     userData?.analyses_limit ?? 1,
    onboardingDone:    userData?.onboarding_completed ?? true, // true por defecto para no mostrar a usuarios existentes mientras carga
    loading,
    logout,
    markOnboardingComplete,
    refetchUserData:   () => user?.id && fetchUserData(user.id),
  };
}
