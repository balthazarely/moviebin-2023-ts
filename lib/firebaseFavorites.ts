import { auth, firestore, serverTimestamp } from "./firebase";
import toast from "react-hot-toast";

export async function addOrRemoveMovieToFavorites(movie: any) {
  const userReviewRef = firestore
    .collection("usersfavorites")
    .doc(auth.currentUser?.uid);
  const userReviewDoc = userReviewRef
    .collection("favorites")
    .doc(movie.id.toString());

  try {
    const doc = await userReviewDoc.get();
    if (doc.exists) {
      await userReviewDoc.delete();
      toast.success(`${movie.title} removed from favorites`);
    } else {
      await userReviewDoc.set({
        title: movie.title,
        id: movie.id,
        poster_path: movie.poster_path,
        createdAt: serverTimestamp(),
      });
      toast.success(`${movie.title} added to favorites`);
    }
  } catch (error) {
    toast.error(`Something went wrong...`);
  }
}
