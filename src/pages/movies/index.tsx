import {
  AddMovieCollectionDropdown,
  FullPageLoader,
  SearchInput,
} from "@/components/elements/UIElements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieCard } from "@/components/movieCards";
import { GenreBrowseGrid } from "@/components/movieGrids";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { getMovie } from "../../../lib/api";
import { auth, FirebaseUser, firestore } from "../../../lib/firebase";
import { Movie } from "../../../lib/types";

export default function Index() {
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
  const params = ["popular"];
  //"top_rated", "now_playing",

  return (
    <PageWidthWrapper className="mt-6 ">
      <SearchInput />
      <div className="z-0">
        {params.map((param) => (
          <MovieGrid key={param} param={param} />
        ))}
      </div>
      <GenreBrowseGrid />
    </PageWidthWrapper>
  );

  function MovieGrid({ param }: { param: string }) {
    const { isLoading, error, data } = useQuery([param + "-index-query"], () =>
      getMovie(param)
    );

    if (isLoading) {
      return <FullPageLoader />;
    }

    if (error) {
      return <div>errr</div>;
    }

    return (
      <>
        <Link href={`/movies/${param}`}>
          <h2 className="cursor-pointer text-xl font-bold capitalize ">
            {param.replace(/_/g, " ")} this week
          </h2>
        </Link>
        <div className="flex justify-between gap-4">
          {data?.results?.slice(0, 4).map((movie: Movie, idx: number) => {
            return (
              <MovieCard key={idx} movie={movie}>
                <AddMovieCollectionDropdown
                  userFavorites={userFavorites}
                  userRecentCollections={userRecentCollections}
                  movie={movie}
                />
              </MovieCard>
            );
          })}
        </div>
      </>
    );
  }
}
