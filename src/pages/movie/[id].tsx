import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";
import { PageWidthWrapper } from "@/components/layout";
import {
  AddMovieCollectionButton,
  AddMovieFavoritesButton,
  ModalWrapper,
  MovieReviews,
} from "@/components/elements";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, FirebaseUser, firestore } from "../../../lib/firebase";
import { useCallback, useContext, useState } from "react";
import {
  DeleteReviewModal,
  ReviewMovieModal,
  TestModal,
} from "@/components/modals";
import { UIContext } from "../../../lib/context";
import { QueryDocumentSnapshot } from "firebase/firestore";

interface IMovieProps {
  movie: Movie;
  imagesProps: ImageProps;
  movieCredits: any;
}

type ImageProps = {
  img: {
    src: string;
    width: number;
    height: number;
  };
  base64: string;
  blurhash: string;
};

type Movie = {
  adult: string;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: any[];
  genre_id: number[];
  homepage: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  // There are more properties to this....
};

const MoviePage = ({ movie, imagesProps }: IMovieProps) => {
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

  const reviewForEdit = reviewDataWithId?.find(
    (review: any) => review.userId === user?.uid
  );

  const openModalTest = useCallback(() => {
    setModalTypeOpen("review-modal");
    dispatch({ type: "OPEN_MODAL" });
  }, [dispatch]);

  return (
    <div className="relative">
      <PageWidthWrapper>
        <MovieBackground imagesProps={imagesProps} />
        <div className="grid grid-cols-1 gap-4 py-16 sm:grid-cols-7 ">
          <MovieDetails movie={movie} />
          <div className="col-span-2 mt-8 flex justify-center gap-2 sm:mt-0">
            <AddMovieCollectionButton movie={movie} />
            <AddMovieFavoritesButton movie={movie} />
          </div>
        </div>
        <MovieReviews
          openModalTest={openModalTest}
          setModalTypeOpen={setModalTypeOpen}
          loggedInUser={user}
          reviewData={reviewDataWithId}
          reviewDataLoading={reviewDataLoading}
        />
      </PageWidthWrapper>
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

  function MovieDetails({ movie }: { movie: Movie }) {
    return (
      <div className="relative z-50 col-span-5 grid  grid-cols-7 gap-4  ">
        <div className="col-span-2 flex items-start justify-center ">
          <Image
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={300}
            className="  aspect-2/3 object-contain" //sm:fixed
          />
        </div>
        <div className=" col-span-5">
          <div className="">
            <div className="flex justify-between">
              <h1 className="text-3xl font-extrabold text-gray-100">
                {movie?.title}
              </h1>
            </div>
            <h3 className="text-xl text-gray-100">
              {movie?.release_date.slice(0, 4)}
            </h3>
            <div className="mt-2 flex gap-2 text-sm">
              {movie?.genres?.map((genre: any, idx: number) => {
                return (
                  <div key={idx} className="badge badge-primary badge-sm">
                    {genre.name}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-gray-100">{movie?.overview}</p>
          </div>
        </div>
      </div>
    );
  }

  function MovieBackground({ imagesProps }: { imagesProps: ImageProps }) {
    return (
      <div className="absolute top-0 left-0 -z-50 h-96	w-full bg-base-100 bg-transparent bg-cover bg-center bg-no-repeat">
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-neutral bg-opacity-40"></div>
        <div className=" from-10% to-90% absolute top-0 left-0 z-10 h-full w-full bg-gradient-to-t from-neutral to-transparent"></div>
        <Image
          src={imagesProps.img.src}
          placeholder="blur"
          blurDataURL={imagesProps.base64}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
          fill
          alt={imagesProps.img.src}
        />
      </div>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const movieId = context.query.id;
  const apiKey = "5e9bd2fa585826bdfc4233fb6424f425";
  const movieQuery = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
  );
  const movie: any = await movieQuery.json();

  const imagesProps = await getPlaiceholder(
    `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
  );

  return {
    props: {
      movie,
      imagesProps,
    },
  };
};

export default MoviePage;
