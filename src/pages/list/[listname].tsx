import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../lib/firebase";
import { formatMoviesForDnD } from "../../../lib/utils";
import {
  deleteMovieFromDB,
  updateDocumentOrderInDB,
} from "../../../lib/firebaseFunctions";

import { ListMovieGrid } from "@/components/movieGrids";
import { UIContext } from "../../../lib/context";
import { FullPageLoader, ModalWrapper } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import {
  DeleteCollectionModal,
  MagicCollectionModal,
} from "@/components/modals";

export default function Listname() {
  // Hooks
  const router = useRouter();
  const { listname } = router.query;
  const { dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user] = useAuthState(auth);
  const query = collection(db, "users", `${user?.uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  // State
  const [modalTypeOpen, setModalTypeOpen] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (docs) {
      setMovies(formatMoviesForDnD(docs));
    }
  }, [docs]);

  useEffect(() => {
    if (listname) {
      updateDocumentOrderInDB(movies, listname.toString());
    }
  }, [movies, listname]);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <PageWidthWrapper className="">
      <ListMovieGrid
        setModalTypeOpen={setModalTypeOpen}
        movies={movies}
        setMovies={setMovies}
        deleteMovie={deleteMovie}
        listname={listname}
      />
      <div className="flex justify-center mt-4">
        <button
          className="btn  btn-outline btn-error"
          onClick={() => {
            setModalTypeOpen("delete-collection");
            dispatch({ type: "OPEN_MODAL" });
          }}
        >
          Delete Collection
        </button>
      </div>
      <ModalWrapper>
        {modalTypeOpen === "magic-collection" && (
          <MagicCollectionModal movies={movies} />
        )}

        {modalTypeOpen === "delete-collection" && (
          <DeleteCollectionModal listname={listname} />
        )}
      </ModalWrapper>
    </PageWidthWrapper>
  );

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
}
