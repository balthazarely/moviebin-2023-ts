import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import GlobalProvider from "../../lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/navigation";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthCheck } from "@/components/layout";
import { AddMovieToCollectionModal } from "@/components/modals";

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

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar>
          <AuthCheck>
            <Component {...pageProps} />
          </AuthCheck>
        </Navbar>
        <Toaster position="top-center" toastOptions={toastConfig} />
        <AddMovieToCollectionModal />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </GlobalProvider>
  );
}
