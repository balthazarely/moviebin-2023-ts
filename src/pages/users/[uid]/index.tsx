import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useOtherUserNestedCollections } from "../../../../lib/hooks";
import { firestore } from "../../../../lib/firebase";

export default function SingleUser() {
  const router = useRouter();
  const { uid } = router.query;
  const docRef = firestore.collection("users").doc(uid?.toString());
  // @ts-ignore
  const [users, loading, error] = useDocumentData(docRef);
  const { nestedCollections } = useOtherUserNestedCollections(uid);

  return (
    <div>
      <h2>User Profile for {users?.displayName}</h2>
      <div>
        {nestedCollections?.map((list: any) => (
          <Link href={`/users/${uid}/list/${list}`}>{list}</Link>
        ))}
      </div>
    </div>
  );
}