import React from "react";
import { AppProps } from "next/app";

import "../styles/index.css";
import "../styles/react-date-range/theme/default.css";
import "../styles/react-date-range/styles.css";


const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
