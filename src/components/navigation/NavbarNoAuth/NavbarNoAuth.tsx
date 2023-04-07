// import { UserContext } from "lib/context";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { RiMovie2Fill } from "react-icons/ri";
import { SiGithub } from "react-icons/si";

export function NavbarNoAuth({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const currentRoute = router.pathname;

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
          <div className="mx-2 flex-1 px-2 text-xl font-black ">
            <Link href="/" className="flex items-center gap-1">
              <RiMovie2Fill className="text-3xl" />
              <div className="">moviemate</div>
            </Link>
          </div>
        </div>
        <div className="z-40 flex flex-grow flex-col ">
          <main className="flex-grow  bg-neutral pb-24">{children}</main>
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
        <ul className="menu flex w-80 flex-col justify-between bg-base-100 p-4">
          {/* <!-- Sidebar content here --> */}

          <li>
            <div onClick={() => navigateToLink("/login")}>Login</div>
          </li>
        </ul>
      </div>
    </div>
  );
}
