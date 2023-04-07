import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export async function signUserInViaGoogle() {
  try {
    await signInWithPopup(auth, googleProvider);
    window.location.href = "/profile";
  } catch (error) {}
}

export async function signUserOut() {
  try {
    await signOut(auth);
    window.location.href = "/login";
  } catch (error) {}
}
