import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AddMovieCollectionDropdown,
  FullPageLoader,
} from "@/components/elements/UIElements";
import { auth, firestore } from "../../../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { MovieCard } from "@/components/movieCards";
import { Movie } from "../../../../lib/types";

interface IMovieGridProps {
  fetchFn: ({ query, params }: any) => any;
  title: string;
  query: string;
}

export function MovieGrid({ fetchFn, title, query }: IMovieGridProps) {
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const docRef = firestore
    .collection("usersfavorites")
    .doc(user?.uid?.toString())
    .collection("favorites");
  // @ts-ignore
  const [userFavorites, loading, error] = useCollectionData(docRef);

  const docRefs = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userRecentCollections] = useDocumentData<UserDoc>(docRefs);

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

  return (
    <>
      <h2 className="cursor-pointer text-xl font-bold capitalize ">{title}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gridGap: 10,
          gridAutoFlow: "row dense",
        }}
      >
        {data?.pages.map((page: any) =>
          page?.results?.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie}>
              <AddMovieCollectionDropdown
                userFavorites={userFavorites}
                userRecentCollections={userRecentCollections}
                movie={movie}
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
