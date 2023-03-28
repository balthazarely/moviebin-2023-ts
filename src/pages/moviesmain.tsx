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
  const { isLoading, error, data } = useQuery([param], () => fetchData(param));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div>errr</div>;
  }

  return (
    <div className="mt-6">
      <Link href={"/movies/now_playing"}>
        <h2 className=" text-xl font-bold capitalize">
          {param.replace(/_/g, " ")}
        </h2>
      </Link>
      <div className="flex gap-4">
        {data?.results?.slice(0, 4).map((movie: any) => {
          return (
            <div className=" cursor-pointer ">
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
