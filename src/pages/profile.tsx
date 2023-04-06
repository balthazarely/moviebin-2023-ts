import {
  ProfileFavorites,
  ProfileInfo,
  ProfileReviews,
} from "@/components/elements/profileElements";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getNestedUserCollectionsAndDocs } from "../../lib/api";
import { auth, FirebaseUser, firestore } from "../../lib/firebase";
import { PageWidthWrapper } from "@/components/layout";
import {
  useCollection,
  useCollectionData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { CollectionMovieGrid } from "@/components/movieGrids";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { FullPageLoader } from "@/components/elements/UIElements";
import { UserContext } from "../../lib/userContext";

export default function Collections() {
  const [tabSelected, setTabSelected] = useState<string>("lists");
  const router = useRouter();
  const { tab } = router.query;
  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);

  const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
  const reviewsCollectionRef = firestore
    .collection("usersreviews")
    .doc(user?.uid?.toString())
    .collection("reviews");
  const favoritesCollectionRef = firestore
    .collection("usersfavorites")
    .doc(user?.uid?.toString())
    .collection("favorites");

  // @ts-ignore
  const [userDoc, userDocLoading] = useDocumentDataOnce<any>(userDocRef);
  // @ts-ignore
  const [reviewData, reviewDataLoading] = useCollection(reviewsCollectionRef);
  // @ts-ignore
  const [favData, favsDataLoading] = useCollectionData(favoritesCollectionRef);

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

  if (!user) {
    return <FullPageLoader />;
  }

  return (
    <PageWidthWrapper>
      <ProfileInfo
        userDoc={userDoc}
        setTabSelected={setTabSelected}
        tabSelected={tabSelected}
        movieDataLength={data?.length}
        reviewDataLength={reviewDataWithId?.length}
        ProfileFavoritesLength={favData?.length}
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
          <ProfileReviews
            reviewDataWithId={reviewDataWithId}
            reviewDataLoading={reviewDataLoading}
          />
        )}
        {tabSelected === "favorites" && (
          <ProfileFavorites
            favoritesData={favData}
            favoritesDataLoading={favsDataLoading}
          />
        )}
      </div>
    </PageWidthWrapper>
  );
}
