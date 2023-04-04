import React, { useContext, useState } from "react";
import { UIContext } from "../../../../lib/context";
import { deleteCollection } from "../../../../lib/firebaseFunctions";
import { HiX } from "react-icons/hi";

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
    <div className=" relative  h-full w-full text-center">
      <button
        className="btn-sm btn absolute -top-4 -right-4 border-none bg-base-100"
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
      <h3 className="text-lg font-bold">
        Are you sure you want to delete this collection?
      </h3>
      <p className="p2-4">This might take a couple seconds so hang tight</p>
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={deleteListCollection}
          className={`btn-error btn ${deleteFnLoading && "loading"}`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
