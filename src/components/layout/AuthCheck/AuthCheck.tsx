import Link from "next/link";
import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";

// Component's children only shown to logged-in users
export function AuthCheck({ children }: any) {
  // @ts-ignore
  const [user] = useAuthState(auth);
  const router = useRouter();
  const currentRoute = router.pathname;
  const allowedRoutes = ["/login", "/"];

  if (allowedRoutes.includes(currentRoute)) {
    return children;
  }

  return user?.uid ? (
    children
  ) : (
    <Link href="/enter">You must be signed in</Link>
  );
}
