import { Button, Container, Modal, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const TripDeleteModal = (props) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const body = {
        tripId: props.tripId,
        userId: props.userId,
        finished: props.finished,
      };
      const response = await fetch("/api/trip", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        props.handleClose();
        router.push(`/profile/${props.username}/trips`);
        props.handleNotification("success", "", t("trip-deleted"));
      }
      if (response.status === 400) {
        const data = await response.json();
        console.log(data);
        props.handleNotification("error", "", t("couldnt-delete-trip"));
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
        <Modal.Title>{t("delete-trip")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <p>{t("delete-trip-confirmation")}</p>
            <p className="strong">{t("delete-trip-description")}</p>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="danger" onClick={submitData}>
          {t("delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripDeleteModal;
