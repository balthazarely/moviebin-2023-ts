export const getMovies = async ({ query, pageParam = 1 }: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${query}?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US&page=${pageParam}`
  );
  return res.json();
};

export const getMovie = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US`
  );
  return res.json();
};

export const searchForMovies = async (query: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US&page=1&include_adult=false&query=${query}`
  );
  return res.json();
};

export const getMovieRecommendations = async (id: any) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US`
  );
  return res.json();
};

export const getNestedUserCollections = async (uid: any) => {
  const res = await fetch(
    "https://us-central1-fir-todo-9081a.cloudfunctions.net/getNestedUserCollections",
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
    "https://us-central1-fir-todo-9081a.cloudfunctions.net/getNestedUserCollectionsAndDocs",
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
