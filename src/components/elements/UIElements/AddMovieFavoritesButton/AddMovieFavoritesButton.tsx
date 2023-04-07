import React from "react";
import { addOrRemoveMovieToFavorites } from "../../../../../lib/firebaseFavorites";
import { HiHeart } from "react-icons/hi";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, FirebaseUser, firestore } from "../../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { SmallLoader } from "../SmallLoader";

export function AddMovieFavoritesButton({ movie }: any) {
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const docRef = firestore
    .collection("usersfavorites")
    .doc(user?.uid?.toString())
    .collection("favorites");
  // @ts-ignore
  const [userFavorites, loading] = useCollectionData(docRef);

  async function addRemoveFavorites() {
    try {
      await addOrRemoveMovieToFavorites(movie);
    } catch (error) {}
  }

  const isMovieFavorites = (id: any) =>
    userFavorites?.some((item: any) => item.id === id);

  if (loading) {
    return (
      <button className="btn-primary btn w-[72px]">
        <SmallLoader border="border-white" className="h-12" />
      </button>
    );
  }

  return (
    <button
      onClick={addRemoveFavorites}
      className="btn-primary btn z-50 w-[72px]"
    >
      <HiHeart
        className={`${
          isMovieFavorites(movie?.id)
            ? "text-accent"
            : "text-gray-300 hover:text-white"
        } h-6 w-8 cursor-pointer  text-sm transition-all duration-100  `}
      />
    </button>
  );
}
