import { getProviders, signIn, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "./signin.module.css";
import Image from "next/image";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { Button, Container } from "react-bootstrap";

export default function SignIn({ providers }) {
  const { t } = useTranslation("common");
  const [redirectUrl, setRedirectUrl] = useState(process.env.NEXT_PUBLIC_URL);

  useEffect(() => {
    const url = new URL(location.href);
    setRedirectUrl(url.searchParams.get("callbackUrl"));
  }, []);

  return (
    <>
      <Image
        src="/images/backgrounds/carpooling.webp"
        alt={`Background Main Image`}
        quality={75}
        width={1920}
        height={1080}
        className={styles.background}
      />
      <Container className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardContent}>
              <Link href="/">
                <Image
                  src="/images/header/logo.svg"
                  alt="Gather Trips Logo"
                  quality={100}
                  width={294}
                  height={77}
                />
              </Link>
              <hr />
              {Object.values(providers).map((provider) => (
                <div key={provider.name} className={styles.providerDiv}>
                  <Button
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: redirectUrl,
                      })
                    }
                  >
                    {t("sign-in-with")} {provider.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export async function getServerSideProps({ req, locale }) {
  const session = await getSession({ req });

  if (session && session.user.username && session.user.username !== "") {
    return {
      redirect: { destination: "/" },
    };
  }
  if (session && (!session.user.username || session.user.username === "")) {
    return {
      redirect: { destination: "/finishregistration" },
    };
  }

  const providers = await getProviders();

  return {
    props: { ...(await serverSideTranslations(locale, ["common"])), providers },
  };
}
