// Next
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

// Styles
import styles from "./Header.module.css";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";

// Components
import Login from "./Login";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </div>
));
CustomToggle.displayName = "LoginToggle";

const Header = () => {
  const { data: session, status } = useSession();
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const { t } = useTranslation("common");

  const onToggleLanguageClick = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const toggleExpanded = () => {
    setExpanded(false);
  };

  return (
    <section id="navbar">
      <Navbar expand="lg" fixed="top" className={styles.header} expanded={expanded}>
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand>
              <Image
                src="/images/header/logo.svg"
                alt="Gather Trips Logo"
                quality={100}
                width={245}
                height={64}
                className={styles.logo}
              />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className={styles.toggler}
            onClick={() => setExpanded(expanded ? false : "expanded")}
          >
            <span className={`${styles.togglerIcon} navbar-toggler-icon`}></span>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Item className={styles.item}>
                <Link href="/" passHref>
                  <Nav.Link
                    className={styles.link}
                    as="div"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }
                  >
                    {t("home")}
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/trips" passHref>
                  <Nav.Link
                    className={styles.link}
                    as="div"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }
                  >
                    {t("trips")}
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.item}>
                <Link href="/faqs" passHref>
                  <Nav.Link
                    className={styles.link}
                    as="div"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }
                  >
                    {t("faq")}
                  </Nav.Link>
                </Link>
              </Nav.Item>
              <Nav.Item className={styles.languageItem}>
                <Dropdown className={styles.dropdown}>
                  <Dropdown.Toggle id="dropdown-language" as={CustomToggle}>
                    <Image
                      src={`/images/header/${router.locale === "en" ? "us" : "es"}.webp`}
                      alt={
                        router.locale === "en"
                          ? "English Language - US flag"
                          : "Spanish Language - ES flag"
                      }
                      width={35}
                      height={35}
                      className={styles.languageFlag}
                    />
                    <Image
                      src="/images/header/down.webp"
                      alt="Arrow icon to open language selector"
                      width={20}
                      height={20}
                      className={styles.arrowIcon}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={styles.languageMenu}>
                    <Dropdown.Item
                      as="div"
                      onClick={() => {
                        onToggleLanguageClick("en");
                        setTimeout(() => {
                          setExpanded(false);
                        }, 100);
                      }}
                      className={styles.languageFlagDiv}
                    >
                      <Image
                        src="/images/header/us.webp"
                        alt="English Language - US flag"
                        width={35}
                        height={35}
                        className={styles.languageFlag}
                      />
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="div"
                      onClick={() => {
                        onToggleLanguageClick("es");
                        setTimeout(() => {
                          setExpanded(false);
                        }, 100);
                      }}
                      className={styles.languageFlagDiv}
                    >
                      <Image
                        src="/images/header/es.webp"
                        alt="Spanish Language - ES flag"
                        width={35}
                        height={35}
                        className={styles.languageFlag}
                      />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
              <Nav.Item className={styles.login}>
                <Login
                  session={session}
                  status={status}
                  signOut={signOut}
                  toggleExpanded={toggleExpanded}
                />
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </section>
  );
};
export default Header;
