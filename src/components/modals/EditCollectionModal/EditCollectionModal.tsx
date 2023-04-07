import { UIContext } from "../../../../lib/context";
import React, { useContext, useEffect, useState } from "react";
import { updateCollectionMetadata } from "../../../../lib/firebaseMovies";
import { collection, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { HiX } from "react-icons/hi";

export function EditCollectionModal({ listname, user }: any) {
  const { dispatch } = useContext(UIContext);

  const q = query(
    collection(db, "users", `${user?.uid}/${listname}`),
    where("type", "==", "metadata")
  );
  const [docs] = useCollectionData(q);
  const [descriptionText, setDescriptionText] = useState("");

  useEffect(() => {
    if (docs) {
      setDescriptionText(docs[0]?.description);
    }
  }, [docs]);

  async function updateMetadataDescription() {
    try {
      await updateCollectionMetadata(listname, descriptionText);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {}
  }

  const hasInputChanged = () => {
    if (docs && docs[0]?.description !== descriptionText) {
      return true;
    }
    return false;
  };

  return (
    <div className=" relative  h-full w-full text-center">
      <button
        className="btn-ghost btn-sm btn absolute -top-4 -right-4 border-none "
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
      <h3 className="text-lg font-bold">Edit collection description </h3>
      <textarea
        value={descriptionText}
        onChange={(event) => setDescriptionText(event.target.value)}
        className="textarea-primary textarea mt-4 h-44 w-full  "
      ></textarea>
      <div className="mt-4 flex justify-center gap-4">
        <button
          disabled={!hasInputChanged()}
          className={`btn-primary btn `}
          onClick={updateMetadataDescription}
        >
          udpate description
        </button>
      </div>
    </div>
  );
}
