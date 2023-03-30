// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { auth, db, firestore } from "../../../lib/firebase";
// import { useCollection } from "react-firebase-hooks/firestore";
// import { collection } from "firebase/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { getMovie } from "../../../lib/api";
// import { PageWidthWrapper } from "@/components/layout";
// import type { InferGetStaticPropsType, NextPage } from "next";
// import Image from "next/image";
// import imageOne from "public/image-1.jpeg";
// import { getPlaiceholder } from "plaiceholder";

// export default function Movie() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [movie, setMovie] = useState<any>();
//   const [comment, setComment] = useState("");
//   const [rating, setRating] = useState<string>();
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState<any>();
//   // @ts-ignore

//   const [user] = useAuthState(auth);

//   // const docRef = firestore.collection("movies").doc(id);
//   const query = collection(db, "movies", `${id}/reviews`);
//   const [userReviews, loading, error] = useCollection(query);
//   const formattedReview: any = userReviews?.docs.map((doc) => {
//     return { ...doc.data(), id: doc.id };
//   });

//   useEffect(() => {
//     async function getMovieData() {
//       let movie: any = await getMovie(id);
//       console.log(movie);
//       setMovie(movie);
//     }
//     if (id) {
//       getMovieData();
//     }
//   }, [id]);

//   async function createNewReview(movie: any) {
//     const docRef = firestore
//       .collection("movies")
//       .doc(movie.id.toString())
//       .collection("reviews");

//     const userReviewRef = firestore
//       .collection("userreviews")
//       .doc(auth.currentUser?.uid)
//       .collection("reviews");

//     try {
//       const querySnapshot = await docRef
//         .where("userId", "==", auth.currentUser?.uid)
//         .get();

//       if (!querySnapshot.empty) {
//         console.log("you've already left a review");
//       } else {
//         firestore
//           .collection("movies")
//           .doc(movie.id.toString())
//           .collection("reviews")
//           .doc()
//           .set({
//             userId: auth.currentUser?.uid,
//             userDisplayName: auth.currentUser?.displayName,
//             comment: comment,
//             rating: rating,
//             timestamp: Date.now(),
//           });

//         await userReviewRef.doc().set({
//           movieId: movie.id,
//           movieTitle: movie.title,
//           comment: comment,
//           timestamp: Date.now(),
//         });
//       }
//     } catch (error) {
//       console.log("Error getting nested documents:", error);
//     }
//   }

//   async function deleteReview(id: any) {
//     try {
//       const batch = firestore.batch();

//       const docRef1 = firestore
//         .collection("movies")
//         .doc(movie.id.toString())
//         .collection("reviews")
//         .doc(id.toString());
//       batch.delete(docRef1);

//       const docRef2 = firestore
//         .collection("userreviews")
//         .doc(auth.currentUser?.uid)
//         .collection("reviews")
//         .where("movieId", "==", movie.id);
//       const querySnapshot = await docRef2.get();
//       querySnapshot.forEach((doc) => {
//         batch.delete(doc.ref);
//       });

//       await batch.commit();
//       console.log("Batch deletion successful!");
//     } catch (error) {
//       console.error("Error removing documents: ", error);
//     }
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }
//   console.log(formattedReview);

//   return (
//     <div>
//       {/* <div
//         className="h-56 bg-base-100 z-0 bg-center	bg-no-repeat bg-cover bg-transparent relative"
//         style={{
//           backgroundImage: `url('https://image.tmdb.org/t/p/w1280/${movie?.backdrop_path}')`,
//         }}
//       >
//         <div className=" z-10 absolute top-0 left-0 bg-gradient-to-t from-neutral from-10% to-transparent to-90% w-full h-full"></div>
//       </div> */}

//       {/* <PageWidthWrapper className="py-6">
//         <div className="flex gap-6 ">
//           <div className="">
//             <img
//               className=" w-44  object-cover"
//               src={`https://image.tmdb.org/t/p/w200/${movie?.poster_path}`}
//             />
//           </div>
//           <div className="">
//             <h1 className="text-2xl font-extrabold">
//               {movie?.title}{" "}
//               <span className="font-light">
//                 ({movie?.release_date.slice(0, 4)})
//               </span>
//             </h1>
//             <div className="text-sm flex gap-2 mt-2">
//               {movie?.genres?.map((genre: any, idx: number) => {
//                 return (
//                   <div className="badge badge-sm badge-primary">
//                     {genre.name}
//                   </div>
//                 );
//               })}
//             </div>
//             <p className="mt-2 text-sm max-w-xl">{movie?.overview}</p>
//             <h3 className="mt-32 font-extrabold mb-2">User Reviews</h3>
//             {formattedReview?.map((review: any) => {
//               return (
//                 <div className="bg-base-100 p-4">
//                   <div className="font-extrabold flex justify-between">
//                     <div>{review.userDisplayName}</div>
//                     <div>{review.rating} stars </div>
//                   </div>
//                   <div className="text-sm">{review.comment} </div>
//                   <div className="w-full flex justify-end gap-2">
//                     {review.userId === user?.uid && (
//                       <>
//                         <button onClick={() => deleteReview(review.id)}>
//                           Edit
//                         </button>
//                         <button onClick={() => deleteReview(review.id)}>
//                           Del
//                         </button>
//                       </>
//                     )}{" "}
//                   </div>
//                 </div>
//               );
//             })}
//             <div style={{ marginTop: "16px" }}>
//               <input
//                 placeholder="comment"
//                 onChange={(e) => setComment(e.target.value)}
//               />
//               <input
//                 type="number"
//                 placeholder="rating"
//                 onChange={(e) => setRating(e.target.value)}
//               />

//               <button
//                 disabled={!comment}
//                 onClick={() => createNewReview(movie)}
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       </PageWidthWrapper>
//       <ReviewModal createNewReview={createNewReview} /> */}
//     </div>
//   );
// }

// function ReviewModal({
//   isNewCollectionModalOpen,
//   setIsNewCollectionModalOpen,
//   createAndAddToCollection,
//   setNewCollectionName,
//   newCollectionName,
//   movie,
//   dbError,
// }: any) {
//   return (
//     <div>
//       <input
//         type="checkbox"
//         checked={isNewCollectionModalOpen}
//         readOnly
//         id="my-modal-6"
//         className="modal-toggle"
//       />
//       <div className="modal modal-bottom sm:modal-middle ">
//         <div className="modal-box">
//           <div className="h-full w-full text-center relative">
//             <button
//               onClick={() => setIsNewCollectionModalOpen(false)}
//               className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
//             >
//               x
//             </button>
//             <h3 className="font-bold text-lg">Add to collecion</h3>
//             {/* <p className="p2-4">This might take a couple seconds so hang tight</p> */}
//             <div className="flex justify-center mt-4 gap-4 flex-col">
//               <input
//                 type="text"
//                 // value={newCollectionName}
//                 // onChange={(e) => setNewCollectionName(e.target.value)}
//                 className="input w-full input-bordered input-primary  "
//               />
//               <h1> {dbError}</h1>
//               <button
//                 className="btn-primary btn"
//                 // disabled={newCollectionName.length < 1}
//                 // onClick={() => createAndAddToCollection(movie)}
//               >
//                 Create new collection with movie
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//// OLD MOVIE GRID
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useContext, useEffect, useState } from "react";
// import {
//   addMovieToCollection,
//   createAndAddToCollection,
// } from "../../../../lib/firebaseFunctions";
// import { HiOutlineDotsHorizontal } from "react-icons/hi";
// import { FullPageLoader, SmallLoader } from "@/components/elements";
// import { UIContext } from "../../../../lib/context";
// import Link from "next/link";
// import { ModalWrapper } from "@/components/modals";
// import { useNestedUserCollectionsHook } from "../../../../lib/hooks";

// export function MovieGrid({ fetchFn, title, query }: any) {
//   const { dispatch, state } = useContext(UIContext);
//   const { nestedCollectionsFromHook, refetch } = useNestedUserCollectionsHook();
//   const [newCollectionName, setNewCollectionName] = useState<string>("");
//   const [movieToAddToDB, setMovieToAddToDB] = useState<any>();

//   const {
//     isLoading,
//     isError,
//     data,
//     fetchNextPage,
//     isFetching,
//     isFetchingNextPage,
//   } = useInfiniteQuery(
//     [title],
//     ({ pageParam = 1 }) => fetchFn({ query, pageParam }),
//     {
//       staleTime: 10000,
//       getNextPageParam: (lastPage, pages) => {
//         if (lastPage.page < lastPage.total_pages) {
//           return lastPage.page + 1;
//         }
//       },
//     }
//   );

//   async function addMovieToExistingCollection(movie: any, collectionName: any) {
//     const elem = document.activeElement as HTMLElement;
//     if (elem) {
//       elem?.blur();
//       try {
//         dispatch({ type: "DB_LOADING", payload: movie.id });
//         await addMovieToCollection(movie, collectionName);
//         dispatch({ type: "DB_NOT_LOADING", payload: null });
//       } catch (error) {}
//     }
//   }

//   async function addMovieToNewCollection(movie: any) {
//     try {
//       dispatch({ type: "DB_LOADING", payload: movie.id });
//       await createAndAddToCollection({
//         movie,
//         newCollectionName,
//       });
//       dispatch({ type: "DB_NOT_LOADING", payload: null });
//       dispatch({ type: "CLOSE_MODAL" });
//       await refetch();
//     } catch (error) {}
//   }

//   if (isLoading) {
//     return <FullPageLoader />;
//   }

//   if (isError) {
//     return <h2>"error"</h2>;
//   }

//   const toggleModalAndClearForm = (modalState: string) => {
//     setNewCollectionName("");
//     dispatch({ type: modalState });
//   };

//   return (
//     <>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
//           gridGap: 10,
//           gridAutoFlow: "row dense",
//         }}
//       >
//         {data?.pages.map((page: any) =>
//           page?.results.map((movie: any, idx: any) => (
//             <MovieCardWrapper
//               key={idx}
//               movie={movie}
//               nestedCollectionsFromHook={nestedCollectionsFromHook}
//               setMovieToAddToDB={setMovieToAddToDB}
//               toggleModalAndClearForm={toggleModalAndClearForm}
//               addMovieToExistingCollection={addMovieToExistingCollection}
//               state={state}
//             />
//           ))
//         )}
//       </div>
//       <div className="btn-container">
//         <button onClick={() => fetchNextPage()}>Load More</button>
//       </div>
//       <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
//       <ModalWrapper>
//         <CreateCollectionModal
//           addMovieToNewCollection={addMovieToNewCollection}
//           newCollectionName={newCollectionName}
//           setNewCollectionName={setNewCollectionName}
//           movie={movieToAddToDB}
//           toggleModalAndClearForm={toggleModalAndClearForm}
//           nestedCollectionsFromHook={nestedCollectionsFromHook}
//         />
//       </ModalWrapper>
//     </>
//   );
// }

// function MovieCardWrapper({
//   movie,
//   nestedCollectionsFromHook,
//   setMovieToAddToDB,
//   toggleModalAndClearForm,
//   addMovieToExistingCollection,
//   state,
// }: any) {
//   return (
//     <div className="relative  group hover:border-white border-4 border-transparent cursor-pointer">
//       <Link href={`/movie/${movie.id}`}>
//         <img
//           className="w-full h-full object-cover"
//           src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
//         />
//       </Link>

//       <div className="dropdown dropdown-end absolute top-0 right-0">
//         <label tabIndex={0}>
//           {state?.movieBeingAddedToDB === movie.id ? (
//             <div className="p-1">
//               <SmallLoader />
//             </div>
//           ) : (
//             <HiOutlineDotsHorizontal className="text-gray-300 bg-opacity-70 hover:text-white text-sm bg-black w-8 h-6 cursor-pointer" />
//           )}
//         </label>
//         <ul
//           tabIndex={0}
//           className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52  "
//         >
//           {nestedCollectionsFromHook &&
//             nestedCollectionsFromHook?.map((list: any, idx: number) => {
//               return (
//                 <li className="text-xs" key={idx}>
//                   <div
//                     onClick={() => addMovieToExistingCollection(movie, list)}
//                   >
//                     Add to {list}
//                   </div>
//                 </li>
//               );
//             })}
//           <li>
//             <button
//               className="text-xs"
//               onClick={() => {
//                 toggleModalAndClearForm("OPEN_MODAL");
//                 setMovieToAddToDB(movie);
//               }}
//             >
//               Add to new collection
//             </button>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// function CreateCollectionModal({
//   addMovieToNewCollection,
//   setNewCollectionName,
//   newCollectionName,
//   movie,
//   toggleModalAndClearForm,
//   nestedCollectionsFromHook,
// }: any) {
//   const [btnDisabled, setBtnDisabled] = useState(true);
//   const [errMsg, setErrMsg] = useState("");

//   useEffect(() => {
//     if (
//       nestedCollectionsFromHook &&
//       nestedCollectionsFromHook
//         ?.map((str: string) => str.toLowerCase())
//         .includes(newCollectionName.trim().toLowerCase())
//     ) {
//       setBtnDisabled(true);
//       setErrMsg("List already exists");
//     } else if (newCollectionName.length < 3) {
//       setBtnDisabled(true);
//       setErrMsg("Name must be at least 3 chars");
//     } else {
//       setBtnDisabled(false);
//       setErrMsg("");
//     }
//   }, [newCollectionName]);

//   return (
//     <>
//       <div className="h-full w-full text-center relative">
//         {movie?.title}
//         <button
//           onClick={() => toggleModalAndClearForm("CLOSE_MODAL")}
//           className="btn btn-sm bg-base-100 absolute border-none -top-4 -right-4"
//         >
//           x
//         </button>
//         <h3 className="font-bold text-lg">Add to collecion</h3>
//         <div className="flex justify-center mt-4 gap-4 flex-col">
//           <input
//             type="text"
//             value={newCollectionName}
//             onChange={(e) => setNewCollectionName(e.target.value)}
//             className="input w-full input-bordered input-primary  "
//           />
//           <h1 className="text-sm text-warning"></h1>
//           <button
//             className="btn-primary btn"
//             disabled={btnDisabled}
//             onClick={() => addMovieToNewCollection(movie)}
//           >
//             {errMsg ? errMsg : "Create new collection with movie"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
