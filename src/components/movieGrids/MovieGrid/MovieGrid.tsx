import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  addMovieToCollection,
  createAndAddToCollection,
} from "../../../../lib/firebaseFunctions";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FullPageLoader, ModalWrapper } from "@/components/elements";
import { UIContext } from "../../../../lib/context";

export function MovieGrid({
  fetchFn,
  title,
  nestedCollections,
  refetchCollectionList,
  query,
}: any) {
  const { dispatch } = useContext(UIContext);

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
    return <FullPageLoader />;
  }

  if (isError) {
    return <h2>"error"</h2>;
  }

  return (
    <>
      <button onClick={() => dispatch({ type: "OPEN_MODAL" })}>
        lord test bgm
      </button>
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
  const { dispatch } = useContext(UIContext);

  async function addMovieToNewCollection(movie: any) {
    try {
      setDbLoading(true);
      await createAndAddToCollection({
        movie,
        newCollectionName,
        nestedCollections,
        setDbLoading,
        setDbError,
        setNewCollectionName,
      });
      setDbLoading(false);
      await refetchCollectionList();
    } catch (error) {
    } finally {
      toggleModalAndClearForm("CLOSE_MODAL");
    }
  }

  async function addMovieToExistingCollection(movie: any, collectionName: any) {
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
      try {
        setDbLoading(true);
        await addMovieToCollection(movie, collectionName);
        await refetchCollectionList();
        setDbLoading(false);
      } catch (error) {
      } finally {
        toggleModalAndClearForm("CLOSE_MODAL");
      }
    }
  }

  const toggleModalAndClearForm = (modalState: string) => {
    setDbError("");
    setNewCollectionName("");
    dispatch({ type: modalState });
  };

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
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52  "
        >
          {nestedCollections?.map((list: any, idx: number) => {
            return (
              <li className="text-xs" key={idx}>
                <div onClick={() => addMovieToExistingCollection(movie, list)}>
                  Add to {list}
                </div>
              </li>
            );
          })}
          <li>
            <button
              className="text-xs"
              onClick={() => toggleModalAndClearForm("OPEN_MODAL")}
            >
              Add to new collection
            </button>
          </li>
        </ul>
        <ModalWrapper>
          <CreateCollectionModal
            addMovieToNewCollection={addMovieToNewCollection}
            newCollectionName={newCollectionName}
            setNewCollectionName={setNewCollectionName}
            movie={movie}
            dbError={dbError}
            setDbError={setDbError}
          />
        </ModalWrapper>
      </div>
    </div>
  );
}

function CreateCollectionModal({
  addMovieToNewCollection,
  setNewCollectionName,
  newCollectionName,
  movie,
  dbError,
  toggleModalAndClearForm,
}: any) {
  return (
    <>
      <div className="h-full w-full text-center relative">
        {movie.title}
        <button
          onClick={() => toggleModalAndClearForm("CLOSE_MODAL")}
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
          <h1> {dbError}</h1>
          <button
            className="btn-primary btn"
            disabled={newCollectionName.length < 1}
            onClick={() => addMovieToNewCollection(movie)}
          >
            Create new collection with movie
          </button>
        </div>
      </div>
    </>
  );
}
