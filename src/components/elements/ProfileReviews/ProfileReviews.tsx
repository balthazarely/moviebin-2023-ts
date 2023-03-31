import React, { useState } from "react";

export function ProfileReviews({ user }: any) {
  const [userReviews, setUserReviews] = useState<any>([]);

  // useEffect(() => {
  //   if (user) {
  //     getMovieUserReviews();
  //   }
  // }, [user]);

  // const getMovieUserReviews = async () => {
  //   // Make this a hook to get realtime updatres
  //   const subCollectionRef = firestore
  //     .collection("userreviews")
  //     .doc(user?.uid.toString())
  //     .collection("reviews");
  //   try {
  //     const querySnapshot = await subCollectionRef.get();
  //     if (!querySnapshot.empty) {
  //       let tempmoviesReviews: any = [];
  //       querySnapshot.forEach((doc) => {
  //         tempmoviesReviews.push(doc.data());
  //       });
  //       setUserReviews(tempmoviesReviews);
  //     } else {
  //       // console.log("No documents in subcollection.");
  //     }
  //   } catch (error) {
  //     // console.log("Error getting subcollection documents:", error);
  //   }
  // };

  return (
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
  );
}
