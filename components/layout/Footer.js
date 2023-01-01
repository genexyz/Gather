import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import styles from "./Footer.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");

  return (
    <>
      {status !== "loading" && (
        <footer className={styles.footer}>
          <Container>
            <Row className={styles.footerSections}>
              <Col>
                <div className={styles.footerItem}>
                  <h3 className={styles.footerTitle}>{t("footer-gather-title")}</h3>
                  <ul className={styles.footerList}>
                    <li>
                      <Link href="/">{t("home")}</Link>
                    </li>
                    <li>
                      <Link href="/trips">{t("trips")}</Link>
                    </li>
                  </ul>
                </div>
              </Col>
              {session && (
                <Col>
                  <div className={styles.footerItem}>
                    <h3 className={styles.footerTitle}>{t("footer-profile-title")}</h3>
                    <ul className={styles.footerList}>
                      <li>
                        <Link href={`/profile/${session.user.username}`} passHref>
                          {t("my-profile")}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/profile/${session.user.username}/trips`} passHref>
                          {t("my-trips")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/profile/${session.user.username}/vehicles`}
                          passHref
                        >
                          {t("my-vehicles")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Col>
              )}
              <Col>
                <div className={styles.footerItem}>
                  <h3 className={styles.footerTitle}>{t("footer-faqs-title")}</h3>
                  <ul className={styles.footerList}>
                    <li>
                      <Link href="/faqs#app">{t("app")}</Link>
                    </li>
                    <li>
                      <Link href="/faqs#trips">{t("trips")}</Link>
                    </li>
                    <li>
                      <Link href="/faqs#payments">{t("payments")}</Link>
                    </li>
                    <li>
                      <Link href="/faqs#privacy">{t("privacy")}</Link>
                    </li>
                    <li>
                      <Link href="/faqs#terms">{t("terms")}</Link>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>

            <Row>
              <div className={styles.footerBottom}>
                <Image
                  src="/images/header/logo.svg"
                  alt="Gather Trips Logo"
                  quality={100}
                  width={245}
                  height={64}
                />
              </div>
            </Row>
            <Row>
              <div className={styles.footerBottom}>
                <p className={styles.footerText}>&copy; {t("footer-copyright")}</p>
              </div>
            </Row>
          </Container>
        </footer>
      )}
    </>
  );
};

export default Footer;
