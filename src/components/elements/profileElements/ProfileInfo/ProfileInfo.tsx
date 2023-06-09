import { useRouter } from "next/router";
import React, { useContext } from "react";
import { UserContext } from "../../../../../lib/userContext";
import { convertToDate } from "../../../../../lib/utils";
import { SmallLoader } from "../../UIElements/SmallLoader";

interface IProfileInfoProps {
  userDoc: any;
  setTabSelected: (tab: string) => void;
  tabSelected: string;
  movieDataLength: any;
  reviewDataLength: any;
  ProfileFavoritesLength: any;
}

export function ProfileInfo({
  userDoc,
  setTabSelected,
  tabSelected,
  movieDataLength,
  reviewDataLength,
  ProfileFavoritesLength,
}: IProfileInfoProps) {
  // const { state } = useContext(UserContext);
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
        {userDoc?.photoURL ? (
          <img
            className="aspect-square w-16 rounded-full object-cover"
            referrerPolicy="no-referrer"
            src={
              userDoc?.customProfileImage
                ? userDoc?.customProfileImage
                : userDoc?.photoURL
            }
            alt="Image"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary "></div>
        )}
        <div>
          {!userDoc ? (
            <SmallLoader />
          ) : (
            <>
              <h2 className="text-xl font-bold">
                {userDoc?.username ? userDoc?.username : userDoc?.displayName}
              </h2>
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
