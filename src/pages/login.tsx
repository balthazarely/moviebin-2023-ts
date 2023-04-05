import { FcGoogle } from "react-icons/fc";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { signUserInViaGoogle, signUserOut } from "../../lib/firebaseAuth";

export default function Login() {
  // @ts-ignore
  const [user] = useAuthState(auth);

  return (
    <div className="flex h-96 w-full items-center justify-center">
      {user ? (
        <button onClick={signUserOut} className="btn-primary btn">
          SignOut
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 text-center text-2xl">
            Login/Register to <br />{" "}
            <span className="font-black">MovieMate</span>
          </h1>
          <button onClick={signUserInViaGoogle} className="btn-primary btn">
            <FcGoogle className="mr-2 text-2xl" /> Log in Via Google
          </button>
        </div>
      )}
    </div>
  );
}
