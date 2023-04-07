import React, { useContext, useEffect, useState } from "react";
import { getMovieRecommendations } from "../../../../lib/api";
import { UIContext } from "../../../../lib/context";
import { createAndAddMultipleDocumentsToCollection } from "../../../../lib/firebaseMovies";
import { useNestedUserCollectionsHook } from "../../../../lib/hooks";
import { doesCollectionNameExist } from "../../../../lib/utils";
import { HiX } from "react-icons/hi";

export function MagicCollectionModal({ movies }: any) {
  const { dispatch } = useContext(UIContext);
  const { nestedCollectionsFromHook } = useNestedUserCollectionsHook();

  const [magicPlaylistLoading, setMagicPlaylistLoading] = useState(false);
  const [magicPlaylistBtnDisabled, setMagicPlaylistBtnDisabled] =
    useState(true);
  const [magicPlaylistErrMsg, setMagicPlaylistErrMsg] = useState("");
  const [magicPlaylistName, setMagicPlaylistName] = useState("");

  useEffect(() => {
    const doesColNameExist = doesCollectionNameExist(
      nestedCollectionsFromHook,
      magicPlaylistName
    );

    if (doesColNameExist) {
      setMagicPlaylistBtnDisabled(true);
      setMagicPlaylistErrMsg("Collection already exists");
    } else if (magicPlaylistName.length < 3) {
      setMagicPlaylistBtnDisabled(true);
      setMagicPlaylistErrMsg("Name must be more than 2 charactures");
    } else {
      setMagicPlaylistBtnDisabled(false);
      setMagicPlaylistErrMsg("");
    }
  }, [magicPlaylistName]);

  const handleInputChange = (event: any) => {
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9\s]/g, "");
    setMagicPlaylistName(sanitizedInput);
  };

  async function getRecommendations() {
    const movieRecomendationsArray = movies.map(async (movie: any) => {
      return await getMovieRecommendations(movie.movieId);
    });
    const recommendations = await Promise.all(movieRecomendationsArray);
    const sortedRecomendations = recommendations.map((rec) =>
      rec.results
        .sort((a: any, b: any) => b.popularity - a.popularity)
        .slice(0, 6)
    );
    const flattenedSortedRecommendations = [...sortedRecomendations.flat()]
      .filter(
        (obj, index, self) => index === self.findIndex((t) => t.id === obj.id)
      )
      .filter((obj) => !movies.some((item: any) => item.id === obj.id));

    try {
      setMagicPlaylistLoading(true);
      await createAndAddMultipleDocumentsToCollection(
        flattenedSortedRecommendations,
        magicPlaylistName
      );
      setMagicPlaylistLoading(false);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {}
  }

  return (
    <div className=" relative  h-full w-full text-center">
      <button
        className="btn-ghost btn-sm btn absolute -top-4 -right-4 border-none "
        onClick={() => dispatch({ type: "CLOSE_MODAL" })}
      >
        <HiX />
      </button>
      <h3 className="text-lg font-bold">
        Do you want to make a magic playlist?
      </h3>
      <input
        type="text"
        value={magicPlaylistName}
        onChange={handleInputChange}
        className="input-bordered input-primary input mt-4 w-full  "
      />
      <div className="mt-4 flex justify-center gap-4">
        <button
          disabled={magicPlaylistBtnDisabled}
          className={`btn-primary btn ${magicPlaylistLoading ? "loading" : ""}`}
          onClick={() => getRecommendations()}
        >
          {magicPlaylistErrMsg ? magicPlaylistErrMsg : "Create Magic Playlist"}
        </button>
      </div>
    </div>
  );
}
