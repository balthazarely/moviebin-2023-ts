import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";
import { useState } from "react";
import { PageWidthWrapper } from "@/components/layout";
import { useNestedUserCollectionsHook } from "../../../lib/hooks";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../../lib/firebase";

type MovieProps = {
  movie: {
    title: string;
    poster_path: string;
    overview: string;
  };
  imagesProps: {
    img: {
      src: string;
      width: number;
      height: number;
    };
    base64: string;
    blurhash: string;
  };
};

const MoviePage = ({ movie, imagesProps }: MovieProps) => {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userData] = useDocumentData(docRef);

  const { isLoading, error, nestedCollectionsFromHook, refetch } =
    useNestedUserCollectionsHook();

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

  function MovieDetails({ movie, userData }: any) {
    return (
      <PageWidthWrapper>
        <div className="relative h-96 z-50 sm:pt-24 p-10 gap-4 grid grid-cols-1 sm:grid-cols-4">
          <div className="flex justify-center col-span-1">
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={100}
              className=" aspect-2/3  object-contain"
            />
          </div>
          <div className=" sm:col-span-3 col-span-1 mt-4">
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
              <div className="text-sm flex gap-2 mt-2">
                {movie?.genres?.map((genre: any, idx: number) => {
                  return (
                    <div className="badge badge-sm badge-primary">
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

  function MovieBackground({ imagesProps }: any) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="z-0 h-96 bg-base-100 w-full bg-center	bg-no-repeat bg-cover bg-transparent absolute top-0 left-0">
        <div className="z-10 absolute top-0 left-0 bg-neutral bg-opacity-40 w-full h-full"></div>
        <div className=" z-10 absolute top-0 left-0 bg-gradient-to-t from-neutral from-10% to-transparent to-90% w-full h-full"></div>
        <Image
          src={imagesProps.img.src}
          placeholder="blur"
          blurDataURL={imagesProps.base64}
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
          fill
          // onLoad={() => setImageLoaded(true)}
          alt={imagesProps.img.src}
        />
        {/* <Image
          src={imagesProps.base64}
          placeholder="blur"
          blurDataURL={imagesProps.base64}
          layout="fill"
          sizes="100vw"
          className={`transition-all duration-300 ${
            imageLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            objectFit: "cover",
          }}
          alt={imagesProps.img.src} 
        />
          */}
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
