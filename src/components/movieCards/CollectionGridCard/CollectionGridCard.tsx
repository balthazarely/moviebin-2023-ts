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
    <div className="relative rounded-md bg-base-100 bg-opacity-50 ">
      <div
        className={`absolute top-0 left-0 bg-black p-1 text-xs transition-opacity duration-500 ${
          idx === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* {idx === null ? "" : idx + 1} */}
      </div>
      <RiDragMoveFill
        {...attributes}
        {...listeners}
        className="absolute top-0 right-0 h-10 w-10 rounded-sm bg-base-200 bg-opacity-70 p-3 text-3xl  hover:bg-base-100"
      />
      <div>
        <img
          className=" h-full w-full object-cover"
          src={`https://image.tmdb.org/t/p/w200/${image}`}
        />
      </div>
      <div className="flex w-full justify-between">
        <h2 className="p-2 text-left text-xs font-bold">{title}</h2>
        <div className="dropdown-end dropdown dropdown-top">
          <label tabIndex={0} className="btn bg-transparent ">
            <HiOutlineDotsHorizontal className="h-4 w-4 text-sm" />
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
      </div>
    </div>
  );
}
