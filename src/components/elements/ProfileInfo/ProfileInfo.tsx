import { useRouter } from "next/router";
import React from "react";
import { FirebaseUser } from "../../../../lib/firebase";
import { NestedDataCollectionDocs, UserDoc } from "../../../../lib/types";
import { convertToDate } from "../../../../lib/utils";

interface IProfileInfoProps {
  user: FirebaseUser;
  userDoc: UserDoc;
  setTabSelected: (tab: string) => void;
  tabSelected: string;
  movieDataLength: any;
  reviewDataLength: any;
}

export function ProfileInfo({
  user,
  userDoc,
  setTabSelected,
  tabSelected,
  movieDataLength,
  reviewDataLength,
}: IProfileInfoProps) {
  const router = useRouter();
  const toggleTabs = (tab: string) => {
    setTabSelected(tab);
    router.push(
      {
        pathname: `/collections`,
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
          <h2 className="text-xl font-bold">{user?.displayName}</h2>
          <h4 className="text-xs">
            Member since {convertToDate(userDoc?.createdAt.toDate())}
          </h4>
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
      </div>
    </div>
  );
}
