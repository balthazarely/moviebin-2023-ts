import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, firestore, serverTimestamp } from "./firebase";
import toast from "react-hot-toast";

export async function addMovieReviewToDB(
  movieId: any,
  moveTitle: any,
  movePoster: any,
  reviewBody: any,
  reviewRating: any
) {
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

export async function likeReviewInDB(movieId: any, reviewId: any) {
  const reviewRef = firestore.collection("movies").doc(movieId.toString());
  const reviewDocRef = reviewRef.collection("reviews").doc(reviewId);
  const userId = auth.currentUser?.uid;
  try {
    const reviewSnapshot = await getDoc(reviewDocRef);
    const reviewData = reviewSnapshot.data();
    const reviewLikes = reviewData?.reviewLikes || [];
    const likeIndex = reviewLikes.findIndex(
      (like: { userID: string }) => like.userID === userId
    );
    if (likeIndex > -1) {
      reviewLikes.splice(likeIndex, 1);
    } else {
      reviewLikes.push({ userID: userId });
    }
    await updateDoc(reviewDocRef, {
      reviewLikes: reviewLikes,
    });
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}
