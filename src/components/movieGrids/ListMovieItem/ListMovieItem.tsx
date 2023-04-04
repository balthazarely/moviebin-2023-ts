import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CollectionColumnCard,
  CollectionGridCard,
} from "@/components/movieCards";

// interface IListMovieGridProps {
//   movies: FirestoreMovie[];
//   setMovies: (movie: any) => void;
//   deleteMovie: (id: number) => void;
//   listname: string | undefined;
//   setModalTypeOpen: (str: string) => void;
// }

interface IListMovieItemProps {
  idx: number | null;
  gridType: string;
  deleteMovie?: (id: number) => void;
  key: number;
  id: number;
  title: string;
  image: string;
}

export function ListMovieItem({
  image,
  id,
  title,
  deleteMovie,
  idx,
  gridType,
  isDraggingCustom,
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
    // opacity: isDragging && isDraggingCustom ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
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
