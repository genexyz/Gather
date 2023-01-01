import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const UserModal = (props) => {
  const { t } = useTranslation("common");

  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    nationalId: "",
    phone: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    setUser({
      name: props.user ? props.user.name : "",
      username: props.user ? props.user.username : "",
      bio: props.user ? props.user.bio : "",
      nationalId: props.user ? props.user.nationalId : "",
      phone: props.user ? props.user.phone : "",
      email: props.user ? props.user.email : "",
      image: props.user ? props.user.image : "",
    });
  }, [props]);

  const handleClose = () => {
    setUser({
      name: "",
      username: "",
      bio: "",
      nationalId: "",
      phone: "",
      email: "",
      image: "",
    });
    setErrors({});
    props.handleClose();
  };

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
    let { name, username, bio, phone, email } = user;

    const newErrors = {};

    if (!name || name === "") newErrors.name = t("cannot-be-blank");
    if (!username || username === "") newErrors.username = t("cannot-be-blank");
    if (username.length < 5) newErrors.username = t("username-too-short");
    if (username.length > 25) newErrors.username = t("username-too-long");
    if (!bio || bio === "") newErrors.bio = t("cannot-be-blank");
    if (bio.length > 400) newErrors.bio = t("bio-too-long");
    if (!phone || phone === "") newErrors.phone = t("cannot-be-blank");
    if (!email || email === "") newErrors.email = t("cannot-be-blank");
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
          id: props.user ? props.user.id : null,
        };
        const response = await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification("success", "", t("user-edited"));
          window.location.href = `/profile/${user.username}`;
        }
        if (response.status === 400) {
          setErrors(data);
          console.log(data);
          props.handleNotification("error", "", t("couldnt-edit-user"));
        }
        if (response.status === 401) {
          handleClose();
          props.handleNotification("error", "", t("not-authorized"));
        }
        if (response.status === 500) {
          handleClose();
          props.handleNotification("error", "", t("server-error"));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>{t("name")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("name-placeholder")}
                    name="name"
                    value={user.name}
                    onChange={onInputChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>{t("username")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("username-placeholder")}
                    name="username"
                    value={user.username}
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
              <Col>
                <Form.Group className="mb-3" controlId="formBasicBio">
                  <Form.Label>{t("biography")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={t("biography-placeholder")}
                    name="bio"
                    value={user.bio}
                    onChange={onInputChange}
                    isInvalid={!!errors.bio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.bio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>{t("email")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="example@domain.com"
                    name="email"
                    value={user.email}
                    onChange={onInputChange}
                    disabled
                    readOnly
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicNationalId">
                  <Form.Label>{t("national-id-number")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("national-id-number-placeholder")}
                    name="nationalId"
                    value={user.nationalId}
                    onChange={onInputChange}
                    isInvalid={!!errors.nationalId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nationalId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>{t("phone-number")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("phone-number-placeholder")}
                    name="phone"
                    value={user.phone}
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
                <Form.Text className="text-muted">{t("image-url-description")}</Form.Text>
              </Form.Group>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={submitData}>
          {t("save-changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
