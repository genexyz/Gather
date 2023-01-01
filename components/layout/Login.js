// Next
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

// React
import React from "react";

// Styles
import styles from "./Login.module.css";
import { Dropdown } from "react-bootstrap";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={styles.dropdownToggle}
  >
    <div className={styles.loginCircle}>{children}</div>
  </div>
));
CustomToggle.displayName = "LoginToggle";

const CustomItem = React.forwardRef(({ children, className }, ref) => (
  <div ref={ref} className={className}>
    {children}
  </div>
));
CustomItem.displayName = "LoginItem";

const Login = (props) => {
  const { t } = useTranslation("common");

  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-login">
        {props.session && (
          <Image
            src={props.session.user.image}
            alt="User Logo"
            width={46}
            height={46}
            quality={80}
            className={styles.userImage}
          />
        )}
        {!props.session && (
          <Image
            src="/images/header/user.webp"
            alt="User Logo"
            width={46}
            height={46}
            quality={80}
            className={styles.userImage}
          />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {props.status === "loading" && (
          <Dropdown.Item as={CustomItem} className={styles.userName}>
            <p>{t("validating-session")}</p>
          </Dropdown.Item>
        )}
        {!props.session && props.status !== "loading" && (
          <Link
            href="/api/auth/signin"
            passHref
            onClick={() => {
              props.toggleExpanded();
            }}
          >
            <Dropdown.Item as="div">{t("log-in")}</Dropdown.Item>
          </Link>
        )}
        {props.session &&
          props.session.user.username &&
          props.session.user.username !== "" && (
            <>
              <Link
                href={`/profile/${props.session.user.username}`}
                passHref
                onClick={() => {
                  props.toggleExpanded();
                }}
              >
                <Dropdown.Item as="div">{t("my-profile")}</Dropdown.Item>
              </Link>
              <Link
                href={`/profile/${props.session.user.username}/trips`}
                passHref
                onClick={() => {
                  props.toggleExpanded();
                }}
              >
                <Dropdown.Item as="div">{t("my-trips")}</Dropdown.Item>
              </Link>
              <Link
                href={`/profile/${props.session.user.username}/vehicles`}
                passHref
                onClick={() => {
                  props.toggleExpanded();
                }}
              >
                <Dropdown.Item as="div">{t("my-vehicles")}</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
            </>
          )}
        {props.session &&
          (!props.session.user.username || props.session.user.username === undefined) && (
            <Link
              href="/finishregistration"
              passHref
              onClick={() => {
                props.toggleExpanded();
              }}
            >
              <Dropdown.Item as="div">{t("complete-registration")}</Dropdown.Item>
            </Link>
          )}
        {props.session && (
          <Dropdown.Item as={CustomItem} className={styles.logOut}>
            <p
              onClick={() => {
                props.signOut();
                props.toggleExpanded();
              }}
            >
              {t("log-out")}
            </p>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Login;
