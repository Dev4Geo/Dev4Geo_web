import type { AppProps } from "next/app";
import "../app/globals.css";
import MyNav from "@/components/shared/myNav";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {


  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col">
        <MyNav/>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
