import { FullPageLoader } from "@/components/elements/UIElements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieGrid } from "@/components/movieGrids";
import { useRouter } from "next/router";
import React from "react";
import { getMoviesWithinGenre } from "../../../lib/api";

export default function GenreID() {
  const router = useRouter();
  const { id, name } = router.query;
  return (
    <PageWidthWrapper className="pb-16">
      {id && name ? (
        <MovieGrid
          fetchFn={getMoviesWithinGenre}
          query={id.toString()}
          title={name.toString()}
        />
      ) : (
        <FullPageLoader />
      )}
    </PageWidthWrapper>
  );
}
