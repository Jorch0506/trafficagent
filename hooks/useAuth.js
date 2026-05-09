// hooks/useAuth.js
// Maneja la sesión del usuario y sus datos completos desde Supabase

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // datos completos de la tabla users
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("plan, analyses_used, analyses_limit, subscription_status")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }
    if (data) setUserData(data);
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Escuchar cambios de sesión
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

  // Exponer datos individuales para conveniencia
  const userPlan = userData?.plan || "free";
  const analysesUsed = userData?.analyses_used ?? 0;
  const analysesLimit = userData?.analyses_limit ?? 1;

  return {
    user,
    userData,
    userPlan,
    analysesUsed,
    analysesLimit,
    loading,
    logout,
    refetchUserData: () => user?.id && fetchUserData(user.id),
  };
}
