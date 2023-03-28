import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { signUserInViaGoogle } from "../../lib/firebaseFunctions";

export default function Home() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  return (
    <>
      <button onClick={signUserInViaGoogle}>SignIn</button>
    </>
  );
}
