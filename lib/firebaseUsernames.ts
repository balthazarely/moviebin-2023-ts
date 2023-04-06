import { auth, firestore } from "./firebase";
import toast from "react-hot-toast";

export async function addOrUpdateCustomUsername(username: string) {
  const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
  const usernameDocRef = firestore.collection("usernames").doc(username);

  try {
    const batch = firestore.batch();

    batch.update(userDocRef, {
      username: username,
      usernameRef: usernameDocRef,
    });

    const querySnapshot = await firestore
      .collection("usernames")
      .where("userId", "==", auth.currentUser?.uid)
      .get();

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.set(usernameDocRef, {
      username: username,
      userId: auth.currentUser?.uid,
      userRef: userDocRef,
    });

    await batch.commit();
    toast.success(`Username updated`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function updateThemeInFirebase(theme: string) {
  const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
  try {
    userDocRef.update({
      theme: theme,
    });
    toast.success(`Theme updated to ${theme}`);
  } catch (error) {}
}
