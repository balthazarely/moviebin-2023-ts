import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ListMovieItem } from "../ListMovieItem";

export function ListMovieGrid({
  movies,
  setMovies,
  deleteMovie,
  listname,
}: any) {
  const router = useRouter();
  const { sortBy } = router.query;

  const [activeId, setActiveId] = useState<any>(null);
  const [gridType, setGridType] = useState<string>("col");

  useEffect(() => {
    if (sortBy) {
      setSortQueryParam(sortBy.toString());
    }
  }, [sortBy]);

  function setSortQueryParam(param: string) {
    setGridType(param);
    router.push(
      {
        pathname: `/list/${listname}`,
        query: { sortBy: param },
      },
      undefined,
      { shallow: true }
    );
  }

  function handleDragStart(event: any) {
    const foundItem = movies.find((movie: any) => movie.id === event.active.id);
    setActiveId(foundItem);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setMovies((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <>
      <div className="mt-2 mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{listname}</h1>
        <GridTypeSelect
          setSortQueryParam={setSortQueryParam}
          gridType={gridType}
        />
      </div>
      <DndContext
        id="0"
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <div>
          <SortableContext items={movies} strategy={rectSortingStrategy}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  gridType === "col"
                    ? "1fr"
                    : "repeat(auto-fit, minmax(120px, 1fr))",
                gridGap: 10,
                gridAutoFlow: "row dense",
              }}
            >
              {movies.map((movie: any, idx: number) => (
                <ListMovieItem
                  idx={idx}
                  gridType={gridType}
                  deleteMovie={deleteMovie}
                  key={movie.id}
                  id={movie.id}
                  title={movie.movieTitle}
                  image={movie.image}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <ListMovieItem
                idx={null}
                // className="h-full"
                gridType={gridType}
                key={activeId.id}
                id={activeId.id}
                title={activeId.movieTitle}
                image={activeId.image}
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </>
  );
}

function GridTypeSelect({ setSortQueryParam, gridType }: any) {
  return (
    <div>
      <button
        onClick={() => setSortQueryParam("grid")}
        className={`btn btn-square  ${
          gridType === "grid" ? "btn-outline" : ""
        }`}
      >
        Grid
      </button>
      <button
        onClick={() => setSortQueryParam("col")}
        className={`btn btn-square   ${
          gridType === "col" ? "btn-outline" : ""
        } `}
      >
        Col
      </button>
    </div>
  );
}
