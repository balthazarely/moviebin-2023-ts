import React, { useContext, useState } from "react";
import { UIContext } from "../../../../lib/context";
import { deleteCollection } from "../../../../lib/firebaseFunctions";

export function DeleteCollectionModal({ listname }: any) {
  const { dispatch } = useContext(UIContext);
  const [deleteFnLoading, setDeleteFnLoading] = useState(false);

  async function deleteListCollection() {
    try {
      setDeleteFnLoading(true);
      await deleteCollection(listname);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {}
  }

  return (
    <div className=" h-full  w-full text-center relative">
      <button
        className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        x
      </button>
      <h3 className="font-bold text-lg">
        Are you sure you want to delete this collection?
      </h3>
      <p className="p2-4">This might take a couple seconds so hang tight</p>
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={deleteListCollection}
          className={`btn btn-error ${deleteFnLoading && "loading"}`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
