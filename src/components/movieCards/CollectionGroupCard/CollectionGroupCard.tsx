import Link from "next/link";

export function CollectionGroupCard({ list }: any) {
  return (
    <Link
      href={`/list/${list.name}`}
      className=" flex h-52 cursor-pointer flex-col items-start justify-center rounded-lg border-2  border-gray-700 p-2 transition-colors duration-200 hover:border-gray-500 hover:bg-base-200"
    >
      <div className="flex">
        {list?.documents
          .filter((list: any) => list.image)
          .map((doc: any, idx: number) => {
            return (
              <div key={doc.movieId} className={`${idx > 0 ? "-ml-8 " : ""}`}>
                <img
                  style={{ boxShadow: "2px 0 15px #000" }}
                  className=" aspect-2/3 max-h-36  rounded-sm "
                  src={`https://image.tmdb.org/t/p/w200/${doc.image}`}
                />
              </div>
            );
          })}
      </div>
      <div className="mt-3 font-bold"> {list.name}</div>
    </Link>
  );
}
