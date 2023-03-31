import { deleteDoc, doc } from "firebase/firestore";
import {
  auth,
  db,
  firestore,
  googleProvider,
  serverTimestamp,
} from "./firebase";

import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";

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

export async function updateDocumentOrderInDB(movies: any, listname: string) {
  try {
    movies?.forEach(async (movie: any, index: any) => {
      let position = index;
      const prerviousDoc = await firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection(listname)
        .where("movieId", "==", movie.movieId)
        .limit(1)
        .get();
      const thing = prerviousDoc.docs[0];
      let tmp = thing.data();
      tmp.order = position;
      thing.ref.update(tmp);
    });
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function deleteMovieFromDB(id: any, listname: any) {
  try {
    const movieDoc = doc(
      // @ts-ignore
      db,
      "users",
      auth.currentUser?.uid,
      listname,
      id.toString()
    );
    await deleteDoc(movieDoc);
    toast.success(`Movie deleted from ${listname}`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function deleteCollection(name: any, uid: string) {
  const res = await fetch(
    "https://us-central1-fir-todo-9081a.cloudfunctions.net/deleteCollection",
    {
      method: "POST",
      body: JSON.stringify({
        req: {
          collection: name,
          userId: uid,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}

async function getCollectionSize(collectionName: string) {
  const querySnapshot = await firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection(collectionName)
    .get();
  return querySnapshot.size;
}

// export async function addMovieToCollection(movie: any, collectionName: any) {
//   try {
//     const sizeForCount = await getCollectionSize(collectionName);
//     await firestore
//       .collection("users")
//       .doc(auth.currentUser?.uid)
//       .collection(collectionName)
//       .doc(movie.id.toString())
//       .set({
//         movieId: movie.id,
//         movieTitle: movie.title,
//         image: movie.poster_path,
//         order: sizeForCount || 0,
//         createdAt: serverTimestamp(),
//       });
//     toast.success(`${movie.title} added to ${collectionName}`);
//   } catch (error) {
//     toast.error(`Something went wrong...`);
//   }
// }

export async function addMovieToCollection(movie: any, collectionName: any) {
  const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
  const collectionDocRef = userDocRef
    .collection(collectionName)
    .doc(movie.id.toString());

  try {
    const sizeForCount = await getCollectionSize(collectionName);
    await collectionDocRef.set({
      movieId: movie.id,
      movieTitle: movie.title,
      image: movie.poster_path,
      order: sizeForCount || 0,
      createdAt: serverTimestamp(),
    });
    updateRecentCollection(userDocRef, collectionName);
    toast.success(`${movie.title} added to ${collectionName}`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function createAndAddToCollection({
  movie,
  newCollectionName,
}: any) {
  try {
    const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
    const collectionRef = userDocRef.collection(
      newCollectionName.replace(/\s+/g, " ").trim()
    );
    const sizeForCount = await getCollectionSize(newCollectionName);
    await collectionRef.doc(movie.id.toString()).set({
      movieId: movie.id,
      movieTitle: movie.title,
      image: movie.poster_path,
      order: sizeForCount ?? 0,
      createdAt: serverTimestamp(),
    });
    updateRecentCollection(userDocRef, newCollectionName);

    toast.success(`${movie.title}  added to ${newCollectionName}`);
  } catch (error) {
    toast.error(`Something went wrong: ${error}`);
  }
}

async function updateRecentCollection(userDocRef: any, collectionName: any) {
  try {
    const userDoc = await userDocRef.get();
    const recentCollection = userDoc.get("recentCollection") || [];

    const index = recentCollection.indexOf(collectionName);
    if (index !== -1) {
      // Move existing item to first position of array
      recentCollection.splice(index, 1);
      recentCollection.unshift(collectionName);
    } else {
      // Add new item to beginning of array
      recentCollection.unshift(collectionName);
      // Remove oldest item if array length exceeds 3
      if (recentCollection.length > 3) {
        recentCollection.pop();
      }
    }

    await userDocRef.update({ recentCollection });
    console.log("Updated array field:", recentCollection);
  } catch (error) {
    console.error("Error updating array field:", error);
  }
}
