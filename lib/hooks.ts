import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getNestedUserCollections } from "./api";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth } from "./firebase";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  return { user };
}

export function useNestedUserCollections() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const [nestedCollections, setNestedCollections] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          const response = await getNestedUserCollections(user.uid);
          setNestedCollections(response);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [user]);

  return { nestedCollections };
}

export function useOtherUserNestedCollections(id: any) {
  const [nestedCollections, setNestedCollections] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      if (id) {
        try {
          const response = await getNestedUserCollections(id);
          setNestedCollections(response);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [id]);

  return { nestedCollections };
}
