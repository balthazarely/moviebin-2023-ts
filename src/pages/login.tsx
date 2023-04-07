import { FcGoogle } from "react-icons/fc";
import { signUserInViaGoogle } from "../../lib/firebaseAuth";
import {
  SiTailwindcss,
  SiDaisyui,
  SiNextdotjs,
  SiFirebase,
} from "react-icons/si";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import Link from "next/link";
import { useState } from "react";
import { FullPageLoader } from "@/components/elements/UIElements";

export default function Login() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await signUserInViaGoogle();
    setLoading(false);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-4">
      <div className="mt-32 flex flex-col gap-4 text-center">
        {!loading ? (
          <div>
            <div className="text-4xl font-extrabold">Welcome to moviemate</div>
            <div className="max-w-md  text-xl">
              Make and organize your own watchlists, review movies, and more!
            </div>
          </div>
        ) : (
          <FullPageLoader />
        )}
        <div>
          {!user?.uid ? (
            <button onClick={signIn} className="btn-primary btn">
              <FcGoogle className="mr-2 text-2xl" /> Log in Via Google
            </button>
          ) : (
            <Link href={`/profile`}>
              <button className="btn-primary btn">Go to Profile</button>
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="max-w-md text-center text-base ">
          Made with
          <div className="text-lg font-bold">
            NextJS + TailwindCSS + Firebase + DaisyUI
          </div>
        </div>
        <div className="flex gap-4">
          <SiNextdotjs className="text-3xl" />
          <SiTailwindcss className="text-3xl" />
          <SiFirebase className="text-3xl" />
          <SiDaisyui className="text-3xl" />
        </div>
      </div>
    </div>
  );
}
