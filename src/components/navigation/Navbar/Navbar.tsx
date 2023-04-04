// import { UserContext } from "lib/context";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";
import { signUserOut } from "../../../../lib/firebaseFunctions";

export function Navbar({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  // const { user } = useContext(UserContext);
  // @ts-ignore
  const [user] = useAuthState(auth);

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
          </div>{" "}
          <div className="mx-2 flex-1 px-2 text-xl font-black ">
            <div className=" ">movieMate</div>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal">
              {user ? (
                <>
                  <li>
                    <Link href="/movies">Movies</Link>
                  </li>
                  <li>
                    <Link href="/collections">Collections</Link>
                  </li>
                  <li>
                    <Link href="/users">Users</Link>
                  </li>
                  <div className="dropdown-end dropdown">
                    <label
                      tabIndex={0}
                      className="btn-ghost btn-circle avatar btn"
                    >
                      <div className="w-8 rounded-full">
                        <img
                          referrerPolicy="no-referrer"
                          src={user?.photoURL ?? ""}
                        />
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                    >
                      <li className="">
                        <Link href="/" className=" w-full">
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
                <Link href="/login">
                  <button className="btn-primary btn">Login</button>
                </Link>
              )}
            </ul>
          </div>
        </div>
        <div className="z-40 flex flex-col">
          <main className=" bg-neutra flex-grow">{children}</main>
          {/* <footer className=" bottom-0 mt-16 h-24 w-full  bg-red-300"></footer> */}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          onClick={() => setIsDrawerOpen(false)}
          className="drawer-overlay "
        ></label>
        <ul className="menu flex w-80 flex-col justify-between bg-base-100 p-4">
          {/* <!-- Sidebar content here --> */}
          {user ? (
            <>
              <div>
                <li>
                  <div onClick={() => navigateToLink("/movies")}>Movies</div>
                </li>
                <li>
                  <div onClick={() => navigateToLink("/collections")}>
                    Collections
                  </div>
                </li>
                <li>
                  <div onClick={() => navigateToLink("/users")}>Users</div>
                </li>
              </div>
              <div className="w-full">
                <div className="mb-4 flex items-center gap-2">
                  <img
                    className="w-12 rounded-full"
                    referrerPolicy="no-referrer"
                    src={user?.photoURL ?? ""}
                    alt="Image"
                  />
                  <h2 className="text-sm font-bold">
                    <span className="font-normal">Signed in as </span>
                    {user?.displayName}
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
