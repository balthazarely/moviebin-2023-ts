import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../../lib/context";
import {
  addMovieToCollection,
  createAndAddToCollection,
} from "../../../../lib/firebaseFunctions";
import { useNestedUserCollectionsHook } from "../../../../lib/hooks";
import { doesCollectionNameExist } from "../../../../lib/utils";

export function AddMovieToCollectionModal() {
  const { state, dispatch } = useContext(UIContext);
  const { nestedCollectionsFromHook, refetch } = useNestedUserCollectionsHook();
  const [createColBtnDisabled, setCreateColBtnDisabled] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function addMovieToNewCollection(movie: any) {
    try {
      setSubmitting(true);
      await createAndAddToCollection({
        movie,
        newCollectionName,
      });
      closeModalAndClearData();
      await refetch();
    } catch (error) {}
  }

  async function addMovieToExistingCollection(movie: any, collectionName: any) {
    if (selectedItem !== "Choose Collection") {
      try {
        setSubmitting(true);
        dispatch({ type: "ADD_TEMP_MOVIE", payload: movie });
        await addMovieToCollection(movie, collectionName);
        closeModalAndClearData();
      } catch (error) {}
    }
  }

  const closeModalAndClearData = () => {
    setSelectedItem("");
    setNewCollectionName("");
    setSubmitting(false);
    dispatch({ type: "CLOSE_ADD_MOVIE_MODAL" });
    dispatch({ type: "REMOVE_TEMP_MOVIE", payload: null });
  };

  const handleInputChange = (event: any) => {
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9\s]/g, "");
    setNewCollectionName(sanitizedInput);
  };

  const handleSelectChange = (event: any) => {
    setSelectedItem(event.target.value);
  };

  useEffect(() => {
    let createColBtnDisabled = false;
    let errMsg = "";

    const doesColNameExist = doesCollectionNameExist(
      nestedCollectionsFromHook,
      newCollectionName
    );

    if (doesColNameExist) {
      createColBtnDisabled = true;
      errMsg = "List already exists";
    } else if (newCollectionName.length < 3) {
      createColBtnDisabled = true;
      errMsg = "Name must be at least 3 chars";
    }

    setCreateColBtnDisabled(createColBtnDisabled);
    setErrMsg(errMsg);
  }, [newCollectionName, nestedCollectionsFromHook]);

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
              onClick={closeModalAndClearData}
              className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
            >
              x
            </button>
            <div className="flex justify-center mt-4 gap-4 flex-col ">
              {nestedCollectionsFromHook?.length > 0 && (
                <div>
                  <h3 className="font-bold text-md mb-2">Add to collecion</h3>
                  <select
                    className="select select-bordered w-full"
                    onChange={handleSelectChange}
                    value={selectedItem}
                  >
                    <option disabled value="">
                      Choose Collection
                    </option>
                    {nestedCollectionsFromHook &&
                      nestedCollectionsFromHook.map(
                        (list: any, idx: number) => {
                          return <option key={idx}>{list}</option>;
                        }
                      )}
                  </select>
                  <button
                    className="btn-primary btn"
                    disabled={selectedItem === "" || submitting}
                    onClick={() =>
                      addMovieToExistingCollection(
                        state.tempMovie,
                        selectedItem
                      )
                    }
                  >
                    Add to Collection
                  </button>
                  <div className="divider">OR</div>
                </div>
              )}

              <h3 className="font-bold text-md">Create new collection</h3>
              <input
                type="text"
                value={newCollectionName}
                onChange={handleInputChange}
                className="input w-full input-bordered input-primary  "
              />
              <h1 className="text-sm text-warning"></h1>
              <button
                className="btn-primary btn"
                disabled={createColBtnDisabled || submitting}
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
