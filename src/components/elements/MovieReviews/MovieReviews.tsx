import { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { convertToDate } from "../../../../lib/utils";

export function MovieReviews({
  reviewData,
  loggedInUser,
  setModalTypeOpen,
}: any) {
  const { dispatch } = useContext(UIContext);

  const checkIfUserReviewExists = () => {
    return !reviewData?.some(
      (review: any) => review.userId === loggedInUser?.uid
    );
  };

  console.log(reviewData);

  return (
    <div className="mt-8 mb-16 grid grid-cols-1 gap-2">
      <div className="flex w-full items-center justify-between ">
        <h1 className="text-xl font-extrabold">Reviews</h1>
        {checkIfUserReviewExists() && (
          <button
            className="btn-outline  btn-sm btn"
            onClick={() => {
              setModalTypeOpen("review-modal");
              dispatch({ type: "OPEN_MODAL" });
            }}
          >
            Write Review
          </button>
        )}
      </div>
      <div className="border-b-2 border-base-100"></div>

      {reviewData?.map((review: any, idx: number) => {
        return (
          <div key={idx} className="relative rounded-lg bg-base-200 p-2">
            {loggedInUser?.uid === review.userId && (
              <div className="op-2 badge badge-primary badge-sm absolute right-2">
                My Review
              </div>
            )}

            <div className="text-sm">
              Reviewed by{" "}
              <span className="font-bold">{review?.userDisplayName}</span>
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
            <div className=" text-xs font-semibold italic ">
              Reviewed on {convertToDate(review?.createdAt?.toDate())}
            </div>
            {loggedInUser?.uid === review.userId && (
              <div className="mt-2 flex w-full justify-end ">
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
