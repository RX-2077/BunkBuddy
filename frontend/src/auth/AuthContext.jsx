// src/auth/AuthContext.jsx
//
// Tracks the current Firebase Auth user and loads their student profile
// from Firestore, so the rest of the app knows whether onboarding is
// complete (doc section 7, step 5-6).

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Firebase Auth user
  const [profile, setProfile] = useState(null);  // Firestore students/{uid}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const profileRef = doc(db, "students", user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (snap) => {
      setProfile(snap.exists() ? snap.data() : null);
      setLoading(false);
    });

    return unsubscribeProfile;
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    onboardingComplete: !!profile?.onboardingComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
