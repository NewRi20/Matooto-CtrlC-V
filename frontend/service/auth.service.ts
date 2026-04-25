import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from './firebaseConfig';

type SaveUserProfile = {
  role?: string;
  classCode?: string;
};

// saves authenticated user to Firestore if they don't already exist
export const saveUserToFirestore = async (
  authUser: User,
  profile?: SaveUserProfile
) => {
  if (!authUser) return;

  const userRef = doc(db, 'users', authUser.uid);

  try {
    await setDoc(
      userRef,
      {
        email: authUser.email,
        fullName: authUser.displayName,
        role: profile?.role ?? '',
        classCode: profile?.classCode ?? '',
        createdAt: serverTimestamp(),
        onboarding: false,
      },
      { merge: true }
    );

    console.log('User profile saved to Firestore.');
  } catch (error) {
    console.error('Error saving user to Firestore: ', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  await saveUserToFirestore(result.user);
  return result.user;
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  profile?: SaveUserProfile
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  const displayName = email.split('@')[0] || email;
  await updateProfile(result.user, { displayName });

  await saveUserToFirestore(result.user, profile);
  return result.user;
};