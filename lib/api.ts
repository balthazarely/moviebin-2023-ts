export const getMovies = async ({ query, pageParam = 1 }: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${query}?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&page=${pageParam}`
  );
  return res.json();
};

export const getMovie = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
  );
  return res.json();
};

export const searchForMovies = async (query: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`
  );
  return res.json();
};

export const getMovieRecommendations = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&language=en-US`
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
