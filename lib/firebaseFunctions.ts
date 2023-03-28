import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, firestore, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

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
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Movie deleted from DB");
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

export async function addMovieToCollection(
  movie: any,
  collectionName: any,
  userId: any
) {
  try {
    let sizeForCount = await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection(collectionName)
      .get()
      .then(function (querySnapshot) {
        return querySnapshot.size;
      });

    await firestore
      .collection("users")
      .doc(auth.currentUser?.uid)
      .collection(collectionName)
      .doc(movie.id.toString())
      .set({
        movieId: movie.id,
        movieTitle: movie.title,
        image: movie.poster_path,
        order: sizeForCount ? sizeForCount : 0,
      });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("movie added to collection");
  }
}

export async function addMovieToNewCollection(
  movie: any,
  newCollectionName: any,
  userId: any
) {
  try {
    const data = {
      movieId: movie.id,
      movieTitle: movie.title,
      image: movie.poster_path,
    };
    await firestore
      .collection("users")
      .doc(userId)
      .collection(newCollectionName)
      .doc(movie.id.toString())
      .set(data);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("movie added to new collection");
  }
}
