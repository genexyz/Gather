import Head from "next/head";
import Mainpage from "../components/Mainpage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  return (
    <>
      <Head>
        <title>Gather Trips</title>
      </Head>
      <Mainpage />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
}
