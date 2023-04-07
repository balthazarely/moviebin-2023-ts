import { FullPageLoader } from "@/components/elements/UIElements";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../../lib/firebase";

// Component's children only shown to logged-in users
export function AuthCheck({ children }: any) {
  const router = useRouter();
  const currentRoute = router.pathname;
  const allowedRoutes = ["/login"];

  if (allowedRoutes.includes(currentRoute)) {
    return children;
  }

  // @ts-ignore
  const [user] = useAuthState(auth);

  // useEffect(() => {
  //   if (!user?.uid) {
  //     router.push("/login");
  //   }
  // }, [user]);

  return user?.uid ? (
    children
  ) : (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <FullPageLoader />
    </div>
  );
}
