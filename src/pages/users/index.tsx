import { useRouter } from "next/router";
import { MovieGrid } from "@/components/MovieGrid";
// import { getMovie, getMovies, getNowPlayingMovies } from "lib/api";
// import { UserContext } from "lib/context";
import { useContext, useEffect, useState } from "react";
// import { getNestedUserCollections } from "lib/api";
// import { auth, db, firestore } from "lib/firebase";
import {
  useCollectionData,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import Link from "next/link";
import { firestore } from "../../../lib/firebase";

export default function Users() {
  const docRef = firestore.collection("users");
  const [users, loading, error] = useCollectionData(docRef);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div>
      {users?.map((user) => (
        <div>
          <Link href={`/users/${user.uid}`}>
            {user.displayName}: {user.email}
          </Link>
        </div>
      ))}
    </div>
  );
}
