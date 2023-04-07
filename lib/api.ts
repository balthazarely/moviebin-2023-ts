export const getMovies = async ({ query, pageParam = 1 }: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${query}?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&page=${pageParam}`
  );
  return res.json();
};

export const getMoviesWithinGenre = async ({ query, pageParam = 1 }: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageParam}&with_genres=${query}`
  );
  return res.json();
};

export const getMovie = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
  );
  return res.json();
};

export const getSimilarMovie = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&sort_by=popularity.desc`
  );
  return res.json();
};

export const searchForMovies = async ({ query, pageParam = 1 }: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&include_adult=false&query=${query}&page=${pageParam}`
  );
  return res.json();
};

export const getMovieRecommendations = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
  );
  return res.json();
};

export const getMovieGenreList = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
  );
  return res.json();
};

export const getNestedUserCollections = async (uid: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_URL}/getNestedUserCollections`,
    {
      method: "POST",
      body: JSON.stringify({ req: { userId: uid } }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await res.json();
  return response;
};

export const getNestedUserCollectionsAndDocs = async (uid: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_URL}/getNestedUserCollectionsAndDocs`,
    {
      method: "POST",
      body: JSON.stringify({ req: { userId: uid } }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await res.json();
  return response;
};
