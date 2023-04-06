import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { UIContext } from "../../../../lib/context";
import { auth, firestore } from "../../../../lib/firebase";
import { UserContext } from "../../../../lib/userContext";

// Component's children only shown to logged-in users
export function AuthCheck({ children }: any) {
  const { state, dispatch } = useContext(UserContext);
  // @ts-ignore
  const [user] = useAuthState(auth);
  const router = useRouter();
  const currentRoute = router.pathname;
  const allowedRoutes = ["/login", "/"];
  const [userDoc, setUserDoc] = useState<any>(null);

  if (allowedRoutes.includes(currentRoute)) {
    return children;
  }

  useEffect(() => {
    let unsubscribe: any;
    if (user) {
      const userDocRef = firestore
        .collection("users")
        .doc(user?.uid?.toString());
      unsubscribe = userDocRef.onSnapshot((snapshot) => {
        setUserDoc(snapshot.data());
      });
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    dispatch({ type: "SET_USER_DOC", payload: userDoc });
  }, [userDoc, dispatch]);

  return user?.uid ? (
    children
  ) : (
    <Link href="/enter">You must be signed in</Link>
  );
}
