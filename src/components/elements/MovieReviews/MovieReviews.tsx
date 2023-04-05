import { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { likeReviewInDB } from "../../../../lib/firebaseReviews";
import { convertToDate } from "../../../../lib/utils";
import { HiHeart } from "react-icons/hi";
import { FullPageLoader } from "../UIElements";

export function MovieReviews({
  reviewData,
  loggedInUser,
  openModalTest,
  reviewDataLoading,
  setModalTypeOpen,
}: any) {
  const { dispatch } = useContext(UIContext);

  const checkIfUserReviewExists = () => {
    return !reviewData?.some(
      (review: any) => review.userId === loggedInUser?.uid
    );
  };

  return (
    <div className="z-50 mb-16 mt-4 grid grid-cols-1 gap-2">
      <div className="flex w-full items-center justify-between ">
        <h1 className="text-xl font-extrabold">Reviews</h1>
        {checkIfUserReviewExists() && (
          <button
            className="btn-outline  btn-sm btn"
            onClick={() => {
              openModalTest();
              setModalTypeOpen("review-modal");
              dispatch({ type: "OPEN_MODAL" });
            }}
          >
            Write Review
          </button>
        )}
      </div>
      <div className="border-b-2 border-base-100"></div>

      {reviewDataLoading ? (
        <FullPageLoader />
      ) : (
        reviewData
          ?.sort(
            (a: any, b: any) => b.reviewLikes.length - a.reviewLikes.length
          )
          .map((review: any, idx: number) => {
            const doesUserLike = review?.reviewLikes?.some(
              (item: any) => item.userID === loggedInUser?.uid
            );

            return (
              <div key={idx} className="relative rounded-lg bg-base-200 p-2">
                {loggedInUser?.uid === review.userId && (
                  <div className="op-2 badge badge-primary badge-sm absolute right-2">
                    My Review
                  </div>
                )}

                <div className="text-sm">
                  Reviewed by{" "}
                  <span className="font-bold">{review?.userDisplayName}</span>{" "}
                  on {convertToDate(review?.createdAt?.toDate())}
                </div>
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
                {/* {loggedInUser?.uid === review.userId && ( */}
                <div className=" flex w-full items-center justify-between ">
                  <button
                    onClick={() =>
                      likeReviewInDB(review.movieId, review.reviewId)
                    }
                    className="btn-sm btn"
                  >
                    <HiHeart
                      className={`mr-2 ${
                        doesUserLike ? "text-accent" : "text-white"
                      } `}
                    />{" "}
                    {review?.reviewLikes?.length > 0 && (
                      <span className="text-sm">
                        {" "}
                        {review?.reviewLikes?.length}
                      </span>
                    )}
                  </button>
                  {loggedInUser?.uid === review.userId && (
                    <div className="btn-group">
                      <button
                        onClick={() => {
                          setModalTypeOpen("edit-review-modal");
                          dispatch({ type: "OPEN_MODAL" });
                        }}
                        className="btn-outline btn-xs  btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setModalTypeOpen("delete-review-modal");
                          dispatch({ type: "OPEN_MODAL" });
                        }}
                        className="btn-outline btn-xs btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}
