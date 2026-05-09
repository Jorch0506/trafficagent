// hooks/useAuth.js
// Maneja la sesión del usuario y su plan activo

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userPlan, setUserPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  const fetchUserPlan = async (userId) => {
    const { data } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();
    if (data) setUserPlan(data.plan);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserPlan(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserPlan(session.user.id);
      } else {
        setUser(null);
        setUserPlan("free");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserPlan("free");
  };

  return { user, userPlan, loading, logout };
}

export { supabase };
