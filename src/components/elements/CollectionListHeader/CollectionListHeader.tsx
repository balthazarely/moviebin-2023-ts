import { useContext } from "react";
import { UIContext } from "../../../../lib/context";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, FirebaseUser, auth } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where } from "firebase/firestore";

export function CollectionListHeader({
  listname,
  setModalTypeOpen,
  modalTypeOpen,
}: any) {
  const { dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const q = query(
    collection(db, "users", `${user?.uid}/${listname}`),
    where("type", "==", "metadata")
  );
  const [docs, loading, error] = useCollectionData(q);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-start gap-2">
        <h1 className=" text-3xl font-bold">{listname}</h1>
        <button
          className=" flex items-center justify-center  p-1"
          onClick={() => {
            setModalTypeOpen("edit-collection");
            dispatch({ type: "OPEN_MODAL" });
          }}
        >
          <HiOutlinePencilAlt className="mt-1 text-xl " />
        </button>
      </div>
      {docs ? (
        <p className="mt-2 max-w-lg text-sm">{docs[0]?.description}</p>
      ) : (
        <></>
      )}
    </div>
  );
}
