import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from './firebaseConfig';

// updates user role and onboarding status in Firestore
export const completeUserOnboarding = async (uid: string, selectedRole: string, fullName: string) => {

  const userRef = doc(db, 'users', uid);
  
  try {
    await setDoc(
      userRef,
      {
      role: selectedRole,
      onboarding: true,
        fullName: fullName,
      },
      { merge: true }
    );

    if (auth.currentUser?.uid === uid) {
      await updateProfile(auth.currentUser, { displayName: fullName });
    }
    
    console.log('Onboarding complete! Role set to:', selectedRole);
  } catch (error) {
    console.error('Error updating onboarding status: ', error);
    throw error;
  }
};