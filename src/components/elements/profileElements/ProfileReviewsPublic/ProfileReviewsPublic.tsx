import Image from "next/image";

export function ProfileReviewsPublic({ reviewDataWithId }: any) {
  return (
    <div className="grid w-full grid-cols-1 gap-2">
      {reviewDataWithId?.map((review: any, idx: number) => {
        return (
          <div key={idx} className="relative rounded-lg bg-base-200 p-2">
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-1 flex items-start justify-center ">
                <Image
                  src={`https://image.tmdb.org/t/p/w200${review?.movieImage}`}
                  alt={review.movieTitle}
                  width={80}
                  height={100}
                  className=" block aspect-2/3 object-contain "
                />
              </div>
              <div className="col-span-5">
                <div className="text-sm font-bold">{review?.movieTitle}</div>
                <div className="rating rating-xs">
                  {Array(review?.rating)
                    .fill(0)
                    .map((star: any, idx: number) => {
                      return (
                        <input
                          key={idx}
                          type="radio"
                          disabled
                          name="rating-2"
                          className="mask mask-star-2 bg-primary "
                        />
                      );
                    })}
                </div>
                <div className="mt-2 text-sm">{review?.review}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
