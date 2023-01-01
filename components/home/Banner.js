import Image from "next/image";
import Link from "next/link";
import { Container } from "react-bootstrap";
import styles from "./Banner.module.css";
import { useTranslation } from "next-i18next";

const Banner = () => {
  const { t } = useTranslation("common");

  return (
    <section id="home" className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.heading}>
            <h2>{t("home-banner-title")}</h2>
            <p>{t("home-banner-subtitle")}</p>
          </div>
          <div as="figure" className={styles.illustration}>
            <div className={styles.buttonWrapper}>
              <Link href="/trips">
                <button>{t("home-banner-button")}</button>
              </Link>
            </div>
            <Image
              src="/images/backgrounds/carpool-illustration1.webp"
              alt="Carpooling Illustration"
              width={882}
              height={588}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
