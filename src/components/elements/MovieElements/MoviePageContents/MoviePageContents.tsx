import { DeleteReviewModal, ReviewMovieModal } from "@/components/modals";
import { QueryDocumentSnapshot } from "firebase/firestore";
import React, { useCallback, useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { UIContext } from "../../../../../lib/context";
import { auth, FirebaseUser, firestore } from "../../../../../lib/firebase";
import { Review } from "../../../../../lib/types";
import { MovieReviews } from "../../MovieReviews";
import {
  AddMovieCollectionButton,
  AddMovieFavoritesButton,
  ModalWrapper,
} from "../../UIElements";
import { SimilarMovies } from "../SimilarMovies";

export function MoviePageContents({ movie, similarMovies }: any) {
  const { dispatch } = useContext(UIContext);
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");

  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const reviewRef = firestore
    .collection("movies")
    .doc(movie?.id?.toString())
    .collection("reviews");
  // @ts-ignore
  const [reviewData, reviewDataLoading] = useCollection(reviewRef);

  const documentSnapshots = reviewData?.docs as QueryDocumentSnapshot[];
  const reviewDataWithId = documentSnapshots?.map((doc: any) => {
    return { reviewId: doc.id, ...doc.data() };
  });

  const openModalTest = useCallback(() => {
    setModalTypeOpen("review-modal");
    dispatch({ type: "OPEN_MODAL" });
  }, [dispatch]);

  const reviewForEdit = reviewDataWithId?.find(
    (review: Review) => review.userId === user?.uid
  );

  return (
    <div>
      <div className="z-50 mb-12 flex w-full  justify-center gap-2  sm:col-span-2 sm:mt-0">
        <AddMovieCollectionButton movie={movie} />
        <AddMovieFavoritesButton movie={movie} />
      </div>

      <MovieReviews
        openModalTest={openModalTest}
        setModalTypeOpen={setModalTypeOpen}
        loggedInUser={user}
        reviewData={reviewDataWithId}
        reviewDataLoading={reviewDataLoading}
      />
      <SimilarMovies similarMovies={similarMovies} />

      <ModalWrapper>
        {modalTypeOpen === "review-modal" && (
          <ReviewMovieModal
            modalTypeOpen={modalTypeOpen}
            movieTitle={movie.title}
            movieId={movie.id}
            movieImage={movie.poster_path}
            reviewToEdit={reviewForEdit}
          />
        )}
        {modalTypeOpen === "edit-review-modal" && (
          <ReviewMovieModal
            modalTypeOpen={modalTypeOpen}
            movieTitle={movie.title}
            movieId={movie.id}
            movieImage={movie.poster_path}
            reviewToEdit={reviewForEdit}
            reviewToEditIdId={reviewForEdit.reviewId}
          />
        )}

        {modalTypeOpen === "delete-review-modal" && (
          <DeleteReviewModal
            movieTitle={movie.title}
            movieId={movie.id}
            reviewId={reviewForEdit?.reviewId}
          />
        )}
      </ModalWrapper>
    </div>
  );
}
