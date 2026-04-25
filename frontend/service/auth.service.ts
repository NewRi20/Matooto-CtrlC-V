import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  getAdditionalUserInfo,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from './firebaseConfig';

type SaveUserProfile = {
  role?: string;
};

// saves authenticated user to Firestore if they don't already exist
export const saveUserToFirestore = async (
  authUser: User,
  profile?: SaveUserProfile
) => {
  if (!authUser) return;

  const userRef = doc(db, 'users', authUser.uid);

  try {
    const userSnap = await getDoc(userRef);
    const existingData = userSnap.exists() ? userSnap.data() : {};

    const userData: Record<string, unknown> = {
      email: authUser.email,
      fullName: authUser.displayName,
      createdAt: serverTimestamp(),
    };

    if (profile?.role !== undefined) {
      userData.role = profile.role;
    } else if (!userSnap.exists() && existingData.role === undefined) {
      userData.role = '';
    }

    if (profile?.role !== undefined && existingData.onboarding === undefined) {
      userData.onboarding = false;
    }

    await setDoc(
      userRef,
      userData,
      { merge: true }
    );

    console.log('User profile saved to Firestore.');
  } catch (error) {
    console.error('Error saving user to Firestore: ', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return {
      fullName: '',
      email: null,
      role: '',
      onboarding: false,
    };
  }

  const data = userSnap.data();

  return {
    fullName: typeof data.fullName === 'string' ? data.fullName : '',
    email: typeof data.email === 'string' ? data.email : null,
    role: data.role === 'Teacher' || data.role === 'Student' ? data.role : '',
    onboarding: Boolean(data.onboarding),
  };
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