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
import {
  useCollection,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { CollectionMovieGrid } from "@/components/movieGrids";
import { UserDoc } from "../../lib/types";
import { QueryDocumentSnapshot } from "firebase/firestore";

export default function Collections() {
  const router = useRouter();
  const { tab } = router.query;
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const [tabSelected, setTabSelected] = useState<string>("lists");
  const docRef = firestore.collection("users").doc(user?.uid?.toString());
  const reviewRef = firestore
    .collection("usersreviews")
    .doc(user?.uid?.toString())
    .collection("reviews");
  // @ts-ignore
  const [userDoc] = useDocumentDataOnce<UserDoc>(docRef);
  // @ts-ignore
  const [reviewData] = useCollection(reviewRef);

  const documentSnapshots = reviewData?.docs as QueryDocumentSnapshot[];
  const reviewDataWithId = documentSnapshots?.map((doc: any) => {
    return { reviewId: doc.id, ...doc.data() };
  });

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

  return (
    <PageWidthWrapper>
      <ProfileInfo
        user={user}
        userDoc={userDoc}
        setTabSelected={setTabSelected}
        tabSelected={tabSelected}
        movieDataLength={data?.length}
        reviewDataLength={reviewDataWithId?.length}
      />
      <div>
        {tabSelected === "lists" && (
          <CollectionMovieGrid
            data={data}
            isLoading={isLoading}
            users={userDoc}
          />
        )}

        {tabSelected === "reviews" && (
          <ProfileReviews reviewDataWithId={reviewDataWithId} />
        )}
      </div>
    </PageWidthWrapper>
  );
}
