import { useRouter } from "next/router";
import React from "react";
import { FirebaseUser } from "../../../../lib/firebase";
import { UserDoc } from "../../../../lib/types";
import { convertToDate } from "../../../../lib/utils";
import { SmallLoader } from "../SmallLoader";

interface IProfileInfoProps {
  user: FirebaseUser;
  userDoc: UserDoc;
  userDocLoading: any;
  setTabSelected: (tab: string) => void;
  tabSelected: string;
  movieDataLength: any;
  reviewDataLength: any;
  ProfileFavoritesLength: any;
}

export function ProfileInfo({
  user,
  userDoc,
  userDocLoading,
  setTabSelected,
  tabSelected,
  movieDataLength,
  reviewDataLength,
  ProfileFavoritesLength,
}: IProfileInfoProps) {
  const router = useRouter();
  const toggleTabs = (tab: string) => {
    setTabSelected(tab);
    router.push(
      {
        pathname: `/profile`,
        query: { tab: tab },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div>
      <div className="mt-6 flex items-center justify-start gap-6">
        <img
          className="w-16 rounded-full"
          referrerPolicy="no-referrer"
          src={user?.photoURL ?? ""}
          alt="Image"
        />
        <div>
          {userDocLoading ? (
            <SmallLoader />
          ) : (
            <>
              <h2 className="text-xl font-bold">{user?.displayName}</h2>
              <h4 className="text-xs">
                Member since {convertToDate(userDoc?.createdAt?.toDate())}
              </h4>
            </>
          )}
        </div>
      </div>
      <div className="tabs mt-6 mb-4">
        <button
          onClick={() => toggleTabs("lists")}
          className={`tab-lifted tab ${
            tabSelected === "lists" ? "tab-active" : ""
          }`}
        >
          My Lists ({movieDataLength && movieDataLength})
        </button>
        <button
          onClick={() => toggleTabs("reviews")}
          className={`tab-lifted tab ${
            tabSelected === "reviews" ? "tab-active" : ""
          }`}
        >
          My Reviews ({reviewDataLength && reviewDataLength})
        </button>
        <button
          onClick={() => toggleTabs("favorites")}
          className={`tab-lifted tab ${
            tabSelected === "favorites" ? "tab-active" : ""
          }`}
        >
          My Favorites ({ProfileFavoritesLength && ProfileFavoritesLength})
        </button>
      </div>
    </div>
  );
}
