import { RiDragMoveFill } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";

export function CollectionGridCard({
  attributes,
  listeners,
  idx,
  image,
  title,
  deleteMovie,
  id,
}: any) {
  return (
    <div className="relative">
      <div
        className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
          idx === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {idx === null ? "" : idx + 1}
      </div>
      <RiDragMoveFill
        {...attributes}
        {...listeners}
        className="absolute top-0 right-0 hover:bg-base-100 bg-opacity-70 bg-base-200 rounded-sm w-10 h-10 p-3  text-3xl"
      />
      <div>
        <img
          className=" w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
      </div>
      <div className="flex w-full justify-between">
        <h2 className="text-xs font-bold p-2 text-left">{title}</h2>
        <div className="dropdown dropdown-top dropdown-end">
          <label tabIndex={0} className="btn  ">
            <HiOutlineDotsHorizontal className="text-sm w-4 h-4" />
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
      </div>
    </div>
  );
}
