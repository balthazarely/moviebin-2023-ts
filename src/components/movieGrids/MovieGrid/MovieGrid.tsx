import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  addMovieToCollection,
  addMovieToNewCollection,
} from "../../../../lib/firebaseFunctions";
import { auth } from "../../../../lib/firebase";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ModalWrapper } from "@/components/elements";
import { UIContext } from "../../../../lib/context";

export function MovieGrid({
  fetchFn,
  title,
  nestedCollections,
  refetchCollectionList,
  query,
}: any) {
  const {
    isLoading,
    isError,
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [title],
    ({ pageParam = 1 }) => fetchFn({ query, pageParam }),
    {
      staleTime: 10000,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
      },
    }
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>"error"</h2>;
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          // gridTemplateColumns:
          //   gridType === "col" ? "1fr" : "repeat(auto-fit, minmax(120px, 1fr))",
          gridGap: 10,
          gridAutoFlow: "row dense",
        }}
      >
        {data?.pages.map((page: any) =>
          page?.results.map((movie: any, idx: any) => (
            <MovieCardWrapper
              key={idx}
              movie={movie}
              refetchCollectionList={refetchCollectionList}
              nestedCollections={nestedCollections}
            />
          ))
        )}
      </div>
      <div className="btn-container">
        <button onClick={() => fetchNextPage()}>Load More</button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}

function MovieCardWrapper({
  movie,
  nestedCollections,
  refetchCollectionList,
}: any) {
  const [dbLoading, setDbLoading] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [dbError, setDbError] = useState("");
  const [isNewCollectionModalOpen, setIsNewCollectionModalOpen] =
    useState(false);

  const { state, dispatch } = useContext(UIContext);

  async function addToCollection(movie: any, collectionName: any) {
    // Should also make a global DBLoading so that this isnt just callable from here
    try {
      setDbLoading(true);
      addMovieToCollection(movie, collectionName, auth.currentUser?.uid);
    } catch (error) {
      console.log(error);
    } finally {
      setDbLoading(false);
    }
  }

  async function createAndAddToCollection(movie: any) {
    if (!nestedCollections?.includes(newCollectionName)) {
      console.log("attempting to make new list");
      try {
        setDbLoading(true);
        await addMovieToNewCollection(
          movie,
          newCollectionName,
          auth.currentUser?.uid
        );
        await refetchCollectionList();
      } catch (error) {
        console.log(error);
        setDbError(JSON.stringify(error));
      } finally {
        setIsNewCollectionModalOpen(false);
      }
    } else {
      console.error("list already existis");
      setDbError("list already existis");
    }
  }

  function openModalAndClearForm() {
    setDbError("");
    setNewCollectionName("");
    setIsNewCollectionModalOpen(true);
  }

  return (
    <div className="relative  group hover:border-white border-4 border-transparent cursor-pointer">
      <img
        className=" w-full h-full object-cover"
        src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
      />
      <div className="dropdown  dropdown-end absolute top-0 right-0 group-hover:opacity-100 opacity-0">
        <label tabIndex={0} className="">
          <HiOutlineDotsHorizontal className="text-gray-300 bg-opacity-70 hover:text-white text-sm bg-black w-8 h-6 cursor-pointer" />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box  w-52 "
        >
          {nestedCollections?.map((list: any) => {
            return (
              <li>
                <button
                  className="text-xs"
                  key={list}
                  disabled={dbLoading}
                  onClick={() => addToCollection(movie, list)}
                >
                  Add to {list}
                </button>
              </li>
            );
          })}
          <li>
            <button className="text-xs" onClick={() => openModalAndClearForm()}>
              Add to new collection
            </button>
          </li>
        </ul>
      </div>
      <CreateCollectionModal
        isNewCollectionModalOpen={isNewCollectionModalOpen}
        setIsNewCollectionModalOpen={setIsNewCollectionModalOpen}
        createAndAddToCollection={createAndAddToCollection}
        newCollectionName={newCollectionName}
        setNewCollectionName={setNewCollectionName}
        movie={movie}
        dbError={dbError}
      />
    </div>
  );
}

function CreateCollectionModal({
  isNewCollectionModalOpen,
  setIsNewCollectionModalOpen,
  createAndAddToCollection,
  setNewCollectionName,
  newCollectionName,
  movie,
  dbError,
}: any) {
  return (
    <div>
      <input
        type="checkbox"
        checked={isNewCollectionModalOpen}
        id="my-modal-6"
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle ">
        <div className="modal-box">
          <div className="h-full w-full text-center relative">
            <button
              onClick={() => setIsNewCollectionModalOpen(false)}
              className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
            >
              x
            </button>
            <h3 className="font-bold text-lg">Add to collecion</h3>
            {/* <p className="p2-4">This might take a couple seconds so hang tight</p> */}
            <div className="flex justify-center mt-4 gap-4 flex-col">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="input w-full "
              />
              <h1> {dbError}</h1>
              <button
                className="btn-primary btn"
                onClick={() => createAndAddToCollection(movie)}
              >
                Create new collection with movie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
