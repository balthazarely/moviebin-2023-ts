import {
  CollectionGroupCard,
  CollectionGroupSkeletonCard,
} from "@/components/movieCards";
import { useRouter } from "next/router";

export function CollectionMovieGridPublic({ isLoading, data, listLink }: any) {
  const router = useRouter();

  return (
    <>
      {!isLoading ? (
        data.length ? (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {data.map((list: any, idx: any) => (
                <CollectionGroupCard
                  list={list}
                  key={idx}
                  listLink={listLink}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-44  w-full ">
            <div className="flex h-full flex-col items-center justify-center gap-2 ">
              <div className="text-xl font-bold">No Lists yet!</div>
              <div className="text-sm font-normal">
                To create a list, go to the Movies section and start adding.
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          {/* {users?.recentCollection?.length !== 0 && ( */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9]?.map((list: any, idx: any) => {
              return <CollectionGroupSkeletonCard key={idx} />;
            })}
          </div>
          {/* )} */}
        </>
      )}
    </>
  );
}
