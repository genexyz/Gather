import { useState, useEffect } from "react";
import { Button, Container, Modal, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const VehicleModal = (props) => {
  const { t } = useTranslation("common");

  const [errors, setErrors] = useState({});
  const [vehicle, setVehicle] = useState({
    type: "",
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    seats: 0,
  });

  useEffect(() => {
    setVehicle({
      type: props.vehicle ? props.vehicle.type : "",
      licensePlate: props.vehicle ? props.vehicle.licensePlate : "",
      brand: props.vehicle ? props.vehicle.brand : "",
      model: props.vehicle ? props.vehicle.model : "",
      year: props.vehicle ? props.vehicle.year : "",
      color: props.vehicle ? props.vehicle.color : "",
      seats: props.vehicle ? props.vehicle.seats : 0,
    });
  }, [props]);

  const handleClose = () => {
    setVehicle({
      type: "",
      licensePlate: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      seats: 0,
    });
    setErrors({});
    props.handleClose();
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setVehicle((prevState) => ({
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
    let { type, licensePlate, brand, model, year, color, seats } = vehicle;

    seats = parseInt(seats);

    const newErrors = {};
    if (!type || type === "") newErrors.type = t("cannot-be-blank");
    if (!["Car", "Motorbike", "Bus", "Van", "Truck", "Other"].includes(type))
      newErrors.type = t("cannot-be-diff-than-vehicle-type");
    if (!seats) newErrors.seats = t("cannot-be-blank-and-should-be-number");
    if (seats < 0) newErrors.seats = t("cannot-be-negative");
    if (seats === 0) newErrors.seats = t("cannot-be-0");
    if (seats > 100) newErrors.seats = t("cannot-be-more-than-100");
    if (!licensePlate || licensePlate === "")
      newErrors.licensePlate = t("cannot-be-blank");
    if (!brand || brand === "") newErrors.brand = t("cannot-be-blank");
    if (!model || model === "") newErrors.model = t("cannot-be-blank");
    if (!year || year === "") newErrors.year = t("cannot-be-blank");
    if (!color || color === "") newErrors.color = t("cannot-be-blank");
    return newErrors;
  };

  const submitData = async (e) => {
    e.preventDefault();
    const method = props.type === "add" ? "POST" : "PUT";
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const body = {
          ...vehicle,
          id: props.vehicle ? props.vehicle.id : null,
          userId: props.session.user.id,
        };
        const response = await fetch("/api/vehicle", {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification(
            "success",
            "",
            `${props.type === "add" ? t("vehicle-created") : t("vehicle-edited")}`
          );
        }
        if (response.status === 400) {
          setErrors(data);
          console.log(data);
          props.handleNotification(
            "error",
            "",
            `${
              props.type === "add"
                ? t("couldnt-create-vehicle")
                : t("couldnt-edit-vehicle")
            }`
          );
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
    <Modal show={props.show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {(props.type === "add" ? t("add") : t("edit")) + " " + t("vehicle")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formVehicleType">
                  <Form.Label>{t("type")}</Form.Label>
                  <Form.Select
                    required
                    aria-label="Vehicle Type Select"
                    value={vehicle.type}
                    name="type"
                    onChange={onInputChange}
                    isInvalid={!!errors.type}
                  >
                    <option value="">{t("select")}</option>
                    <option value="Car">{t("car")}</option>
                    <option value="Motorbike">{t("motorbike")}</option>
                    <option value="Bus">{t("bus")}</option>
                    <option value="Van">{t("van")}</option>
                    <option value="Truck">{t("truck")}</option>
                    <option value="Other">{t("other")}</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formVehicleLicensePlate">
                  <Form.Label>{t("license-plate")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehicle.licensePlate}
                    name="licensePlate"
                    onChange={onInputChange}
                    isInvalid={!!errors.licensePlate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.licensePlate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formVehicleBrand">
                  <Form.Label>{t("brand")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehicle.brand}
                    name="brand"
                    onChange={onInputChange}
                    isInvalid={!!errors.brand}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.brand}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formVehicleModel">
                  <Form.Label>{t("model")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehicle.model}
                    name="model"
                    onChange={onInputChange}
                    isInvalid={!!errors.model}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.model}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="formVehicleYear">
                  <Form.Label>{t("year")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehicle.year}
                    name="year"
                    onChange={onInputChange}
                    isInvalid={!!errors.year}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.year}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formVehicleColor">
                  <Form.Label>{t("color")}</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehicle.color}
                    name="color"
                    onChange={onInputChange}
                    isInvalid={!!errors.color}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.color}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formVehicleSeats">
                  <Form.Label>{t("seats")}</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      required
                      type="number"
                      min={0}
                      max={100}
                      value={vehicle.seats}
                      name="seats"
                      onChange={onInputChange}
                      isInvalid={!!errors.seats}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.seats}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="primary" onClick={submitData}>
          {t("save-changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VehicleModal;
