import Head from "next/head";
import CreateProfile from "../components/CreateProfile";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function FinishRegistration(props) {
  return (
    <>
      <Head>
        <title>Gather - Finish Registration</title>
      </Head>
      <CreateProfile />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
}
