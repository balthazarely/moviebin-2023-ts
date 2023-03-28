import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import {
  addMovieToCollection,
  addMovieToNewCollection,
} from "../../lib/firebaseFunctions";
import { auth } from "../../lib/firebase";

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

  console.log(data);

  return (
    <>
      <div>
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
      } finally {
        setDbLoading(false);
      }
    } else {
      console.error("list already existis");
    }
  }

  return (
    <div>
      <Link href={`/movie/${movie.id}`}>
        <h4>{movie.title}</h4>
      </Link>

      {nestedCollections?.map((list: any) => {
        return (
          <button
            key={list}
            disabled={dbLoading}
            onClick={() => addToCollection(movie, list)}
          >
            {list}
          </button>
        );
      })}
      <button
        style={{ background: "yellow" }}
        onClick={() => createAndAddToCollection(movie)}
      >
        Create new collection with movie
      </button>
      <input
        placeholder="new collection name"
        onChange={(e) => setNewCollectionName(e.target.value)}
      />
    </div>
  );
}
