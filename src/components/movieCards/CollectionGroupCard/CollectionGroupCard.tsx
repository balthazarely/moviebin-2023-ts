import Link from "next/link";

export function CollectionGroupCard({ list, listLink }: any) {
  return (
    <Link
      href={
        listLink ? `/users/${listLink}/list/${list.name}` : `/list/${list.name}`
      }
      className=" flex h-52 cursor-pointer flex-col items-start justify-center bg-base-200 p-2 transition-colors duration-200"
    >
      <div className="flex">
        {list?.documents
          .filter((list: any) => list.image)
          .map((doc: any, idx: number) => {
            return (
              <div key={doc.movieId} className={`${idx > 0 ? "-ml-8 " : ""}`}>
                <img
                  className=" aspect-2/3 max-h-36  rounded-sm drop-shadow-md"
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
