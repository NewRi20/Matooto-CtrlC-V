import { doc, getDoc,serverTimestamp,  setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "./firebaseConfig";

// saves authenticated user to Firestore if they don't already exist
export const saveUserToFirestore = async (authUser: User) => {
  if (!authUser) return;

  const userRef = doc(db, "users", authUser.uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: authUser.email,
        fullName: authUser.displayName,
        role: "", 
        createdAt: serverTimestamp(),
        onboarding: false
      });
      console.log("New user successfully saved to Firestore!");
    } else {
      console.log("User already exists in Firestore. No action needed.");
    }
  } catch (error) {
    console.error("Error saving user to Firestore: ", error);
    throw error; 
  }
};