import { MovieCard } from "@/components/movieCards";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { auth, FirebaseUser, firestore } from "../../../../../lib/firebase";
import { AddMovieCollectionDropdown } from "../../UIElements";

export function SimilarMovies({ similarMovies }: any) {
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const docRef = firestore
    .collection("usersfavorites")
    .doc(user?.uid?.toString())
    .collection("favorites");
  // @ts-ignore
  const [userFavorites, loading, error] = useCollectionData(docRef);

  const docRefs = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userRecentCollections] = useDocumentData<UserDoc>(docRefs);

  return (
    <>
      {similarMovies?.results?.length ? (
        <>
          <h1 className="mb-2 text-xl font-extrabold">Users also liked</h1>
          <div className="mb-16 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {similarMovies?.results
              ?.slice(0, 4)
              .map((movie: any, idx: number) => {
                return (
                  <MovieCard key={movie.id} movie={movie}>
                    <AddMovieCollectionDropdown
                      userFavorites={userFavorites}
                      userRecentCollections={userRecentCollections}
                      movie={movie}
                      idx={idx}
                    />
                  </MovieCard>
                );
              })}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
