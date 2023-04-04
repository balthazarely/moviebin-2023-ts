import { deleteDoc, doc, setDoc } from "firebase/firestore";
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
    window.location.href = "/collections";
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

export async function addMovieReviewToDB(
  movieId: any,
  moveTitle: any,
  movePoster: any,
  reviewBody: any,
  reviewRating: any
) {
  console.log(reviewBody, reviewRating);

  const reviewRef = firestore.collection("movies").doc(movieId.toString());
  const reviewDoc = reviewRef.collection("reviews").doc();

  const userReviewRef = firestore
    .collection("usersreviews")
    .doc(auth.currentUser?.uid);
  const userReviewDoc = userReviewRef
    .collection("reviews")
    .doc(movieId.toString());
  try {
    await reviewDoc.set({
      review: reviewBody,
      rating: reviewRating,
      userId: auth.currentUser?.uid,
      userDisplayName: auth.currentUser?.displayName,
      movieTitle: moveTitle,
      movieId: movieId,
      movieImage: movePoster,
      createdAt: serverTimestamp(),
    });

    const reviewReferenceId = reviewDoc.id;
    await userReviewDoc.set({
      review: reviewBody,
      rating: reviewRating,
      userId: auth.currentUser?.uid,
      userDisplayName: auth.currentUser?.displayName,
      movieTitle: moveTitle,
      movieId: movieId,
      movieImage: movePoster,
      reviewReferenceId,
      createdAt: serverTimestamp(),
    });

    toast.success(`Review added for ${moveTitle}`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function deleteMovieReviewToDB(
  movieId: any,
  movieTitle: any,
  reviewId: any
) {
  try {
    console.log(reviewId);

    const reviewDoc = doc(
      // @ts-ignore
      db,
      "movies",
      movieId.toString(),
      "reviews",
      reviewId.toString()
    );
    const userReviewDoc = doc(
      // @ts-ignore
      db,
      "usersreviews",
      auth.currentUser?.uid,
      "reviews",
      movieId.toString()
    );
    await deleteDoc(reviewDoc);
    await deleteDoc(userReviewDoc);
    toast.success(`Review deleted for ${movieTitle}`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function editMovieReviewInDB(
  movieId: any,
  moveTitle: any,
  reviewId: any,
  reviewBody: any,
  reviewRating: any
) {
  console.log(movieId, "movieId");
  console.log(moveTitle, "moveTitle");
  console.log(reviewId, "reviewId");
  console.log(reviewBody, "reviewBody");
  console.log(reviewRating, "reviewRating");

  const reviewRef = firestore.collection("movies").doc(movieId.toString());
  const reviewDocCreate = reviewRef.collection("reviews").doc(reviewId);

  const userReviewRef = firestore
    .collection("usersreviews")
    .doc(auth.currentUser?.uid);
  const userReviewDocCreate = userReviewRef
    .collection("reviews")
    .doc(movieId.toString());

  try {
    await setDoc(
      reviewDocCreate,
      { review: reviewBody, rating: reviewRating },
      { merge: true }
    );

    await setDoc(
      userReviewDocCreate,
      { review: reviewBody, rating: reviewRating },
      { merge: true }
    );
    toast.success(`Review updated for ${moveTitle}`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function deleteCollection(collectionName: any) {
  try {
    const res = await fetch(
      "https://us-central1-fir-todo-9081a.cloudfunctions.net/deleteCollection",
      {
        method: "POST",
        body: JSON.stringify({
          req: {
            collection: collectionName,
            userId: auth.currentUser?.uid,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await res.json();
    window.location.href = "/collections";
    toast.success(`${collectionName} deleted`);
    return response;
  } catch (error) {}
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
    await collectionRef.doc("metadata").set({
      type: "metadata",
      collectionName: newCollectionName,
      description: "",
      createdAt: serverTimestamp(),
      lastEditedAt: serverTimestamp(),
    });
    updateRecentCollection(userDocRef, newCollectionName);

    toast.success(`${movie.title}  added to ${newCollectionName}`);
  } catch (error) {
    toast.error(`Something went wrong: ${error}`);
  }
}

export async function updateCollectionMetadata(
  collectionName: any,
  descriptionText: string
) {
  const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
  const collectionDocRef = userDocRef
    .collection(collectionName)
    .doc("metadata");

  try {
    await setDoc(
      collectionDocRef,
      { description: descriptionText },
      { merge: true }
    );
    toast.success(`Description successfully updated`);
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}

export async function createAndAddMultipleDocumentsToCollection(
  movies: any,
  newCollectionName: any
): Promise<any> {
  try {
    const userDocRef = firestore.collection("users").doc(auth.currentUser?.uid);
    // Need to check that this playlist doesnt by name, and if so, need to add some chars
    const collectionRef = userDocRef.collection(
      newCollectionName.replace(/\s+/g, " ").trim()
    );
    const sizeForCount = await getCollectionSize(newCollectionName);
    const promises = [];
    for (const movie of movies) {
      const promise = collectionRef.doc(movie.id.toString()).set({
        movieId: movie.id,
        movieTitle: movie.title,
        image: movie.poster_path,
        order: sizeForCount ?? 0,
        createdAt: serverTimestamp(),
      });
      promises.push(promise);
    }
    await Promise.all(promises);
    toast.success(`${movies.length} movies added to ${newCollectionName}`);
    return Promise.resolve(
      `${movies.length} movies added to ${newCollectionName}`
    );
  } catch (error) {
    toast.error(`Something went wrong: ${error}`);
    return Promise.reject(`Something went wrong: ${error}`);
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
