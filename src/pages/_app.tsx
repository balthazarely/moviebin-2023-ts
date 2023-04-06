import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalProvider, { UIContext } from "../../lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthCheck } from "@/components/layout";
import { AddMovieToCollectionModal } from "@/components/modals";
import { useUserProfileData } from "../../lib/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, FirebaseUser, firestore } from "../../lib/firebase";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import GlobalUserProvider from "../../lib/userContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <GlobalProvider>
      <GlobalUserProvider>
        <QueryClientProvider client={queryClient}>
          <AuthCheck>
            {currentRoute === "/login" ? (
              <Component {...pageProps} />
            ) : (
              <Navbar>
                <Component {...pageProps} />
              </Navbar>
            )}
          </AuthCheck>
          <Toaster position="top-center" toastOptions={toastConfig} />
          <AddMovieToCollectionModal />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </GlobalUserProvider>
    </GlobalProvider>
  );
}

const toastConfig = {
  success: {
    iconTheme: {
      primary: "#a991f7",
      secondary: "white",
    },
    style: {
      background: "#3d4451",
      color: "white",
      zIndex: 100,
    },
  },
};
