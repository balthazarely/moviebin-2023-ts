import { FcGoogle } from "react-icons/fc";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { signUserInViaGoogle, signUserOut } from "../../lib/firebaseFunctions";

export default function Login() {
  // @ts-ignore
  const [user] = useAuthState(auth);

  return (
    <div className="flex justify-center items-center w-full h-96">
      {user ? (
        <button onClick={signUserOut} className="btn btn-primary">
          SignOut
        </button>
      ) : (
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-2xl text-center mb-4">
            Login/Register to <br />{" "}
            <span className="font-black">MovieMate</span>
          </h1>
          <button onClick={signUserInViaGoogle} className="btn btn-primary">
            <FcGoogle className="mr-2 text-2xl" /> Log in Via Google
          </button>
        </div>
      )}
    </div>
  );
}
