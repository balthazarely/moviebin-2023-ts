import { useRouter } from "next/router";
import {
  useCollection,
  useCollectionDataOnce,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useOtherUserNestedCollections } from "../../../../lib/hooks";
import { firestore } from "../../../../lib/firebase";
import { PageWidthWrapper } from "@/components/layout";
import { convertToDate } from "../../../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getNestedUserCollectionsAndDocs } from "../../../../lib/api";
import { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/elements/UIElements";
import {
  CollectionMovieGrid,
  CollectionMovieGridPublic,
  ListMovieGridPublic,
} from "@/components/movieGrids";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Image from "next/image";
import { ProfileReviewsPublic } from "@/components/elements/profileElements";

export default function SingleUser() {
  const router = useRouter();
  const { uid } = router.query;
  const [tabSelected, setTabSelected] = useState<string>("lists");
  const { tab } = router.query;
  const docRef = firestore.collection("users").doc(uid?.toString());
  // @ts-ignore
  const [user] = useDocumentData(docRef);

  const reviewRef = firestore
    .collection("usersreviews")
    .doc(uid?.toString())
    .collection("reviews");
  // @ts-ignore
  const [reviewData] = useCollectionDataOnce(reviewRef);

  // const documentSnapshots = reviewData?.docs as QueryDocumentSnapshot[];
  // const reviewDataWithId = documentSnapshots?.map((doc: any) => {
  //   return { reviewId: doc.id, ...doc.data() };
  // });

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

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  return (
    <PageWidthWrapper>
      <div className="mt-6 flex items-center justify-start gap-6">
        <img
          className="w-16 rounded-full"
          referrerPolicy="no-referrer"
          src={user?.photoURL ?? ""}
          alt="Image"
        />
        <div>
          <h2 className="text-xl font-bold">{user?.displayName}</h2>
          <h4 className="text-xs">
            Member since {convertToDate(user?.createdAt.toDate())}
          </h4>
        </div>
      </div>
      <div className="mt-16">
        <div className="text-2xl font-bold">Lists</div>
        <CollectionMovieGridPublic
          data={data}
          isLoading={isLoading}
          listLink={uid}
        />
        <div className="mt-16 text-2xl font-bold">Reviews</div>
        <ProfileReviewsPublic reviewDataWithId={reviewData} />
        {/* {reviewData?.map((review: any, idx: number) => {
          return (
            <div key={idx} className="relative rounded-lg bg-base-200 p-2">
              <div className="grid grid-cols-6 gap-2">
                <div className="col-span-1 flex items-start justify-center ">
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${review?.movieImage}`}
                    alt={review.movieTitle}
                    width={80}
                    height={100}
                    className=" block aspect-2/3 object-contain "
                  />
                </div>
                <div className="col-span-5">
                  <div className="text-sm font-bold">{review?.movieTitle}</div>
                  <div className="rating rating-xs">
                    {Array(review?.rating)
                      .fill(0)
                      .map((star: any) => {
                        return (
                          <input
                            type="radio"
                            disabled
                            name="rating-2"
                            className="mask mask-star-2 bg-accent "
                          />
                        );
                      })}
                  </div>
                  <div className="mt-2 text-sm">{review?.review}</div>
                  <div className="my-4 border-b-2 border-base-100"></div>
                </div>
              </div>
            </div>
          );
        })} */}
      </div>
    </PageWidthWrapper>
  );
}
