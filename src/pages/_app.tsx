import MainNav from "@/components/layouts/MainNav";
import "@/styles/globals.css";
import { useApollo } from "@/utils/apolloClient";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <div className="flex justify-center bg-stone-50 py-3">
        <MainNav />
      </div>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
