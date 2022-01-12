import * as React from "react";
import Head from "next/head";
import Footer from "./Footer";

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = "BeeCTRL",
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <main className="w-full relative">
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8">{children}</div>
    </main>
    <Footer/>
  </div>
);

export default Layout;
