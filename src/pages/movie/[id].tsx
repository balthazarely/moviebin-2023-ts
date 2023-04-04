import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";
import { PageWidthWrapper } from "@/components/layout";
import { useNestedUserCollectionsHook } from "../../../lib/hooks";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
  ModalWrapper,
  MovieReviews,
} from "@/components/elements";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, FirebaseUser, firestore } from "../../../lib/firebase";
import { useContext, useState } from "react";
import { DeleteReviewModal, ReviewMovieModal } from "@/components/modals";
import { UIContext } from "../../../lib/context";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { deleteMovieReviewToDB } from "../../../lib/firebaseFunctions";

interface IMovieProps {
  movie: Movie;
  imagesProps: ImageProps;
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
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const reviewRef = firestore
    .collection("movies")
    .doc(movie?.id?.toString())
    .collection("reviews");
  // @ts-ignore
  const [reviewData] = useCollection(reviewRef);
  const { isLoading, error } = useNestedUserCollectionsHook();
  const { dispatch } = useContext(UIContext);
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");

  const documentSnapshots = reviewData?.docs as QueryDocumentSnapshot[];
  const reviewDataWithId = documentSnapshots?.map((doc: any) => {
    return { reviewId: doc.id, ...doc.data() };
  });

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div>error</div>;
  }

  const reviewForEdit = reviewDataWithId?.find(
    (review: any) => review.userId === user?.uid
  );

  return (
    <div className="relative">
      <MovieDetails movie={movie} />
      <MovieBackground imagesProps={imagesProps} />
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
      <PageWidthWrapper>
        <div className="relative z-50 grid h-96 grid-cols-1 gap-4 p-10 sm:grid-cols-4 sm:pt-24">
          <div className="col-span-1 flex items-start justify-center ">
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={100}
              className=" block aspect-2/3 object-contain sm:fixed"
            />
          </div>
          <div className=" col-span-1 mt-4 ml-2 sm:col-span-3">
            <div className="ml-4">
              <div className="flex justify-between">
                <h1 className="text-4xl font-extrabold text-gray-100">
                  {movie?.title}
                </h1>
                <AddMovieCollectionDropdown btn={true} movie={movie} />
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

              <MovieReviews
                setModalTypeOpen={setModalTypeOpen}
                loggedInUser={user}
                reviewData={reviewDataWithId}
              />
            </div>
          </div>
        </div>
      </PageWidthWrapper>
    );
  }

  function MovieBackground({ imagesProps }: { imagesProps: ImageProps }) {
    return (
      <div className="absolute top-0 left-0 z-0 h-96	w-full bg-base-100 bg-transparent bg-cover bg-center bg-no-repeat">
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
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
  );
  const movie: any = await res.json();

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
