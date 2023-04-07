import { useContext } from "react";
import { UIContext } from "../../../../../lib/context";
import { addMovieToCollection } from "../../../../../lib/firebaseMovies";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { UserDoc } from "../../../../../lib/types";
import { auth, firestore } from "../../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function AddMovieCollectionButton({ movie }: any) {
  const { dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userData] = useDocumentData<UserDoc>(docRef);

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

  return (
    <div className={`dropdown-end dropdown rounded-none   `}>
      <label tabIndex={0}>
        <button className="btn-primary btn">Add to Collection</button>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu w-52 rounded-md bg-base-100 shadow  "
      >
        <li className="pointer-events-none bg-neutral p-2 text-xs text-gray-500">
          Recent Collections
        </li>
        {userData?.recentCollection?.map((list: any, idx: number) => {
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
