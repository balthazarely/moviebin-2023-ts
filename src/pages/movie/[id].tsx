import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db, firestore } from "../../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getMovie } from "../../../lib/api";

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState<any>();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<string>();
  // @ts-ignore

  const [user] = useAuthState(auth);

  // const docRef = firestore.collection("movies").doc(id);
  const query = collection(db, "movies", `${id}/reviews`);
  const [userReviews, loading, error] = useCollection(query);
  const formattedReview: any = userReviews?.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  // useEffect(() => {
  //   if (userReviews) {
  //     console.log(formattedReview);
  //   }
  // }, [userReviews]);

  useEffect(() => {
    async function getMovieData() {
      let movie: any = await getMovie(id);
      console.log(movie);
      setMovie(movie);
    }
    if (id) {
      getMovieData();
    }
  }, [id]);

  async function createNewReview(movie: any) {
    const docRef = firestore
      .collection("movies")
      .doc(movie.id.toString())
      .collection("reviews");

    const userReviewRef = firestore
      .collection("userreviews")
      .doc(auth.currentUser?.uid)
      .collection("reviews");

    try {
      const querySnapshot = await docRef
        .where("userId", "==", auth.currentUser?.uid)
        .get();

      if (!querySnapshot.empty) {
        console.log("you've already left a review");
      } else {
        firestore
          .collection("movies")
          .doc(movie.id.toString())
          .collection("reviews")
          .doc()
          .set({
            userId: auth.currentUser?.uid,
            userDisplayName: auth.currentUser?.displayName,
            comment: comment,
            rating: rating,
            timestamp: Date.now(),
          });

        await userReviewRef.doc().set({
          movieId: movie.id,
          movieTitle: movie.title,
          comment: comment,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.log("Error getting nested documents:", error);
    }
  }

  async function deleteReview(id: any) {
    try {
      const batch = firestore.batch();

      const docRef1 = firestore
        .collection("movies")
        .doc(movie.id.toString())
        .collection("reviews")
        .doc(id.toString());
      batch.delete(docRef1);

      const docRef2 = firestore
        .collection("userreviews")
        .doc(auth.currentUser?.uid)
        .collection("reviews")
        .where("movieId", "==", movie.id);
      const querySnapshot = await docRef2.get();
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("Batch deletion successful!");
    } catch (error) {
      console.error("Error removing documents: ", error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>{movie?.title}</h1>
      <h4>{movie?.tagline}</h4>

      <h3>Reviews</h3>
      {formattedReview?.map((review: any) => {
        return (
          <div>
            <div>
              {review.comment} : {review.rating} stars
              <span>
                {review.userId === user?.uid ? (
                  <button onClick={() => deleteReview(review.id)}>DEL</button>
                ) : (
                  <></>
                )}
              </span>
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: "16px" }}>
        <input
          placeholder="comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          type="number"
          placeholder="rating"
          onChange={(e) => setRating(e.target.value)}
        />

        <button disabled={!comment} onClick={() => createNewReview(movie)}>
          Submit
        </button>
      </div>
    </div>
  );
}
