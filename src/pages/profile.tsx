// import { UserContext } from "lib/context";
// import { useNestedUserCollections } from "lib/hooks";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../lib/firebase";
import { useNestedUserCollections } from "../../lib/hooks";
// import { auth, db, firestore } from "lib/firebase";

export default function Profile() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const { nestedCollections } = useNestedUserCollections();
  const [userReviews, setUserReviews] = useState<any>([]);

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

  useEffect(() => {
    if (user) {
      getMovieUserReviews();
    }
  }, [user]);

  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <h3 className="mt-10 text-2xl">Lists</h3>
        {nestedCollections?.map((list: any, idx: any) => {
          return (
            <div key={idx}>
              <Link href={`/list/${list}`}>{list}</Link>
            </div>
          );
        })}
        <h3 className="mt-10">Reviews</h3>
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
    );
  }
  return <div>NOT LOGGED</div>;
}
