import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CollectionColumnCard,
  CollectionGridCard,
} from "@/components/movieCards";

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
        <CollectionColumnCard
          attributes={attributes}
          listeners={listeners}
          idx={idx}
          image={image}
          title={title}
          deleteMovie={deleteMovie}
          id={id}
        />
      ) : (
        <CollectionGridCard
          attributes={attributes}
          listeners={listeners}
          idx={idx}
          image={image}
          title={title}
          deleteMovie={deleteMovie}
          id={id}
        />
      )}
    </div>
  );
}
