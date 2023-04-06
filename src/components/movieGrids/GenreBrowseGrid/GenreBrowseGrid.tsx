import { FullPageLoader } from "@/components/elements/UIElements";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { getMovieGenreList } from "../../../../lib/api";

export function GenreBrowseGrid() {
  const { isLoading, error, data } = useQuery(
    ["genre-movie"],
    () => getMovieGenreList()
    // getMovieGenreMovies(35)
  );

  if (isLoading) {
    return <FullPageLoader className="h-64 " />;
  }

  if (error) {
    return <div>errr</div>;
  }

  return (
    <div>
      <div className=" mt-8 mb-2 text-xl font-bold capitalize ">
        Browse By Genre
      </div>
      <div className=" mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {data?.genres.map((genre: any, idx: any) => (
          <GenreCard genre={genre} key={idx} />
        ))}
      </div>
    </div>
  );
}

function GenreCard({ genre }: any) {
  return (
    <Link href={`genre/${genre.id}?name=${genre.name.toLowerCase()}`}>
      <div className="flex w-full items-center justify-center rounded-md bg-base-100 p-4 text-sm font-normal transition-all duration-200 hover:bg-primary hover:text-white  hover:shadow-xl">
        {genre.name}
      </div>
    </Link>
  );
}
