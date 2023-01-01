import { Button, Container, Modal, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const VehicleDeleteModal = (props) => {
  const { t } = useTranslation("common");

  const submitData = async (e) => {
    e.preventDefault();

    try {
      const body = {
        id: props.vehicle ? props.vehicle.id : null,
        userId: props.session.user.id,
      };
      const response = await fetch("/api/vehicle", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.status === 200) {
        props.handleClose();
        props.refresh();
        props.handleNotification("success", "", t("vehicle-deleted"));
      }
      if (response.status === 400) {
        console.log(data);
        props.handleNotification("error", "", t("couldnt-delete-vehicle"));
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
        <Modal.Title>{t("delete-vehicle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <p>
              {t("vehicle")}: {"   "}
              <span className="strong">
                {props.vehicle?.brand ? props.vehicle.brand : "---"} {"  "}
                {props.vehicle?.model ? props.vehicle.model : "---"} {"  "}
                {props.vehicle?.year ? props.vehicle.year : "---"} {"  "}
              </span>
            </p>
          </Row>
          <Row>
            <p>
              <span className="strong">{t("delete-vehicle-confirmation")}</span>
            </p>
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

export default VehicleDeleteModal;
