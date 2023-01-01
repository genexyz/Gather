import { Button, Container, Modal, Row, Form } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const TripJoinPrivateModal = (props) => {
  const { t } = useTranslation("common");
  const [errors, setErrors] = useState({});
  const [inviteCode, setInviteCode] = useState("");

  const router = useRouter();

  const handleClose = () => {
    setInviteCode("");
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setInviteCode(value);

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!inviteCode || inviteCode === "") newErrors.inviteCode = t("cannot-be-blank");
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
          inviteCode: inviteCode,
        };
        const response = await fetch("/api/trip/joinprivate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.status === 200) {
          console.log(data);
          props.handleNotification("success", "", t("trip-found"));
          router.push(`/trips/${data}`);
        }
        if (response.status === 400) {
          setErrors(data);
          console.log(data);
          props.handleNotification("error", "", t("couldnt-find-trip"));
        }
        if (response.status === 401) {
          props.handleNotification("error", "", t("not-authorized"));
        }
        if (response.status === 500) {
          props.handleNotification("error", "", t("server-error"));
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <Modal show={props.show} onHide={handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{t("join-private-trip")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Form.Group className="mb-3" controlId="forminviteCode">
              <Form.Label>{t("invite-code")}</Form.Label>
              <Form.Control
                type="text"
                value={inviteCode}
                name="inviteCode"
                onChange={onInputChange}
                isInvalid={!!errors.inviteCode}
              />
              <Form.Control.Feedback type="invalid">
                {errors.inviteCode}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={submitData}>
          {t("go-to-trip")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripJoinPrivateModal;
