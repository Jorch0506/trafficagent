// hooks/useAuth.js
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useAuth() {
  const [user, setUser]         = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);

  // Evitar que onboarding parpadee al volver a la pestaña
  const onboardingShownRef = useRef(false);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("plan, analyses_used, analyses_limit, subscription_status, onboarding_completed")
      .eq("id", userId)
      .single();
    if (error) { console.error("Error fetching user data:", error); return; }
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
        // Solo refetch si no tenemos userData aún (evita reset al cambiar pestaña)
        setUserData(prev => {
          if (!prev) fetchUserData(session.user.id);
          return prev;
        });
      } else {
        setUser(null);
        setUserData(null);
        onboardingShownRef.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
    onboardingShownRef.current = false;
  };

  const markOnboardingComplete = () => {
    onboardingShownRef.current = true;
    setUserData(prev => prev ? { ...prev, onboarding_completed: true } : prev);
  };

  // onboardingDone es true si:
  // 1. Aún estamos cargando (para no mostrar antes de saber)
  // 2. El usuario ya lo completó en DB
  // 3. Ya lo marcamos como mostrado en esta sesión
  const onboardingDone =
    loading ||
    (userData?.onboarding_completed ?? true) ||
    onboardingShownRef.current;

  return {
    user,
    userData,
    userPlan:        userData?.plan || "free",
    analysesUsed:    userData?.analyses_used ?? 0,
    analysesLimit:   userData?.analyses_limit ?? 1,
    onboardingDone,
    loading,
    logout,
    markOnboardingComplete,
    refetchUserData: () => user?.id && fetchUserData(user.id),
  };
}
