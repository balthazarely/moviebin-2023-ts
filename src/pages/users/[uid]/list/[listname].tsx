import { useRouter } from "next/router";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";

export default function Index() {
  const router = useRouter();
  const { uid, listname } = router.query;
  const query = collection(db, "users", `${uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {docs
        ?.sort((a, b) => a.order - b.order)
        ?.map((movie) => {
          return <div>{movie.movieTitle}</div>;
        })}
    </div>
  );
}
