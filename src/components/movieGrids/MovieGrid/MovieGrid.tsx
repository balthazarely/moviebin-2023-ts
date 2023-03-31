import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements";
import { auth, firestore } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { MovieCard } from "@/components/movieCards";

export function MovieGrid({ fetchFn, title, query }: any) {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userData, loading, error] = useDocumentData(docRef);

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
  console.log(data);

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
          page?.results?.map((movie: any, idx: any) => (
            <MovieCard key={idx} movie={movie}>
              <AddMovieCollectionDropdown
                movie={movie}
                recentCollection={userData?.recentCollection}
              />
            </MovieCard>
          ))
        )}
      </div>
      <div className="btn-containe w-full flex justify-center mt-16">
        <button className="btn btn-primary" onClick={() => fetchNextPage()}>
          Load More
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
