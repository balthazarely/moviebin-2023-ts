import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import GlobalProvider from "../../lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar, NavbarNoAuth } from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AddMovieToCollectionModal } from "@/components/modals";
import GlobalUserProvider from "../../lib/userContext";

import { AuthCheck } from "@/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GlobalProvider>
      <GlobalUserProvider>
        <QueryClientProvider client={queryClient}>
          <AuthCheck>
            <Navbar>
              <Component {...pageProps} />
            </Navbar>
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
