import {
  FullPageLoader,
  ProfileInfo,
  ProfileReviews,
} from "@/components/elements";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getNestedUserCollectionsAndDocs } from "../../lib/api";
import { auth, FirebaseUser, firestore } from "../../lib/firebase";
import { PageWidthWrapper } from "@/components/layout";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { CollectionMovieGrid } from "@/components/movieGrids";
import { UserDoc } from "../../lib/types";

export default function Collections() {
  const router = useRouter();
  const { tab } = router.query;
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const [tabSelected, setTabSelected] = useState<string>("lists");
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userDoc] = useDocumentDataOnce<UserDoc>(docRef);

  const { isLoading, error, data } = useQuery(
    ["nestedCollectionData", user],
    async () => {
      try {
        const response = await getNestedUserCollectionsAndDocs(user?.uid);
        return response;
      } catch (error) {
        throw new Error(`An error occurred: ${error}`);
      }
    },
    {
      enabled: !!user,
    }
  );

  useEffect(() => {
    if (tab) {
      setTabSelected(tab.toString());
    }
  }, [tab]);

  if (!user || !userDoc) {
    return <FullPageLoader />;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  console.log(user);
  console.log(userDoc);

  return (
    <PageWidthWrapper>
      <ProfileInfo
        user={user}
        userDoc={userDoc}
        setTabSelected={setTabSelected}
        tabSelected={tabSelected}
        data={data}
      />
      <div>
        {tabSelected === "lists" && (
          <CollectionMovieGrid
            data={data}
            isLoading={isLoading}
            users={userDoc}
          />
        )}

        {tabSelected === "reviews" && <ProfileReviews user={user} />}
      </div>
    </PageWidthWrapper>
  );
}
