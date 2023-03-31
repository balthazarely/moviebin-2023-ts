export type UserDoc = {
  createdAt: any;
  displayName: string;
  email: string;
  photoURL: string;
  recentCollection: string[];
  theme: string;
  uid: string;
};

export type Movie = {
  adult: string;
  backdrop_path: string;
  genre_id: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type FirestoreMovie = {
  createdAt: any;
  id: number;
  image: string;
  movideId: number;
  movieTitle: string;
  order: number;
};

export type NestedDataCollectionDocs = {
  documents: NestedDataDocs;
};

export type NestedDataDocs = {
  createdAt: any;
  image: string;
  movideId: number;
  movieTitle: string;
  order: number;
};
