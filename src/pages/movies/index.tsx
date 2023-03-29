import { FullPageLoader } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
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
    console.error(error);
  }
}

export default function Index() {
  const params = ["top_rated", "now_playing"];

  return (
    <div>
      {params.map((param) => (
        <QueryParam key={param} param={param} />
      ))}
    </div>
  );
}

function QueryParam({ param }: any) {
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
    <PageWidthWrapper className="mt-6">
      <Link href={`/movies/${param}`}>
        <h2 className=" text-xl font-bold capitalize">
          {param.replace(/_/g, " ")}
        </h2>
      </Link>
      <div className="flex gap-4">
        {data?.results?.slice(0, 4).map((movie: any, idx: number) => {
          return (
            <div className=" cursor-pointer " key={idx}>
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              />
            </div>
          );
        })}
      </div>
    </PageWidthWrapper>
  );
}
