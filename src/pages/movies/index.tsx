import { FullPageLoader, SearchInput } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieCard } from "@/components/movieCards";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMovie } from "../../../lib/api";
import { Movie } from "../../../lib/types";

export default function Index() {
  const params = ["top_rated", "now_playing"];

  return (
    <PageWidthWrapper className="mt-6 ">
      <SearchInput />
      <div>
        {params.map((param) => (
          <MovieGrid key={param} param={param} />
        ))}
      </div>
    </PageWidthWrapper>
  );
}

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
          {param.replace(/_/g, " ")}
        </h2>
      </Link>
      <div className="flex justify-between gap-4">
        {data?.results?.slice(0, 5).map((movie: Movie, idx: number) => {
          return <MovieCard key={idx} movie={movie} />;
        })}
      </div>
    </>
  );
}
