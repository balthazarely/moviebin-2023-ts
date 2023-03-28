import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { collection } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../lib/firebase";
import { formatMoviesForDnD } from "../../../lib/utils";
import {
  deleteCollection,
  deleteMovieFromDB,
  updateDocumentOrderInDB,
} from "../../../lib/firebaseFunctions";
import { ListMovieGrid } from "@/components/movieGrids";
import { UIContext } from "../../../lib/context";
import { FullPageLoader, ModalWrapper } from "@/components/elements";

export default function Listname() {
  // Hooks
  const router = useRouter();
  const { listname } = router.query;
  const { state, dispatch } = useContext(UIContext);
  // @ts-ignore
  const [user] = useAuthState(auth);
  const query = collection(db, "users", `${user?.uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  // State
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
    <div>
      <ListMovieGrid
        movies={movies}
        setMovies={setMovies}
        deleteMovie={deleteMovie}
        listname={listname}
      />
      <div className="flex justify-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => dispatch({ type: "OPEN_MODAL" })}
        >
          Delete Collection
        </button>
      </div>
      <ModalWrapper>
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
              className={`btn  btn-error `}
            >
              Proceed
            </button>
          </div>
        </div>
      </ModalWrapper>
    </div>
  );

  async function deleteMovie(id: any) {
    try {
      deleteMovieFromDB(id, listname);
    } catch (error) {
      console.log(error);
    } finally {
      const filteredMovies: any = movies
        .filter((movie: any) => movie.movieId !== id)
        .map((movie: any, idx: any) => {
          return {
            ...movie,
            order: idx,
          };
        });
      setMovies(filteredMovies);
    }
  }

  async function deleteListCollection() {
    try {
      await deleteCollection(listname, user!.uid).then(() => {
        dispatch({ type: "CLOSE_MODAL" });
        router.push("/profile");
      });
    } catch (error) {
      console.error(error);
    } finally {
    }
  }
}
