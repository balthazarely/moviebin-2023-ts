import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import GlobalProvider from "../../lib/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Navbar } from "@/components/navigation";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Navbar>
      </QueryClientProvider>
    </GlobalProvider>
  );
}
