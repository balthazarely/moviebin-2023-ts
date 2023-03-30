import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements";
import Link from "next/link";

export function MovieGrid({ fetchFn, title, query }: any) {
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gridGap: 10,
          gridAutoFlow: "row dense",
        }}
      >
        {data?.pages.map((page: any) =>
          page?.results.map((movie: any, idx: any) => (
            <MovieCardWrapper key={idx} movie={movie} />
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

function MovieCardWrapper({ movie }: any) {
  return (
    <div className="relative  group hover:border-white border-4 border-transparent cursor-pointer">
      <Link href={`/movie/${movie.id}`}>
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
        />
      </Link>
      <AddMovieCollectionDropdown movie={movie} />
    </div>
  );
}
