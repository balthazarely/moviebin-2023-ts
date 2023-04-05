import { useRouter } from "next/router";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import { FullPageLoader } from "@/components/elements";
import { PageWidthWrapper } from "@/components/layout";
import { ListMovieGridPublic } from "@/components/movieGrids";

export default function Index() {
  const router = useRouter();
  const { uid, listname } = router.query;
  const query = collection(db, "users", `${uid}/${listname}`);
  const [docs, loading, error] = useCollectionDataOnce(query);

  if (loading) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const docsFiltered = docs?.filter((doc: any) => doc.type !== "metadata");

  return (
    <PageWidthWrapper>
      <ListMovieGridPublic movies={docsFiltered} listname={listname} />
    </PageWidthWrapper>
  );
}
