import {
  CollectionGroupCard,
  CollectionGroupSkeletonCard,
} from "@/components/movieCards";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export function CollectionMovieGrid({ isLoading, data, users }: any) {
  const router = useRouter();
  const { sortBy } = router.query;
  const [reverseOrder, setReverseOrder] = useState("asc");

  const sortedData = data?.sort((a: any, b: any) =>
    a.name.localeCompare(b.name)
  );

  if (reverseOrder === "desc" && sortedData) {
    sortedData.reverse();
  }

  if (reverseOrder === "asc" && sortedData) {
    sortedData;
  }

  useEffect(() => {
    if (sortBy) {
      setSortQueryParam(sortBy.toString());
    }
  }, [sortBy]);

  function setSortQueryParam(param: string) {
    setReverseOrder(param);
    router.push(
      {
        pathname: `/collections/`,
        query: { sortBy: param },
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <>
      <CollectionSortingPanel />
      {!isLoading ? (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {sortedData.map((list: any, idx: any) => (
              <CollectionGroupCard list={list} key={idx} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {users?.recentCollection?.length !== 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((list: any, idx: any) => {
                return <CollectionGroupSkeletonCard key={idx} />;
              })}
            </div>
          )}
        </>
      )}
    </>
  );

  function CollectionSortingPanel() {
    return (
      <div className="mb-4 flex justify-end">
        <div className="btn-group  ">
          <button
            onClick={() => setSortQueryParam("asc")}
            className={`btn-xs btn   ${
              reverseOrder === "asc" ? "btn-active" : ""
            }`}
          >
            Ascending
          </button>
          <button
            onClick={() => setSortQueryParam("desc")}
            className={`btn-xs btn  ${
              reverseOrder === "desc" ? "btn-active" : ""
            }`}
          >
            Descending
          </button>
        </div>
      </div>
    );
  }
}
