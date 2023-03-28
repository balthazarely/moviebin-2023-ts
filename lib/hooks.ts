import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getNestedUserCollections,
  getNestedUserCollectionsAndDocs,
} from "./api";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { auth, db, firestore } from "./firebase";

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

export function useNestedUserCollectionsAndDocs() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const [nestedCollectionsAndDocs, setNestedCollectionsAndDocs] =
    useState<any>(null);
  const [loadingLists, setLoadingLists] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        try {
          setLoadingLists(true);
          const response = await getNestedUserCollectionsAndDocs(user.uid);
          setNestedCollectionsAndDocs(response);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingLists(false);
        }
      }
    }

    fetchData();
  }, [user]);

  return { nestedCollectionsAndDocs, loadingLists };
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
