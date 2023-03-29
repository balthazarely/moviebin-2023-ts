import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, firestore, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";

export async function signUserInViaGoogle() {
  await signInWithPopup(auth, googleProvider);
}

export function signUserOut() {
  signOut(auth);
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
    console.log(error);
  } finally {
    console.log("db written success");
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
    console.log(error);
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

export async function addMovieToCollection(movie: any, collectionName: any) {
  try {
    const sizeForCount = await getCollectionSize(collectionName);
    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection(collectionName)
      .doc(movie.id.toString())
      .set({
        movieId: movie.id,
        movieTitle: movie.title,
        image: movie.poster_path,
        order: sizeForCount || 0,
      });
    toast.success(`${movie.title} added to ${collectionName}`);
  } catch (error) {
    console.log(error);
    toast.error(`Something went wrong...`);
  } finally {
    console.log("movie added to collection");
  }
}

export async function createAndAddToCollection({
  movie,
  newCollectionName,
  nestedCollections,
  setDbError,
}: any) {
  if (!nestedCollections?.includes(newCollectionName)) {
    try {
      const collectionRef = firestore
        .collection("users")
        .doc(auth.currentUser?.uid)
        .collection(newCollectionName);
      const sizeForCount = await getCollectionSize(newCollectionName);
      await collectionRef.doc(movie.id.toString()).set({
        movieId: movie.id,
        movieTitle: movie.title,
        image: movie.poster_path,
        order: sizeForCount ?? 0,
      });

      toast.success(`${movie.title}  added to ${newCollectionName}`);
    } catch (error) {
      setDbError(JSON.stringify(error));
      toast.error(`Something went wrong: ${error}`);
    }
  } else {
    console.error("List already exists");
    setDbError("List already exists");
  }
}
