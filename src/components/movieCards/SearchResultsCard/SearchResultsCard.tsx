import Link from "next/link";
import React from "react";
import { Movie } from "../../../../lib/types";

export function SearchResultsCard({ movie }: { movie: Movie }) {
  return (
    <div className="group relative flex  gap-2  rounded-md  bg-base-100 bg-opacity-50  transition-all duration-100">
      {movie.poster_path ? (
        <img
          className=" aspect-2/3 w-24 rounded-sm object-cover "
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        />
      ) : (
        <div
          className="aspect-2/3 w-24 bg-neutral
      "
        ></div>
      )}

      <div className="p-2">
        <Link href={`/movie/${movie.id}`}>
          <div className="font-bold">
            {movie.title}{" "}
            <span className="font-light">
              ({movie.release_date.slice(0, 4)}){" "}
            </span>
          </div>
        </Link>
        <div className="text-xs">
          {movie.overview.slice(0, 100)}{" "}
          <span className="font-bold">
            {" "}
            {movie.overview.length > 100 ? (
              <Link href={`/movie/${movie.id}`}>...more</Link>
            ) : (
              ""
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
