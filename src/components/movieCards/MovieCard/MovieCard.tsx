import Link from "next/link";
import React from "react";

export function MovieCard({ movie, children }: any) {
  return (
    <div className="relative aspect-2/3  rounded-sm group hover:border-gray-100 border-4 border-transparent duration-100 transition-all cursor-pointer">
      <Link href={`/movie/${movie.id}`}>
        <img
          className="w-full h-full object-cover rounded-sm "
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        />
      </Link>
      {children}
      {/* <AddMovieCollectionDropdown
          movie={movie}
          recentCollection={userData?.recentCollection}
        /> */}
    </div>
  );
}
