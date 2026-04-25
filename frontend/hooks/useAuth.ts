import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/service/firebaseConfig';
import {
  saveUserToFirestore,
  signInWithEmail,
  signUpWithEmail,
} from '@/service/auth.service';

type UserRole = 'Student' | 'Teacher' | '';

type UseAuthResult = {
  user: User | null;
  initializing: boolean;
  userRole: UserRole;
  onboardingComplete: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (
    email: string,
    password: string,
    profile?: { role?: string }
  ) => Promise<User>;
  logout: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await saveUserToFirestore(currentUser);

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.exists() ? userSnap.data() : {};

        const savedRole = data.role;
        const savedOnboarding = data.onboarding;

        setUserRole(savedRole === 'Teacher' || savedRole === 'Student' ? savedRole : '');
        setOnboardingComplete(Boolean(savedOnboarding));
      } else {
        setUserRole('');
        setOnboardingComplete(false);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmailCredential = async (email: string, password: string) => {
    const signedInUser = await signInWithEmail(email, password);
    setUser(signedInUser);
    return signedInUser;
  };

  const signUpWithEmailCredential = async (
    email: string,
    password: string,
    profile?: { role?: string }
  ) => {
    const signedInUser = await signUpWithEmail(email, password, profile);
    setUser(signedInUser);
    return signedInUser;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return {
    user,
    initializing,
    userRole,
    onboardingComplete,
    signInWithEmail: signInWithEmailCredential,
    signUpWithEmail: signUpWithEmailCredential,
    logout,
  };
}