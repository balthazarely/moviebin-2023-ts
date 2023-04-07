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
    <div className="relative flex items-center justify-between rounded-md bg-base-100 bg-opacity-50 ">
      <div
        className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
          idx === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {idx === null ? "" : idx + 1}
      </div>

      <div className="flex items-center gap-4">
        <img
          {...attributes}
          {...listeners}
          className=" h-full w-16 cursor-move object-cover"
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
        <h2 className="p-2 text-left text-xs font-bold">{title}</h2>
      </div>
      <div className="flex items-center justify-center">
        <div className="dropdown-end dropdown dropdown-bottom">
          <label tabIndex={0} className=" btn-ghost btn ">
            <HiOutlineDotsHorizontal className="h-6 w-6 " />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 p-2 shadow"
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
          className=" h-12 w-12 rounded-sm  p-3  text-3xl  text-primary"
        />
      </div>
    </div>
  );
}
