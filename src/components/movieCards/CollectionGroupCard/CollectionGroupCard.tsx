import Link from "next/link";

export function CollectionGroupCard({ list }: any) {
  return (
    <Link
      href={`/list/${list.name}`}
      className=" p-2 hover:border-gray-500 rounded-lg border-2 cursor-pointer transition-colors duration-200 border-gray-700  h-52 flex flex-col justify-center items-start hover:bg-base-200"
    >
      <div className="flex">
        {list?.documents.map((doc: any, idx: number) => {
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
      <div className="font-bold mt-3"> {list.name}</div>
    </Link>
  );
}
