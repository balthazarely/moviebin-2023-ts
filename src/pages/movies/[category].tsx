// import { MovieGrid } from "@/components/MovieGrid";
import { MovieGrid } from "@/components/MovieGrid";
import { useRouter } from "next/router";
// import { MovieGrid } from "@/components/MovieGrid";
import { useContext, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import {
  getMovie,
  getMovies,
  getNestedUserCollections,
} from "../../../lib/api";
import { auth } from "../../../lib/firebase";

export default function Movies() {
  const router = useRouter();
  const { category } = router.query;
  const [nestedCollections, setNestedCollections] = useState([]);
  // @ts-ignore
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      refetchCollectionList();
    }
  }, [user]);

  async function refetchCollectionList() {
    const nested = await getNestedUserCollections(user?.uid);
    setNestedCollections(nested);
  }
  return (
    <div>
      {category && nestedCollections ? (
        <MovieGrid
          query={category}
          fetchFn={getMovies}
          title={category}
          nestedCollections={nestedCollections}
          refetchCollectionList={refetchCollectionList}
        />
      ) : (
        <div>NOTHING</div>
      )}
    </div>
  );
}
