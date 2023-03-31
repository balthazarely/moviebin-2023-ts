import Link from "next/link";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiDragMoveFill } from "react-icons/ri";

export function CollectionColumnCard({
  attributes,
  listeners,
  idx,
  image,
  title,
  deleteMovie,
  id,
}: any) {
  return (
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
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
        <h2 className="p-2 text-left text-xs font-bold">{title}</h2>
      </div>
      <div className="flex items-center justify-center">
        <div className="dropdown-bottom dropdown-end dropdown">
          <label tabIndex={0} className="btn bg-base-200  hover:bg-base-100 ">
            <HiOutlineDotsHorizontal className="h-6 w-6 text-sm" />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            <li onClick={() => deleteMovie(id)}>
              <div className="text-xs">Remove</div>
            </li>
            <li>
              <Link href={`/movie/${id}`} className="text-xs">
                View Movie
              </Link>
            </li>
          </ul>
        </div>
        <RiDragMoveFill
          {...attributes}
          {...listeners}
          className="mr-3  h-12 w-12 rounded-sm bg-base-200 p-3  text-3xl hover:bg-base-100"
        />
      </div>
    </div>
  );
}
