import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// updates user role and onboarding status in Firestore
export const completeUserOnboarding = async (uid: string, selectedRole: string, fullName: string) => {

  const userRef = doc(db, 'users', uid);
  
  try {
    await updateDoc(userRef, {
      role: selectedRole,
      onboarding: true,
      fullName: fullName
    });
    
    console.log("Onboarding complete! Role set to:", selectedRole);
  } catch (error) {
    console.error("Error updating onboarding status: ", error);
    throw error;
  }
};