import { GetServerSideProps } from "next";
import fetch from "node-fetch";
import { getPlaiceholder } from "plaiceholder";
import Image from "next/image";
import { PageWidthWrapper } from "@/components/layout";
import { getSimilarMovie } from "../../../lib/api";
import { MoviePageContents } from "@/components/elements/MovieElements";

interface IMovieProps {
  movie: Movie;
  imagesProps: ImageProps;
  similarMovies: any;
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

const MoviePage = ({ movie, imagesProps, similarMovies }: IMovieProps) => {
  return (
    <div className="relative">
      <MovieBackground imagesProps={imagesProps} />
      <PageWidthWrapper>
        <MovieDetails movie={movie} />
        <MoviePageContents movie={movie} similarMovies={similarMovies} />
      </PageWidthWrapper>
    </div>
  );

  function MovieDetails({ movie }: { movie: Movie }) {
    return (
      <div className="relative z-50 grid grid-cols-1 gap-4 pt-16 pb-8 sm:grid-cols-7   ">
        <div className=" col-span-1 flex items-start justify-center sm:col-span-2 ">
          <Image
            src={`https://image.tmdb.org/t/p/w200${movie?.poster_path}`}
            alt={movie?.title}
            width={300}
            height={300}
            className="  aspect-2/3 object-contain" //sm:fixed
          />
        </div>
        <div className=" col-span-1 sm:col-span-5">
          <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold text-gray-100">
              {movie?.title}
            </h1>
          </div>
          <h3 className="text-xl text-gray-100">
            {movie?.release_date.slice(0, 4)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
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
    );
  }

  function MovieBackground({ imagesProps }: { imagesProps: ImageProps }) {
    return (
      <div className="absolute top-0 left-0 z-0 h-96	w-full bg-base-100 bg-transparent bg-cover bg-center bg-no-repeat">
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-neutral bg-opacity-40"></div>
        <div className=" from-10% to-90% absolute top-0 left-0 z-10 h-full w-full bg-gradient-to-t from-base-100 to-transparent"></div>

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
  const movieQuery = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
  );
  const movie: any = await movieQuery.json();
  const similarMovies = await getSimilarMovie(movieId);

  const backdropPath = movie.backdrop_path;
  const imagesProps = backdropPath
    ? await getPlaiceholder(`https://image.tmdb.org/t/p/w500${backdropPath}`)
    : null;

  console.log("getServerSideProps");

  return {
    props: {
      movie,
      imagesProps,
      similarMovies,
    },
  };
};

export default MoviePage;
