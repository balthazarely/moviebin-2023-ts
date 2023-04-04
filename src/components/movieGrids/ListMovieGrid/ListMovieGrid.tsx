import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UIContext } from "../../../../lib/context";
import { VscWand } from "react-icons/vsc";
import { ListMovieItem } from "../ListMovieItem";
import { Test } from "../Test";
import { BsGridFill } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";

export function ListMovieGrid({
  movies,
  setMovies,
  deleteMovie,
  listname,
  setModalTypeOpen,
}: any) {
  const router = useRouter();
  const { sortBy } = router.query;
  const { dispatch } = useContext(UIContext);

  const [activeId, setActiveId] = useState<any>(null);
  const [gridType, setGridType] = useState<string>("col");
  const [isDraggingCustom, setIsDraggingCustom] = useState(false);

  useEffect(() => {
    if (sortBy) {
      setSortQueryParam(sortBy.toString());
    }
  }, [sortBy]);

  return (
    <>
      <div className="mt-2 mb-2 flex items-center justify-between py-2 ">
        <div className="flex items-center gap-4 ">
          <button
            className="btn-sm btn bg-gradient-to-tl from-accent via-secondary to-primary bg-size-200 bg-pos-0 text-white transition-all duration-500 hover:bg-pos-100"
            onClick={() => {
              setModalTypeOpen("magic-collection");
              dispatch({ type: "OPEN_MODAL" });
            }}
          >
            Magic Playlist <VscWand className="ml-2 text-lg " />
          </button>
        </div>
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
                  isDraggingCustom={isDraggingCustom}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <Test
                idx={null}
                // className="h-full"
                gridType={gridType}
                key={activeId.id}
                id={activeId.id}
                title={activeId.movieTitle}
                image={activeId.image}
              />
            ) : (
              <></>
            )}
          </DragOverlay>
        </div>
      </DndContext>
    </>
  );

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
    setIsDraggingCustom(false);
    console.log("drag start");

    setTimeout(() => setIsDraggingCustom(true), 200);
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
}

function GridTypeSelect({ setSortQueryParam, gridType }: any) {
  return (
    <div className="btn-group  ">
      <button
        onClick={() => setSortQueryParam("grid")}
        className={`btn   ${gridType === "grid" ? "btn-active" : ""}`}
      >
        <BsGridFill className="" />
      </button>
      <button
        onClick={() => setSortQueryParam("col")}
        className={`btn   ${gridType === "col" ? "btn-active" : ""}`}
      >
        <HiMenu />
      </button>
    </div>
  );
}
