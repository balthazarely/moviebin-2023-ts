// import { MovieGrid } from "@/components/MovieGrid";
import { FullPageLoader } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieGrid } from "@/components/movieGrids";
import { useQuery } from "@tanstack/react-query";

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import {
  getMovie,
  getMovies,
  getNestedUserCollections,
} from "../../../lib/api";
import { auth } from "../../../lib/firebase";

export default function Movies() {
  const router = useRouter();
  const { category } = router.query;
  // @ts-ignore
  const [user] = useAuthState(auth);

  const { isLoading, error, data, refetch } = useQuery(
    ["nestCats", user],
    async () => {
      try {
        return getNestedUserCollections(user?.uid);
      } catch (error) {
        throw new Error(`An error occurred: ${error}`);
      }
    },
    {
      enabled: !!user,
    }
  );
  if (isLoading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <PageWidthWrapper>
      {category && data ? (
        <MovieGrid
          query={category}
          fetchFn={getMovies}
          title={category}
          nestedCollections={data}
          refetchCollectionList={refetch}
        />
      ) : (
        <FullPageLoader />
      )}
    </PageWidthWrapper>
  );
}
