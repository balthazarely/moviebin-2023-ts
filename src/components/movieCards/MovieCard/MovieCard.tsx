import { SmallLoader } from "@/components/elements/UIElements";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Movie } from "../../../../lib/types";

export function MovieCard({
  movie,
  children,
  useLoader = false,
}: {
  movie: Movie;
  children?: React.ReactNode;
  useLoader?: boolean;
}) {
  const [imgLoaded, setImageLoaded] = useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  return (
    <div className="group relative aspect-2/3 max-w-sm cursor-pointer rounded-sm border-0 transition-all duration-100 sm:border-4 sm:border-transparent sm:hover:border-gray-100">
      <Link href={`/movie/${movie.id}`}>
        {movie?.poster_path ? (
          <>
            <Image
              alt={movie?.title}
              width={200}
              height={300}
              className="h-full w-full rounded-lg object-cover"
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              loader={({ src }) => `${src}`}
              onLoad={handleImageLoaded}
            />
            {useLoader === true ? (
              !imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral">
                  <SmallLoader />
                </div>
              )
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral object-cover p-2 text-center">
            {movie?.title}
          </div>
        )}
      </Link>

      <div className="absolute bottom-0 left-0 z-50 h-10 w-1/2 translate-x-1/2 transform justify-center group-hover:block sm:hidden">
        <div className="h-8 rounded-md bg-black bg-opacity-80 p-1">
          {children}
        </div>
      </div>
    </div>
  );
}

{
  /* {movie?.poster_path ? ( */
}
{
  /* ) : (
  <div className="flex h-full w-full items-center justify-center rounded-lg bg-neutral object-cover p-2 text-center">
    {movie?.title}
  </div>
)} */
}
