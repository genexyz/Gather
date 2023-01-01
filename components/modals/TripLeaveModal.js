import { Button, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const TripLeaveModal = (props) => {
  const { t } = useTranslation("common");

  const submitData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        tripId: props.tripId,
        userId: props.userId,
      };
      const response = await fetch("/api/trip/leave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        props.handleClose();
        props.refresh();
        props.handleNotification("success", "", t("trip-left"));
      }
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        props.handleNotification("error", "", t("couldnt-leave-trip"));
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
        <Modal.Title>{t("leave-trip")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <p>{t("leave-trip-confirmation")}</p>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="danger" onClick={submitData}>
          {t("leave")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripLeaveModal;
