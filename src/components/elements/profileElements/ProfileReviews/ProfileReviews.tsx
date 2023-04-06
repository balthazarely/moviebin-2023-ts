import { DeleteReviewModal, ReviewMovieModal } from "@/components/modals";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { UIContext } from "../../../../../lib/context";
import { convertToDate } from "../../../../../lib/utils";
import { FullPageLoader } from "../../UIElements/FullPageLoader";
import { ModalWrapper } from "../../UIElements/ModalWrapper";

export function ProfileReviews({ reviewDataWithId, reviewDataLoading }: any) {
  const { dispatch } = useContext(UIContext);
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<any>();

  if (reviewDataLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-2">
      {reviewDataWithId?.length !== 0 ? (
        <>
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
                    <div className="text-sm font-bold">
                      {review?.movieTitle}
                    </div>
                    <div className="rating rating-xs">
                      {Array(review?.rating)
                        .fill(0)
                        .map((star: any, idx: number) => {
                          return (
                            <input
                              key={idx}
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
                        Reviewed on {convertToDate(review?.createdAt?.toDate())}{" "}
                        by <span>{review?.userDisplayName}</span>
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
        </>
      ) : (
        <div className="h-44  w-full ">
          <div className="flex h-full flex-col items-center justify-center gap-2 ">
            <div className="text-xl font-bold">No Reviews Yet!</div>
            <div className="text-sm font-normal">
              To review a movie, go to the movie page and add your review.
            </div>
          </div>
        </div>
      )}

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
