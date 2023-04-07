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
        {users?.map((user: any, idx: number) => (
          <Link key={idx} href={`/users/${user.uid}`}>
            <div className="mt-6 flex flex-col items-center justify-center gap-6">
              {user?.photoURL ? (
                <div className="h-16 w-16 rounded-full object-cover">
                  <img
                    className="h-16 w-16  rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    src={
                      user?.customProfileImage
                        ? user?.customProfileImage
                        : user?.photoURL
                    }
                    alt="Image"
                  />
                </div>
              ) : (
                <div className="w-8 rounded-full bg-primary "></div>
              )}
              <div> {user?.username ? user?.username : user?.displayName}</div>
            </div>
          </Link>
        ))}
      </div>
    </PageWidthWrapper>
  );
}
