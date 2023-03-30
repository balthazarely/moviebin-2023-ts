import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../../lib/context";
import { createAndAddToCollection } from "../../../../lib/firebaseFunctions";
import { useNestedUserCollectionsHook } from "../../../../lib/hooks";

export function AddMovieToCollectionModal() {
  const { state, dispatch } = useContext(UIContext);
  const { nestedCollectionsFromHook, refetch } = useNestedUserCollectionsHook();
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [newCollectionName, setNewCollectionName] = useState<string>("");

  async function addMovieToNewCollection(movie: any) {
    try {
      await createAndAddToCollection({
        movie,
        newCollectionName,
      });
      dispatch({ type: "CLOSE_ADD_MOVIE_MODAL" });
      dispatch({ type: "REMOVE_TEMP_MOVIE", payload: null });
      setNewCollectionName("");
      await refetch();
    } catch (error) {}
  }

  const toggleModalAndClearForm = (modalState: string) => {
    setNewCollectionName("");
    dispatch({ type: modalState });
  };

  useEffect(() => {
    if (
      nestedCollectionsFromHook &&
      nestedCollectionsFromHook
        ?.map((str: string) => str.toLowerCase())
        .includes(newCollectionName.trim().toLowerCase())
    ) {
      setBtnDisabled(true);
      setErrMsg("List already exists");
    } else if (newCollectionName.length < 3) {
      setBtnDisabled(true);
      setErrMsg("Name must be at least 3 chars");
    } else {
      setBtnDisabled(false);
      setErrMsg("");
    }
  }, [newCollectionName]);

  return (
    <div className="">
      <input
        type="checkbox"
        checked={state?.isAddMovieModalOpen}
        id="my-modal-6"
        className="modal-toggle"
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box">
          <div className="h-full w-full text-center relative">
            {state?.tempMovie?.title}
            <button
              onClick={() => toggleModalAndClearForm("CLOSE_ADD_MOVIE_MODAL")}
              className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
            >
              x
            </button>
            <h3 className="font-bold text-lg">Add to collecion</h3>
            <div className="flex justify-center mt-4 gap-4 flex-col">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="input w-full input-bordered input-primary  "
              />
              <h1 className="text-sm text-warning"></h1>
              <button
                className="btn-primary btn"
                disabled={btnDisabled}
                onClick={() => addMovieToNewCollection(state.tempMovie)}
              >
                {errMsg ? errMsg : "Create new collection with movie"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
