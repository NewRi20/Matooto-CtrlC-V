import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';

import { auth } from '@/service/firebaseConfig';
import {
  saveUserToFirestore,
  signInWithEmail,
  signUpWithEmail,
} from '@/service/auth.service';

type UseAuthResult = {
  user: User | null;
  initializing: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    profile?: { role?: string; classCode?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await saveUserToFirestore(currentUser);
      }
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmailCredential = async (email: string, password: string) => {
    const signedInUser = await signInWithEmail(email, password);
    setUser(signedInUser);
  };

  const signUpWithEmailCredential = async (
    email: string,
    password: string,
    profile?: { role?: string; classCode?: string }
  ) => {
    const signedInUser = await signUpWithEmail(email, password, profile);
    setUser(signedInUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return {
    user,
    initializing,
    signInWithEmail: signInWithEmailCredential,
    signUpWithEmail: signUpWithEmailCredential,
    logout,
  };
}