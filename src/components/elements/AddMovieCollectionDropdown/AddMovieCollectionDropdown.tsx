import { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { addMovieToCollection } from "../../../../lib/firebaseFunctions";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export function AddMovieCollectionDropdown({
  movie,
  btn = false,
  recentCollection,
}: any) {
  const { dispatch } = useContext(UIContext);

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
      className={`dropdown dropdown-end rounded-none ${
        btn ? "" : "absolute top-0 right-0 "
      } `}
    >
      <label tabIndex={0}>
        {btn ? (
          <button className="btn btn-primary">Add to Collection</button>
        ) : (
          <HiOutlineDotsHorizontal className="text-gray-300 rounded-sm duration-100 transition-all bg-opacity-50 hover:bg-opacity-70 hover:text-white text-sm bg-black w-8 h-6 cursor-pointer" />
        )}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu shadow bg-base-100 rounded-md w-52  "
      >
        <li className="text-xs p-2 bg-neutral text-gray-500 pointer-events-none">
          Recent Collections
        </li>
        {recentCollection &&
          recentCollection
            // ?.slice(0, 4)
            .map((list: any, idx: number) => {
              return (
                <li className="text-xs" key={idx}>
                  <div
                    onClick={() => addMovieToExistingCollection(movie, list)}
                  >
                    Add to {list}
                  </div>
                </li>
              );
            })}

        <li>
          <button
            className="text-xs bg-base-200 text-left font-bold "
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
