import { FullPageLoader } from "@/components/elements/UIElements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieGrid } from "@/components/movieGrids";
import { useRouter } from "next/router";
import { getMovies } from "../../../lib/api";

export default function Movies() {
  const router = useRouter();
  const { category } = router.query;
  return (
    <PageWidthWrapper className="pb-16">
      {category ? (
        <MovieGrid
          query={category.toString()}
          fetchFn={getMovies}
          title={category.toString()}
        />
      ) : (
        <FullPageLoader />
      )}
    </PageWidthWrapper>
  );
}
