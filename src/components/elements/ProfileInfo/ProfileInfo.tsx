import { useRouter } from "next/router";
import React from "react";
import { convertToDate } from "../../../../lib/utils";

export function ProfileInfo({
  user,
  users,
  setTabSelected,
  tabSelected,
  data,
}: any) {
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
      <div className="flex justify-start items-center gap-6 mt-6">
        <img
          className="rounded-full w-16"
          referrerPolicy="no-referrer"
          src={user?.photoURL ?? ""}
          alt="Image"
        />
        <div>
          <h2 className="text-xl font-bold">{user?.displayName}</h2>
          <h4 className="text-xs">
            Member since {convertToDate(users?.createdAt.toDate())}
          </h4>
        </div>
      </div>
      <div className="tabs mt-6 mb-4">
        <button
          onClick={() => toggleTabs("lists")}
          className={`tab tab-lifted ${
            tabSelected === "lists" ? "tab-active" : ""
          }`}
        >
          My Lists ({data?.length})
        </button>
        <button
          onClick={() => toggleTabs("reviews")}
          className={`tab tab-lifted ${
            tabSelected === "reviews" ? "tab-active" : ""
          }`}
        >
          My Reviews
        </button>
      </div>
    </div>
  );
}
