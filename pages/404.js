// Next
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// Styles
import styles from "./404.module.css";
import { Button, Container } from "react-bootstrap";

export default function Custom404() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Gather - 404 Not Found</title>
        <meta name="description" content="404 - Page Not Found" />
      </Head>
      <Container className={styles.section404}>
        <Image
          src="/images/assets/404.gif"
          alt="404 error GIF"
          height={289}
          width={550}
          className={styles.img}
        />
        <h1 className={styles.errorText}>{t("404-title")}</h1>
        <p className={styles.text}>{t("404-description")}</p>
        <Link href="/" passHref>
          <Button className={styles.btn}>{t("404-button")}</Button>
        </Link>
      </Container>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  };
}
