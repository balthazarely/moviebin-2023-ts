// import { UserContext } from "lib/context";
// import { useNestedUserCollections } from "lib/hooks";
import { FullPageLoader } from "@/components/elements";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getNestedUserCollectionsAndDocs } from "../../lib/api";
import { auth, firestore } from "../../lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import { PageWidthWrapper } from "@/components/layout";

export default function Profile() {
  const router = useRouter();
  const { tab } = router.query;
  // @ts-ignore
  const [user] = useAuthState(auth);
  const [userReviews, setUserReviews] = useState<any>([]);
  const [tabSelected, setTabSelected] = useState<string>("lists");

  const { isLoading, error, data, refetch } = useQuery(
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

  const getMovieUserReviews = async () => {
    // Make this a hook to get realtime updatres
    const subCollectionRef = firestore
      .collection("userreviews")
      .doc(user?.uid.toString())
      .collection("reviews");
    try {
      const querySnapshot = await subCollectionRef.get();
      if (!querySnapshot.empty) {
        let tempmoviesReviews: any = [];
        querySnapshot.forEach((doc) => {
          console.log("Subcollection document data:", doc.data());
          tempmoviesReviews.push(doc.data());
        });
        setUserReviews(tempmoviesReviews);
      } else {
        console.log("No documents in subcollection.");
      }
    } catch (error) {
      console.log("Error getting subcollection documents:", error);
    }
  };

  function toggleTabs(tab: string) {
    setTabSelected(tab);
    router.push(
      {
        pathname: `/profile`,
        query: { tab: tab },
      },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    if (tab) {
      setTabSelected(tab.toString());
    }
  }, [tab]);

  useEffect(() => {
    if (user) {
      getMovieUserReviews();
    }
  }, [user]);

  if (!user) {
    return <FullPageLoader />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {JSON.stringify(error)}</div>;
  }
  return (
    <PageWidthWrapper>
      <div className="flex justify-start items-center gap-6">
        <img
          className="rounded-full w-16"
          referrerPolicy="no-referrer"
          src={user?.photoURL ?? ""}
          alt="Image"
        />
        <div>
          <h2 className="text-xl font-bold">{user?.displayName}</h2>
          <h2 className="">
            {data?.length} {data?.length === 1 ? "list" : "list"}
          </h2>
        </div>
      </div>
      <div className="tabs mt-6 mb-4">
        <button
          onClick={() => toggleTabs("lists")}
          className={`tab tab-lifted ${
            tabSelected === "lists" ? "tab-active" : ""
          }`}
        >
          My Lists
        </button>
        <button
          onClick={() => toggleTabs("reviews")}
          className={`tab tab-lifted ${
            tabSelected === "reviews" ? "tab-active" : ""
          }`}
        >
          My Reviews
        </button>
      </div>
      <div>
        {isLoading && <FullPageLoader />}
        {tabSelected === "lists" && (
          <div className="w-full">
            <h3 className="mb-2 text-lg font-black w-full">My Movie Lists</h3>
            <div className="grid grid-cols-1 md:grid-cols-2">
              {data?.map((list: any, idx: any) => {
                return (
                  <div key={idx} className="mb-4">
                    <Link href={`/list/${list.name}`}>
                      <div className="font-bold"> {list.name}</div>

                      <div className="flex">
                        {list?.documents.map((doc: any) => {
                          return (
                            <div key={doc.movieId}>
                              <img
                                className="h-28"
                                src={`https://image.tmdb.org/t/p/w200/${doc.image}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tabSelected === "reviews" && (
          <div className="w-full">
            <h3 className="mt-10 font-extrabold underline underline-offset-4 w-full">
              My Reviews
            </h3>
            {userReviews?.map((list: any, idx: any) => {
              return (
                <div key={idx}>
                  <p>
                    {list.movieTitle} : {list.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWidthWrapper>
  );
}
