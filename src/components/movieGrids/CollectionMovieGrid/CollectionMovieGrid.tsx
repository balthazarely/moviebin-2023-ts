import {
  CollectionGroupCard,
  CollectionGroupSkeletonCard,
} from "@/components/movieCards";
import React from "react";

export function CollectionMovieGrid({ isLoading, data, users }: any) {
  return (
    <>
      {!isLoading ? (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {data?.map((list: any, idx: any) => {
              return <CollectionGroupCard list={list} key={idx} />;
            })}
          </div>
        </div>
      ) : (
        <>
          {users?.recentCollection?.length !== 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((list: any, idx: any) => {
                return <CollectionGroupSkeletonCard key={idx} />;
              })}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
}
