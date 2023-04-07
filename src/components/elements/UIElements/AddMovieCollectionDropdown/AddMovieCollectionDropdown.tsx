import { useContext } from "react";
import { UIContext } from "../../../../../lib/context";
import { addMovieToCollection } from "../../../../../lib/firebaseMovies";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { addOrRemoveMovieToFavorites } from "../../../../../lib/firebaseFavorites";
import { auth, firestore } from "../../../../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export function AddMovieCollectionDropdown({
  movie,
  userFavorites,
  idx,
}: // userRecentCollections,
any) {
  const { dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userDoc, userDocLoading] = useDocumentData<any>(userDocRef);

  async function addMovieToExistingCollection(movie: any, collectionName: any) {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
      try {
        dispatch({ type: "ADD_TEMP_MOVIE" });
        await addMovieToCollection(movie, collectionName);
        dispatch({ type: "REMOVE_TEMP_MOVIE" });
      } catch (error) {}
    }
  }

  async function addRemoveFavorites() {
    try {
      await addOrRemoveMovieToFavorites(movie);
    } catch (error) {
      console.log(error);
    }
  }

  const isMovieFavorites = (id: any) =>
    userFavorites?.some((item: any) => item.id === id);

  return (
    <div
      className={`dropdown flex w-full justify-center gap-3 rounded-none ${
        idx % 2 === 0
          ? "dropdown-bottom sm:dropdown-end"
          : "dropdown-end dropdown-bottom"
      }`}
    >
      <label tabIndex={0}>
        <HiOutlineDotsHorizontal className="h-6 w-8 cursor-pointer rounded-sm  text-sm text-gray-300 transition-all duration-100  hover:text-white" />
      </label>
      <HiHeart
        onClick={addRemoveFavorites}
        className={`${
          isMovieFavorites(movie.id)
            ? "text-accent"
            : "text-gray-300 hover:text-white"
        } h-6 w-8 cursor-pointer  text-sm transition-all duration-100  `}
      />
      <ul
        tabIndex={0}
        className="dropdown-content menu w-52 rounded-md bg-base-100 shadow  "
      >
        <li className="pointer-events-none bg-neutral p-2 text-xs text-gray-500">
          Recent Collections
        </li>
        {userDoc?.recentCollection?.map((list: any, idx: number) => {
          return (
            <li className="text-xs" key={idx}>
              <div onClick={() => addMovieToExistingCollection(movie, list)}>
                Add to {list}
              </div>
            </li>
          );
        })}

        <li>
          <button
            className="bg-base-200 text-left text-xs font-bold  "
            onClick={() => {
              dispatch({ type: "OPEN_ADD_MOVIE_MODAL" });
              dispatch({ type: "ADD_TEMP_MOVIE", payload: movie });
            }}
          >
            Add to new collection or other collection
          </button>
        </li>
      </ul>
    </div>
  );
}
