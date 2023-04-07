import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getNestedUserCollections,
  getNestedUserCollectionsAndDocs,
} from "./api";
import { auth, firestore } from "./firebase";
import { useQuery } from "@tanstack/react-query";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  return { user };
}

export function useUserProfileData() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userDoc, userDocLoading] = useDocumentDataOnce<any>(userDocRef);
  return { userDoc, userDocLoading };
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
        } catch (error) {}
      }
    }

    fetchData();
  }, [id]);

  return { nestedCollections };
}

export const useNestedUserCollectionsHook = () => {
  // @ts-ignore
  const [user] = useAuthState(auth);

  const {
    isLoading,
    error,
    data: nestedCollectionsFromHook,
    refetch,
  } = useQuery(
    ["nestCats", user],
    async () => {
      try {
        return getNestedUserCollections(user?.uid);
      } catch (error) {
        throw new Error(`An error occurred: ${error}`);
      }
    },
    {
      enabled: !!user,
    }
  );

  return {
    isLoading,
    error,
    nestedCollectionsFromHook,
    refetch,
  };
};

export const useScrollUp = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 50);
  }, []);
};
