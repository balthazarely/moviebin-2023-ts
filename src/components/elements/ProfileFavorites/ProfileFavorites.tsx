import { MovieCard } from "@/components/movieCards";
import React from "react";
import { AddMovieCollectionDropdown } from "../AddMovieCollectionDropdown";
import { FullPageLoader } from "../FullPageLoader";

export function ProfileFavorites({
  favoritesData,
  favoritesDataLoading,
  userRecentCollections,
}: any) {
  if (favoritesDataLoading) {
    return <FullPageLoader />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gridGap: 10,
        gridAutoFlow: "row dense",
      }}
    >
      {favoritesData?.map((movie: any) => (
        <MovieCard key={movie.id} movie={movie}>
          <AddMovieCollectionDropdown
            userFavorites={favoritesData}
            userRecentCollections={userRecentCollections}
            movie={movie}
          />
        </MovieCard>
      ))}
    </div>
  );
}
