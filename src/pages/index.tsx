import { useContext, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import { signUserInViaGoogle, signUserOut } from "../../lib/firebaseFunctions";

export default function Home() {
  // @ts-ignore
  const [user] = useAuthState(auth);
  return (
    <>
      {user ? (
        <button onClick={signUserOut}>SignOut</button>
      ) : (
        <button onClick={signUserInViaGoogle}>SignIn</button>
      )}
    </>
  );
}
