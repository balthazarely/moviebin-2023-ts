import Link from "next/link";
import React, { useEffect, useState } from "react";
import { searchForMovies } from "../../../../../lib/api";
import { SmallLoader } from "../SmallLoader";
import { HiXMark } from "react-icons/hi2";

import { MobileSearchInput } from "../MobileSearchInput";

export function SearchInput() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        let movies = await searchForMovies({ query });
        setResults(movies.results);
        setTotalResults(movies.total_results);
        setLoading(false);
      } else {
        setResults([]);
        setTotalResults(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const clearAll = () => {
    setQuery("");
    setResults([]);
    setTotalResults(null);
  };

  return (
    <div className="mb-4 ">
      <div className="desktop-search relative z-50 hidden w-full justify-end sm:flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies"
          className="input-bordered input input-md w-full max-w-xs"
        />
        <div className="absolute top-3 right-3">
          {loading ? <SmallLoader /> : <></>}
        </div>
        <div className="absolute top-3 right-3">
          {!loading && query.length ? (
            <HiXMark
              className="cursor-pointer text-2xl text-gray-400 "
              onClick={clearAll}
            />
          ) : (
            <></>
          )}
        </div>
        {totalResults === null ? (
          <></>
        ) : (
          <div
            className={`results-container absolute top-12 w-full  max-w-xs bg-base-100 ${
              totalResults < 1 ? "h-16" : "h-64 overflow-y-scroll"
            }`}
          >
            <ResultsDrawer results={results} totalResults={totalResults} />
          </div>
        )}
      </div>
      <MobileSearchInput className="visible sm:hidden" />
    </div>
  );

  function ResultsDrawer({ results, totalResults }: any) {
    return (
      <>
        {totalResults > 0 ? (
          results
            ?.sort((a: any, b: any) => b.popularity - a.popularity)
            .map((result: any) => {
              return (
                <div
                  key={result?.id}
                  className="card card-side cursor-pointer rounded-none bg-base-100 shadow-xl transition duration-75 hover:bg-primary "
                >
                  <Link href={`/movie/${result?.id}`}>
                    <div className="card-body py-2 px-4">
                      <h2 className="card-title text-sm">
                        <div className="font-bold">{result?.title}</div>
                        <div className="font-normal">
                          ({result?.release_date?.slice(0, 4)})
                        </div>
                      </h2>
                    </div>
                  </Link>
                </div>
              );
            })
        ) : (
          <div className="card card-side flex h-16 cursor-pointer items-center justify-center bg-base-100 shadow-xl transition duration-75 hover:bg-neutral">
            <div className=" text-sm font-extrabold">Hmmm no results</div>
          </div>
        )}
      </>
    );
  }
}
