import { 
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import { auth } from "./firebase";

// Google Login
export const doSignInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Logout
export const doLogout = () => {
  return signOut(auth);
};
