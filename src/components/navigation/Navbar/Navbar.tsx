// import { UserContext } from "lib/context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { SiGithub } from "react-icons/si";
import { auth, firestore } from "../../../../lib/firebase";
import { signUserOut } from "../../../../lib/firebaseAuth";
import { RiMovie2Fill } from "react-icons/ri";

export function Navbar({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const currentRoute = router.pathname;
  // @ts-ignore
  const [user] = useAuthState(auth);

  const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userDoc] = useDocumentData<any>(userDocRef);

  useLayoutEffect(() => {
    const appThemeColor = localStorage.getItem("moviebin-theme");
    if (appThemeColor) {
      document.querySelector("html")?.setAttribute("data-theme", appThemeColor);
    }
  }, []);

  useLayoutEffect(() => {
    if (userDoc) {
      document.querySelector("html")?.setAttribute("data-theme", userDoc.theme);
    }
  }, [userDoc]);

  const pathname = usePathname();
  useEffect(() => {
    document.querySelector(".drawer-content")?.scrollTo({ top: 0 });
  }, [pathname]);

  const navigateToLink = (link: string) => {
    setIsDrawerOpen(!isDrawerOpen);
    router.push(link);
  };

  return (
    <div className="0 drawer">
      <input
        id="my-drawer-3"
        type="checkbox"
        checked={isDrawerOpen}
        readOnly
        className="drawer-toggle"
      />
      <div className="drawer-content flex h-screen flex-col  bg-neutral">
        {/* <!-- Navbar --> */}
        <div className="navbar sticky top-0 z-50 w-full bg-base-300">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="btn-ghost btn-square btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2  flex-1 px-2 text-xl font-black ">
            <Link href="/" className="flex items-center gap-1">
              <RiMovie2Fill className="text-3xl" />
              <div className="">moviemate</div>
            </Link>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {user ? (
                <>
                  <li>
                    <Link href="/">Movies</Link>
                  </li>
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/users">Users</Link>
                  </li>
                  <div className="dropdown-end dropdown">
                    <label
                      tabIndex={0}
                      className="btn-ghost btn-circle avatar btn"
                    >
                      {userDoc?.photoURL ? (
                        <div className="w-8 rounded-full">
                          <img
                            className="w-16 rounded-full"
                            referrerPolicy="no-referrer"
                            src={
                              userDoc?.customProfileImage
                                ? userDoc?.customProfileImage
                                : userDoc?.photoURL
                            }
                            alt="Image"
                          />
                        </div>
                      ) : (
                        <div className="w-8 rounded-full bg-primary "></div>
                      )}
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                    >
                      <li className="">
                        <Link href="/settings" className=" w-full">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button onClick={signUserOut} className="w-full">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
        <div className="z-40 flex flex-grow flex-col ">
          <main className="flex-grow  bg-base-100 pb-24">{children}</main>
          <footer
            className={`"h-24 w-full  ${
              currentRoute === "/login" ? "bg-neutral" : "bg-base-100"
            }`}
          >
            <div className="absolute bottom-4 right-4">
              <a
                href="https://github.com/balthazarely/moviebin-2023-ts"
                target="_BLANK"
              >
                <SiGithub className="text-2xl" />
              </a>
            </div>
          </footer>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          onClick={() => setIsDrawerOpen(false)}
          className="drawer-overlay "
        ></label>
        <ul className="menu flex w-80 flex-col justify-between bg-base-100  p-6 pb-24 sm:pb-6">
          {/* <!-- Sidebar content here --> */}
          {user ? (
            <>
              <div>
                <li>
                  <div onClick={() => navigateToLink("/")}>Movies</div>
                </li>
                <li>
                  <div onClick={() => navigateToLink("/profile")}>Profile</div>
                </li>
                <li>
                  <div onClick={() => navigateToLink("/users")}>Users</div>
                </li>
                <li>
                  <div onClick={() => navigateToLink("/settings")}>
                    Settings
                  </div>
                </li>
              </div>
              <div className="w-full">
                <div className="mb-4 flex items-center gap-2">
                  {userDoc?.photoURL ? (
                    <img
                      className="aspect-square w-12 rounded-full"
                      referrerPolicy="no-referrer"
                      src={
                        userDoc?.customProfileImage
                          ? userDoc?.customProfileImage
                          : userDoc?.photoURL
                      }
                      alt="Image"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary "></div>
                  )}

                  <h2 className="text-sm font-bold">
                    <span className="font-normal">Signed in as </span>
                    {userDoc?.username
                      ? userDoc?.username
                      : userDoc?.displayName}
                  </h2>
                </div>
                <button
                  className="btn-primary btn  w-full"
                  onClick={signUserOut}
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <li>
              <div onClick={() => navigateToLink("/login")}>Login</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
