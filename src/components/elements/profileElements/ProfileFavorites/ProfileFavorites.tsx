import { MovieCard } from "@/components/movieCards";
import React from "react";
import { AddMovieCollectionDropdown, FullPageLoader } from "../../UIElements";

export function ProfileFavorites({ favoritesData, favoritesDataLoading }: any) {
  if (favoritesDataLoading) {
    return <FullPageLoader />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          favoritesData.length < 4
            ? "1fr 1fr 1fr 1fr"
            : "repeat(auto-fit, minmax(100px, 1fr)",
        gridGap: 10,
        gridAutoFlow: "row dense",
      }}
    >
      {favoritesData?.map((movie: any) => (
        <MovieCard key={movie.id} movie={movie}>
          <AddMovieCollectionDropdown
            userFavorites={favoritesData}
            movie={movie}
          />
        </MovieCard>
      ))}
    </div>
  );
}
