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

export const doesCollectionNameExist = (
  currentCollections: string[],
  newName: string
) =>
  currentCollections &&
  currentCollections
    ?.map((str: string) => str.toLowerCase())
    .includes(newName.trim().toLowerCase());

export const convertToDate = (serverDate: any) => {
  const date = new Date(serverDate);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};
