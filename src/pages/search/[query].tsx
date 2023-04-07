import {
  FullPageLoader,
  MobileSearchInput,
} from "@/components/elements/UIElements";
import { PageWidthWrapper } from "@/components/layout";
import { SearchResultsCard } from "@/components/movieCards";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { searchForMovies } from "../../../lib/api";
import { Movie } from "../../../lib/types";

export default function Search() {
  const router = useRouter();
  const { query } = router.query;

  const {
    isLoading,
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    ["search-results"],
    ({ pageParam = 1 }) => searchForMovies({ query, pageParam }),
    {
      staleTime: 10000,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [query]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <PageWidthWrapper>
      <MobileSearchInput className="mt-4" />
      <h2 className="mt-4 mb-4 cursor-pointer text-xl font-bold capitalize">
        Results for: {query}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gridGap: 10,
          gridAutoFlow: "row dense",
        }}
      >
        {data?.pages.map((page: any) =>
          page?.results?.map((movie: Movie) => (
            <SearchResultsCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
      <div className="btn-containe mt-16 flex w-full justify-center">
        <button className="btn-primary btn" onClick={() => fetchNextPage()}>
          Load More
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </PageWidthWrapper>
  );
}
