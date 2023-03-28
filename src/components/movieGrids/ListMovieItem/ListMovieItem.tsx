import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDragMoveFill } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export function ListMovieItem({
  image,
  id,
  title,
  deleteMovie,
  idx,
  gridType,
  className,
}: any) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    transition: {
      duration: 300,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} className={` ${className}`} style={style}>
      {gridType === "col" ? (
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
              <label
                tabIndex={0}
                className="btn hover:bg-base-100  bg-base-200 "
              >
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
                  <div className="text-xs">View Movie</div>
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
      ) : (
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
                  <div className="text-xs">View Movie</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
