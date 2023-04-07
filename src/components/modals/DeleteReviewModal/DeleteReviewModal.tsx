import { useContext } from "react";
import { HiX } from "react-icons/hi";
import { UIContext } from "../../../../lib/context";
import { deleteMovieReviewToDB } from "../../../../lib/firebaseReviews";

export function DeleteReviewModal({ movieTitle, movieId, reviewId }: any) {
  async function deleteReview(reviewId: string) {
    try {
      await deleteMovieReviewToDB(movieId, movieTitle, reviewId);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {}
  }

  const { dispatch } = useContext(UIContext);
  return (
    <div className=" relative  h-full w-full text-center">
      <h3 className="text-lg font-bold">
        Are you sure you want to delete your review?
      </h3>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => deleteReview(reviewId)}
          className={`btn-error btn`}
        >
          Proceed
        </button>
      </div>
      <button
        className="btn-ghost btn-sm btn absolute -top-4 -right-4 border-none  "
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
    </div>
  );
}
