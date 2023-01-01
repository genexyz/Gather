import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import styles from "./CreateProfile.module.css";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

export default function CreateProfile(props) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    username: "",
    nationalId: "",
    phone: "",
    bio: "",
    image: "",
  });
  const router = useRouter();
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  const handleFirstTimeUser = () => {
    setUser({
      ...user,
      name: session.user.name,
      image: session.user.image,
    });
  };

  if (
    session &&
    session.user.name &&
    session.user.name !== "" &&
    session.user.username &&
    session.user.username !== "" &&
    session.user.image &&
    session.user.image !== ""
  ) {
    router.push("/");
  }

  if (session && user.name === "") {
    handleFirstTimeUser();
  }

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const findFormErrors = () => {
    const { name, username, phone, image, bio } = user;

    const newErrors = {};
    if (!name || name === "") newErrors.name = t("cannot-be-blank");
    if (!username || username === "") newErrors.username = t("cannot-be-blank");
    if (username.length < 5) newErrors.username = t("username-too-short");
    if (username.length > 25) newErrors.username = t("username-too-long");
    if (!phone || phone === "") newErrors.phone = t("cannot-be-blank");
    if (!bio || bio === "") newErrors.bio = t("cannot-be-blank");
    if (!image || image === "") newErrors.image = t("cannot-be-blank");
    return newErrors;
  };

  const submitData = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const body = {
          ...user,
          id: session.user.id,
        };
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.status === 200) {
          NotificationManager.success("", t("user-edited"), 6000);
          reloadSession();
          router.push("/");
        }
        if (response.status === 400) {
          setErrors(data);
          console.log(data);
          NotificationManager.error("", t("couldnt-edit-user"), 6000);
        }
        if (response.status === 401) {
          NotificationManager.error("", t("not-authorized"), 6000);
        }
        if (response.status === 500) {
          NotificationManager.error("", t("server-error"), 6000);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Container className={styles.container}>
      {status === "loading" && (
        <Row className={styles.mainRow}>
          <h1>Loading Registration...</h1>
        </Row>
      )}
      {session &&
        session.user.name &&
        session.user.name !== "" &&
        session.user.username &&
        session.user.username !== "" &&
        session.user.image &&
        session.user.image !== "" && (
          <Row className={styles.mainRow}>
            <h1>{t("access-not-allowed")}</h1>
          </Row>
        )}
      {!session && status !== "loading" && (
        <div className={`justify-content-md-center text-center`}>
          <Link href="/api/auth/signin" passHref>
            <Button variant="primary" className={styles.loginBtn}>
              {t("log-in")}
            </Button>
          </Link>
        </div>
      )}
      {session && !session.user.username && (
        <>
          <Row className={styles.mainRow}>
            <h1>{t("finish-registration")}</h1>
            <p>{t("finish-registration-description")}</p>
          </Row>
          <Row>
            <Form>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formUserName">
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.name}
                      name="name"
                      onChange={onInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formUserUsername">
                    <Form.Label>{t("username")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.username}
                      name="username"
                      onChange={onInputChange}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formUserNationalId">
                    <Form.Label>{t("national-id-number")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.nationalId}
                      name="nationalId"
                      onChange={onInputChange}
                      isInvalid={!!errors.nationalId}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nationalId}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3" controlId="formUserPhone">
                    <Form.Label>{t("phone-number")}</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.phone}
                      name="phone"
                      onChange={onInputChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formUserBio">
                  <Form.Label required>{t("biography")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={user.bio}
                    name="bio"
                    onChange={onInputChange}
                    isInvalid={!!errors.bio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-3" controlId="formUserImageURL">
                  <Form.Label>{t("image-url")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.image}
                    name="image"
                    onChange={onInputChange}
                    placeholder={t("image-url-placeholder")}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {t("image-url-description")}
                  </Form.Text>
                </Form.Group>
              </Row>
              <Row className={styles.saveButtonRow}>
                <Button
                  variant="success"
                  onClick={submitData}
                  className={styles.saveButton}
                >
                  {t("save-changes")}
                </Button>
              </Row>
            </Form>
          </Row>
        </>
      )}
    </Container>
  );
}
