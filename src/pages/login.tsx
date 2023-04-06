import { FcGoogle } from "react-icons/fc";
import { signUserInViaGoogle } from "../../lib/firebaseAuth";
import {
  SiTailwindcss,
  SiDaisyui,
  SiNextdotjs,
  SiFirebase,
  SiGithub,
} from "react-icons/si";
import { CgWebsite } from "react-icons/cg";

export default function Login() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-4">
      <div className="mt-32 flex flex-col gap-4 text-center">
        <div className="text-4xl font-extrabold">Welcome to MovieMate</div>
        <div className="max-w-md  text-xl">
          Make and organize your own watchlists, review movies, and more!
        </div>
        <div>
          <button onClick={signUserInViaGoogle} className="btn-primary btn">
            <FcGoogle className="mr-2 text-2xl" /> Log in Via Google
          </button>
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
