import Link from "next/link";
import React from "react";
import { Movie } from "../../../../lib/types";

export function MovieCard({
  movie,
  children,
}: {
  movie: Movie;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative  aspect-2/3 cursor-pointer rounded-sm border-4 border-transparent transition-all duration-100 hover:border-gray-100">
      <Link href={`/movie/${movie.id}`}>
        <img
          className="h-full w-full rounded-sm object-cover "
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        />
      </Link>
      <div className="absolute bottom-0 left-0 hidden h-10 w-full justify-center group-hover:flex">
        <div className="h-8 rounded-md bg-black bg-opacity-80 p-1">
          {children}
        </div>
      </div>
    </div>
  );
}
