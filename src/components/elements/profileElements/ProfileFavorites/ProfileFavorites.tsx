import { MovieCard } from "@/components/movieCards";
import React from "react";
import { AddMovieCollectionDropdown, FullPageLoader } from "../../UIElements";

export function ProfileFavorites({ favoritesData, favoritesDataLoading }: any) {
  if (favoritesDataLoading) {
    return <FullPageLoader />;
  }

  return (
    <>
      {/* <button onClick={handleCustomToast}>BUTTON</button> */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {favoritesData?.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie}>
            <AddMovieCollectionDropdown
              userFavorites={favoritesData}
              movie={movie}
            />
          </MovieCard>
        ))}
      </div>
    </>
  );
}
