// import { UserContext } from "lib/context";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";
import { signUserOut } from "../../../../lib/firebaseFunctions";

export function Navbar({ children }: any) {
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
    <div className="drawer 0">
      <input
        id="my-drawer-3"
        type="checkbox"
        checked={isDrawerOpen}
        readOnly
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col">
        {/* <!-- Navbar --> */}
        <div className="w-full navbar bg-base-300 sticky top-0 z-50">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
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
          <div className="flex-1 px-2 mx-2 text-xl font-black ">
            <div className=" ">movieMate</div>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {/* <!-- Navbar menu content here --> */}
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
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-8 rounded-full">
                        <img src={user?.photoURL ?? ""} />
                      </div>
                    </label>
                    <ul
                      tabIndex={0}
                      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
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
                  <button className="btn btn-primary">Login</button>
                </Link>
              )}
            </ul>
          </div>
        </div>
        <div className="bg-neutral flex-grow">
          <div className="h-full flex-grow w-full ">{children}</div>
        </div>
        <div className="bg-base-200 ">
          <div className="max-w-4xl px-2 w-full mx-auto py-10"></div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          onClick={() => setIsDrawerOpen(false)}
          className="drawer-overlay "
        ></label>
        <ul className="menu p-4 w-80 bg-base-100 flex flex-col justify-between">
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
                <div className="flex gap-2 items-center mb-4">
                  <img
                    className="rounded-full w-12"
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
