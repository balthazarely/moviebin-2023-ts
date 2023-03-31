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
    <div className="flex relative justify-between items-center ">
      <div
        className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
          idx === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {idx === null ? "" : idx + 1}
      </div>

      <div className="flex items-center gap-4">
        <img
          className=" w-16 h-full object-cover"
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
        <h2 className="text-xs font-bold p-2 text-left">{title}</h2>
      </div>
      <div className="flex justify-center items-center">
        <div className="dropdown dropdown-bottom dropdown-end">
          <label tabIndex={0} className="btn hover:bg-base-100  bg-base-200 ">
            <HiOutlineDotsHorizontal className="text-sm w-6 h-6" />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
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
          className="hover:bg-base-100  bg-base-200 rounded-sm w-12 h-12 p-3  mr-3 text-3xl"
        />
      </div>
    </div>
  );
}
