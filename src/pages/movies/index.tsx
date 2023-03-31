import { FullPageLoader, SearchInput } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import { MovieCard } from "@/components/movieCards";
import { MiniMovieGrid } from "@/components/movieGrids";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

async function fetchData(param: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${param}?api_key=5e9bd2fa585826bdfc4233fb6424f425&language=en-US&page=1`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
  }
}

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

function MovieGrid({ param }: any) {
  const { isLoading, error, data } = useQuery([param + "-index-query"], () =>
    fetchData(param)
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
        <h2 className="text-xl font-bold capitalize hover:text-white duration-100 transition-all cursor-pointer">
          {param.replace(/_/g, " ")}
        </h2>
      </Link>
      <div className="flex gap-4 justify-between">
        {data?.results?.slice(0, 5).map((movie: any, idx: number) => {
          return <MovieCard key={idx} movie={movie} />;
        })}
      </div>
    </>
  );
}
