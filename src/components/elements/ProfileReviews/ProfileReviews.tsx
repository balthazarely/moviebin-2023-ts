import { DeleteReviewModal, ReviewMovieModal } from "@/components/modals";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { UIContext } from "../../../../lib/context";
import { auth, firestore } from "../../../../lib/firebase";
import { convertToDate } from "../../../../lib/utils";
import { ModalWrapper } from "../ModalWrapper";

export function ProfileReviews({ reviewDataWithId }: any) {
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  // const reviewRef = firestore
  //   .collection("usersreviews")
  //   .doc(user?.uid?.toString())
  //   .collection("reviews");
  // // @ts-ignore
  // const [reviewData] = useCollection(reviewRef);
  const { dispatch } = useContext(UIContext);
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<any>();

  // const documentSnapshots = reviewData?.docs as QueryDocumentSnapshot[];
  // const reviewDataWithId = documentSnapshots?.map((doc: any) => {
  //   return { reviewId: doc.id, ...doc.data() };
  // });

  return (
    <div className="grid w-full grid-cols-1 gap-2">
      {reviewDataWithId?.map((review: any, idx: number) => {
        return (
          <div key={idx} className="relative rounded-lg bg-base-200 p-2">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-1 flex items-start justify-center ">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${review?.movieImage}`}
                  alt={review.movieTitle}
                  width={80}
                  height={100}
                  className=" block aspect-2/3 object-contain sm:fixed"
                />
              </div>
              <div className="col-span-5">
                <div className="text-sm font-bold">{review?.movieTitle}</div>
                <div className="rating rating-xs">
                  {Array(review?.rating)
                    .fill(0)
                    .map((star: any) => {
                      return (
                        <input
                          type="radio"
                          disabled
                          name="rating-2"
                          className="mask mask-star-2 bg-accent "
                        />
                      );
                    })}
                </div>
                <div className="mt-2 text-sm">{review?.review}</div>
                <div className="my-4 border-b-2 border-base-100"></div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold italic ">
                    Reviewed on {convertToDate(review?.createdAt?.toDate())} by{" "}
                    <span>{review?.userDisplayName}</span>
                  </div>
                  <div className="flex justify-end  p-2">
                    <div className="btn-group">
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setModalTypeOpen("edit-review-modal");
                          dispatch({ type: "OPEN_MODAL" });
                        }}
                        className="btn-outline btn-xs  btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setModalTypeOpen("delete-review-modal");
                          dispatch({ type: "OPEN_MODAL" });
                        }}
                        className="btn-outline btn-xs btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <ModalWrapper>
        {modalTypeOpen === "edit-review-modal" && (
          <ReviewMovieModal
            modalTypeOpen={modalTypeOpen}
            movieTitle={selectedReview?.movieTitle}
            movieId={selectedReview?.movieId}
            movieImage={selectedReview?.movieImage}
            reviewToEdit={selectedReview}
            reviewToEditIdId={selectedReview.reviewReferenceId}
          />
        )}

        {modalTypeOpen === "delete-review-modal" && (
          <DeleteReviewModal
            movieTitle={selectedReview?.movieTitle}
            movieId={selectedReview?.movieId}
            reviewId={selectedReview?.reviewReferenceId}
          />
        )}
      </ModalWrapper>
    </div>
  );
}
