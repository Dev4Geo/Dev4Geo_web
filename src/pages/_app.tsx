import type { AppProps } from "next/app";
import "../app/globals.css";
import MyNav from "@/components/myNav";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col">
      <MyNav />
      <Component {...pageProps} />
    </div>
  );
}
