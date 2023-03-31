import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements";
import { auth, firestore } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { MovieCard } from "@/components/movieCards";
import { Movie } from "../../../../lib/types";

interface IMovieGridProps {
  fetchFn: ({ query, params }: any) => any;
  title: string;
  query: string;
}

export function MovieGrid({ fetchFn, title, query }: IMovieGridProps) {
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
          page?.results?.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie}>
              <AddMovieCollectionDropdown
                movie={movie}
                recentCollection={userData?.recentCollection}
              />
            </MovieCard>
          ))
        )}
      </div>
      <div className="btn-containe mt-16 flex w-full justify-center">
        <button className="btn-primary btn" onClick={() => fetchNextPage()}>
          Load More
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
