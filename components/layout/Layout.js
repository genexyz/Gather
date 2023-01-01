import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta property="og:url" content="https://www.gathertrips.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Gather Trips" />
        <meta
          property="description"
          content="Share rides and save money with Gather Trips."
        />
        <meta
          name="description"
          content="Share rides and save money with Gather Trips."
        />
        <meta
          property="og:description"
          content="Share rides and save money with Gather Trips."
        />
        <meta
          property="og:image"
          content="https://gathertrips.com/images/backgrounds/gathertrips.webp"
        />
        <meta property="og:site_name" content="Gather Trips" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Est. reading time" />
        <meta name="twitter:data1" content="4 minutes" />
        <meta property="twitter:domain" content="gathertrips.com" />
        <meta property="twitter:url" content="https://www.gathertrips.com/" />
        <meta name="twitter:title" content="Gather Trips" />
        <meta
          name="twitter:description"
          content="Share rides and save money with Gather Trips."
        />
        <meta
          name="twitter:image"
          content="https://gathertrips.com/images/backgrounds/gathertrips.webp"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <Footer />
      <NotificationContainer />
    </>
  );
}
