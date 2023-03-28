export const formatMoviesForDnD = (docs: any) => {
  return docs
    .map((movie: any) => {
      return {
        ...movie,
        id: movie.movieId,
      };
    })
    .sort((a: any, b: any) => a.order - b.order);
};
