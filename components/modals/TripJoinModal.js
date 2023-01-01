import { Button, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const TripJoinModal = (props) => {
  const { t } = useTranslation("common");

  const submitData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        tripId: props.tripId,
        userId: props.userId,
      };
      const response = await fetch("/api/trip/join", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        props.handleClose();
        props.refresh();
        props.handleNotification("success", "", t("trip-joined"));
      }
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        props.handleNotification("error", "", t("couldnt-join-trip"));
      }
      if (response.status === 401) {
        props.handleClose();
        props.handleNotification("error", "", t("not-authorized"));
      }
      if (response.status === 500) {
        props.handleClose();
        props.handleNotification("error", "", t("server-error"));
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{t("join-trip")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <p>{t("join-trip-confirmation")}</p>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={submitData}>
          {t("join")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripJoinModal;
