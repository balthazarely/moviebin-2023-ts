import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";

export function ListMovieGridPublic({ movies, listname }: any) {
  const [gridType, setGridType] = useState<string>("col");
  const router = useRouter();
  const { sortBy } = router.query;

  useEffect(() => {
    if (sortBy) {
      setSortQueryParam(sortBy.toString());
    }
  }, [sortBy]);

  function setSortQueryParam(param: string) {
    setGridType(param);
  }

  return (
    <>
      <div className="mt-2 mb-2 flex items-center justify-between py-2 ">
        <div className="flex items-center gap-4 ">
          <div className="text-xl">{listname}</div>
        </div>
        <GridTypeSelect
          setSortQueryParam={setSortQueryParam}
          gridType={gridType}
        />
      </div>

      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              gridType === "col"
                ? "1fr"
                : "repeat(auto-fit, minmax(120px, 1fr))",
            gridGap: 10,
            gridAutoFlow: "row dense",
          }}
        >
          {movies.map((movie: any, idx: number) => (
            <div>
              {gridType === "col" ? (
                <div className="relative flex items-center justify-between ">
                  <div
                    className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
                      idx === null ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {idx === null ? "" : idx + 1}
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      className=" h-full w-16 object-cover"
                      src={`https://image.tmdb.org/t/p/w200/${movie.image}`}
                    />
                    <h2 className="p-2 text-left text-xs font-bold">
                      {movie.movieTitle}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div
                    className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
                      idx === null ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {/* {idx === null ? "" : idx + 1} */}
                  </div>

                  <div>
                    <img
                      className=" h-full w-full object-cover"
                      src={`https://image.tmdb.org/t/p/w200/${movie.image}`}
                    />
                  </div>
                  <div className="flex w-full justify-between">
                    <h2 className="p-2 text-left text-xs font-bold">
                      {" "}
                      {movie.movieTitle}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function GridTypeSelect({ setSortQueryParam, gridType }: any) {
  return (
    <div className="btn-group  ">
      <button
        onClick={() => setSortQueryParam("grid")}
        className={`btn   ${gridType === "grid" ? "btn-active" : ""}`}
      >
        <BsGridFill className="" />
      </button>
      <button
        onClick={() => setSortQueryParam("col")}
        className={`btn   ${gridType === "col" ? "btn-active" : ""}`}
      >
        <HiMenu />
      </button>
    </div>
  );
}
