import { useCollectionData } from "react-firebase-hooks/firestore";
import Link from "next/link";
import { firestore } from "../../../lib/firebase";
import { PageWidthWrapper } from "@/components/layout";

export default function Users() {
  const docRef = firestore.collection("users");
  // @ts-ignore
  const [users, loading, error] = useCollectionData(docRef);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <PageWidthWrapper>
      <div className="grid grid-cols-4">
        {users?.map((user) => (
          <Link href={`/users/${user.uid}`}>
            <div className="mt-6 flex flex-col items-center justify-center gap-6">
              <img
                className="w-16 rounded-full"
                referrerPolicy="no-referrer"
                src={user?.photoURL ?? ""}
                alt="Image"
              />
              <div>{user.displayName}</div>
            </div>
          </Link>
        ))}
      </div>
    </PageWidthWrapper>
  );
}
