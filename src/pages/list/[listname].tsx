import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, FirebaseUser } from "../../../lib/firebase";
import { formatMoviesForDnD } from "../../../lib/utils";
import {
  deleteMovieFromDB,
  updateDocumentOrderInDB,
} from "../../../lib/firebaseMovies";
import { ListMovieGrid } from "@/components/movieGrids";
import { UIContext } from "../../../lib/context";
import { CollectionListHeader } from "@/components/elements";
import { FullPageLoader, ModalWrapper } from "@/components/elements/UIElements";
import { PageWidthWrapper } from "@/components/layout";
import {
  DeleteCollectionModal,
  EditCollectionModal,
  MagicCollectionModal,
} from "@/components/modals";
import { VscWand } from "react-icons/vsc";
import { FirestoreMovie } from "../../../lib/types";

export default function Listname() {
  // Hooks
  const router = useRouter();
  const { listname } = router.query;
  const { dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const query = collection(db, "users", `${user?.uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  // State
  const [modalTypeOpen, setModalTypeOpen] = useState<string>("");
  const [movies, setMovies] = useState<FirestoreMovie[]>([]);

  useEffect(() => {
    if (docs) {
      const filteredDocuments = docs?.filter((doc) => doc.type !== "metadata");
      setMovies(formatMoviesForDnD(filteredDocuments));
    }
  }, [docs]);

  useEffect(() => {
    if (listname) {
      updateDocumentOrderInDB(movies, listname.toString());
    }
  }, [movies, listname]);

  if (loading) {
    return <FullPageLoader className="h-96" />;
  }

  async function deleteMovie(id: any) {
    try {
      await deleteMovieFromDB(id, listname);
      const filteredMovies: any = movies
        .filter((movie: any) => movie.movieId !== id)
        .map((movie: any, idx: any) => {
          return {
            ...movie,
            order: idx,
          };
        });
      setMovies(filteredMovies);
    } catch (error) {}
  }

  return (
    <PageWidthWrapper className="">
      <CollectionListHeader
        listname={listname}
        setModalTypeOpen={setModalTypeOpen}
      />
      <ListMovieGrid
        setModalTypeOpen={setModalTypeOpen}
        movies={movies}
        setMovies={setMovies}
        deleteMovie={deleteMovie}
        listname={listname?.toString()}
      />
      <div className="mt-4 mb-8 flex justify-center gap-2">
        <button
          className="btn-outline  btn-error btn"
          onClick={() => {
            setModalTypeOpen("delete-collection");
            dispatch({ type: "OPEN_MODAL" });
          }}
        >
          Delete Collection
        </button>
        <button
          className="btn-outline btn  bg-gradient-to-tl from-accent via-secondary to-primary text-white "
          onClick={() => {
            setModalTypeOpen("magic-collection");
            dispatch({ type: "OPEN_MODAL" });
          }}
        >
          Magic Playlist <VscWand className="ml-2 text-lg " />
        </button>
      </div>
      <ModalWrapper>
        {modalTypeOpen === "magic-collection" && (
          <MagicCollectionModal movies={movies} />
        )}
        {modalTypeOpen === "delete-collection" && (
          <DeleteCollectionModal listname={listname} />
        )}
        {modalTypeOpen === "edit-collection" && (
          <EditCollectionModal user={user} listname={listname} />
        )}
      </ModalWrapper>
    </PageWidthWrapper>
  );
}
