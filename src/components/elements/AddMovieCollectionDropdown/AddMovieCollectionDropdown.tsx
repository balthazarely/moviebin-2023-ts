import { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { addMovieToCollection } from "../../../../lib/firebaseFunctions";
import { useNestedUserCollectionsHook } from "../../../../lib/hooks";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export function AddMovieCollectionDropdown({ movie, btn = false }: any) {
  const { dispatch } = useContext(UIContext);
  const { nestedCollectionsFromHook } = useNestedUserCollectionsHook();

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
    <div
      className={`dropdown dropdown-end ${
        btn ? "" : "absolute top-0 right-0 "
      } `}
    >
      <label tabIndex={0}>
        {btn ? (
          <button className="btn btn-primary">Add Movie to Collection</button>
        ) : (
          <HiOutlineDotsHorizontal className="text-gray-300 bg-opacity-70 hover:text-white text-sm bg-black w-8 h-6 cursor-pointer" />
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52  "
      >
        {nestedCollectionsFromHook &&
          nestedCollectionsFromHook?.map((list: any, idx: number) => {
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
            className="text-xs"
            onClick={() => {
              dispatch({ type: "OPEN_ADD_MOVIE_MODAL" });
              dispatch({ type: "ADD_TEMP_MOVIE", payload: movie });
            }}
          >
            Add to new collection
          </button>
        </li>
      </ul>
    </div>
  );
}
