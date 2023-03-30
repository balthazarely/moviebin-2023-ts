import { FullPageLoader } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieGrid } from "@/components/movieGrids";
import { useRouter } from "next/router";
import { getMovies } from "../../../lib/api";

export default function Movies() {
  const router = useRouter();
  const { category } = router.query;
  return (
    <PageWidthWrapper>
      {category ? (
        <MovieGrid query={category} fetchFn={getMovies} title={category} />
      ) : (
        <FullPageLoader />
      )}
    </PageWidthWrapper>
  );
}
