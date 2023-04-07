import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../../lib/context";
import {
  addMovieReviewToDB,
  editMovieReviewInDB,
} from "../../../../lib/firebaseReviews";
import { HiX } from "react-icons/hi";

export function ReviewMovieModal({
  movieTitle,
  movieImage,
  movieId,
  modalTypeOpen,
  reviewToEdit,
  reviewToEditIdId,
}: any) {
  const { dispatch } = useContext(UIContext);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleRatingChange = (event: any) => {
    setSelectedRating(parseInt(event.target.value)); // update the selected rating state when a rating is clicked
  };

  async function submitReview() {
    try {
      setIsLoading(true);
      await addMovieReviewToDB(
        movieId,
        movieTitle,
        movieImage,
        reviewText,
        selectedRating
      );
      dispatch({ type: "CLOSE_MODAL" });
      setIsLoading(false);
    } catch (error) {}
  }

  async function editReview() {
    try {
      setIsLoading(true);
      await editMovieReviewInDB(
        movieId,
        movieTitle,
        reviewToEditIdId,
        reviewText,
        selectedRating
      );
      setIsLoading(false);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {}
  }

  useEffect(() => {
    if (modalTypeOpen === "edit-review-modal") {
      setReviewText(reviewToEdit?.review);
      setSelectedRating(reviewToEdit?.rating);
      console.log(reviewToEdit, "reviewToEdit");
    }
  }, [modalTypeOpen]);

  return (
    <div className=" relative  h-full w-full text-center">
      <button
        className="btn-ghost btn-sm btn absolute -top-4 -right-4 border-none  "
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
      <div className="grid grid-cols-4 gap-4">
        <Image
          src={`https://image.tmdb.org/t/p/w200${movieImage}`}
          alt={movieTitle}
          width={200}
          height={100}
          className=" col-span-1 aspect-2/3 object-contain"
        />
        <div className=" col-span-3 flex flex-col items-start gap-1">
          <div className="uppercase tracking-widest">
            {modalTypeOpen === "edit-review-modal"
              ? "Edit Review"
              : "Create Review"}
          </div>
          <h2 className="mb-2 text-xl font-bold">
            {movieTitle}
            {/* <span className=" font-normal">
              ({movie?.release_date.slice(0, 4)})
            </span> */}
          </h2>
          <label>Review</label>
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            className="textarea-primary textarea mb-2 h-44 w-full  "
          ></textarea>
          <label>Rating</label>
          <StarRating />
          <div className="mt-4 flex justify-center gap-4">
            <button
              disabled={reviewText?.length < 10}
              onClick={() =>
                modalTypeOpen === "edit-review-modal"
                  ? editReview()
                  : submitReview()
              }
              className={`btn-primary btn ${isLoading ? "loading" : ""} `}
            >
              {reviewText?.length < 10
                ? "Review must be more than 20 charactures"
                : modalTypeOpen === "edit-review-modal"
                ? "Edit Review"
                : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function StarRating() {
    return (
      <div className="rating" onClick={handleRatingChange}>
        <input
          readOnly
          type="radio"
          name="rating-2"
          className="mask mask-star-2 animate-none bg-accent"
          value="1"
          checked={selectedRating === 1}
        />
        <input
          readOnly
          type="radio"
          name="rating-2"
          className="mask mask-star-2 animate-none bg-accent"
          value="2"
          checked={selectedRating === 2}
        />
        <input
          readOnly
          type="radio"
          name="rating-2"
          className="mask mask-star-2 animate-none bg-accent"
          value="3"
          checked={selectedRating === 3}
        />
        <input
          readOnly
          type="radio"
          name="rating-2"
          className="mask mask-star-2 animate-none bg-accent"
          value="4"
          checked={selectedRating === 4}
        />
        <input
          readOnly
          type="radio"
          name="rating-2"
          className="mask mask-star-2 animate-none bg-accent"
          value="5"
          checked={selectedRating === 5}
        />
      </div>
    );
  }
}
