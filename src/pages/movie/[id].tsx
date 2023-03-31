import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";
import { PageWidthWrapper } from "@/components/layout";
import { useNestedUserCollectionsHook } from "../../../lib/hooks";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, FirebaseUser, firestore } from "../../../lib/firebase";
import { UserDoc } from "../../../lib/types";

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
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userData] = useDocumentData<UserDoc>(docRef);
  const { isLoading, error } = useNestedUserCollectionsHook();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div>error</div>;
  }

  return (
    <div className="relative">
      <MovieDetails movie={movie} userData={userData} />
      <MovieBackground imagesProps={imagesProps} />
    </div>
  );

  function MovieDetails({
    movie,
    userData,
  }: {
    movie: Movie;
    userData: UserDoc | undefined;
  }) {
    return (
      <PageWidthWrapper>
        <div className="relative z-50 grid h-96 grid-cols-1 gap-4 p-10 sm:grid-cols-4 sm:pt-24">
          <div className="col-span-1 flex justify-center">
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={100}
              className=" aspect-2/3  object-contain"
            />
          </div>
          <div className=" col-span-1 mt-4 sm:col-span-3">
            <div className="ml-4">
              <div className="flex justify-between">
                <h1 className="text-4xl font-extrabold text-gray-100">
                  {movie?.title}
                </h1>
                <AddMovieCollectionDropdown
                  btn={true}
                  movie={movie}
                  recentCollection={userData?.recentCollection}
                />
              </div>
              <h3 className="text-xl text-gray-100">
                {movie?.release_date.slice(0, 4)}
              </h3>
              <div className="mt-2 flex gap-2 text-sm">
                {movie?.genres?.map((genre: any, idx: number) => {
                  return (
                    <div key={idx} className="badge-primary badge badge-sm">
                      {genre.name}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-gray-100">{movie?.overview}</p>
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
