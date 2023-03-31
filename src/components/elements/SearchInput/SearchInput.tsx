import Link from "next/link";
import React, { useEffect, useState } from "react";
import { searchForMovies } from "../../../../lib/api";
import { SmallLoader } from "../SmallLoader";
import { HiXMark } from "react-icons/hi2";

export function SearchInput() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        let movies = await searchForMovies(query);
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
    <div className="mb-4 relative w-full  flex justify-end">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type here"
        className="input input-md input-bordered w-full max-w-xs"
      />
      <div className="absolute top-3 right-3">
        {loading ? <SmallLoader /> : <></>}
      </div>
      <div className="absolute top-3 right-3">
        {!loading && query.length ? (
          <HiXMark
            className="text-2xl text-gray-400 cursor-pointer "
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
          className={`results-container bg-base-100 max-w-xs w-full  absolute top-12 ${
            totalResults < 1 ? "h-16" : "h-64 overflow-y-scroll"
          }`}
        >
          <ResultsDrawer results={results} totalResults={totalResults} />
        </div>
      )}
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
                  className="card card-side bg-base-100 shadow-xl rounded-none hover:bg-primary cursor-pointer transition duration-75 "
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
          <div className="card card-side bg-base-100 shadow-xl h-16 hover:bg-neutral cursor-pointer transition duration-75 flex justify-center items-center">
            <div className=" font-extrabold text-sm">Hmmm no results</div>
          </div>
        )}
      </>
    );
  }
}
