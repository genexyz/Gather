import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import AutocompleteGoogle from "react-google-autocomplete";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Button, Container, Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import styles from "./TripModals.module.css";

const TripEditModal = (props) => {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const [errors, setErrors] = useState({});
  const [trip, setTrip] = useState({
    origin: "",
    originId: "",
    originMeetingPoint: "",
    destination: "",
    destinationId: "",
    destinationMeetingPoint: "",
    date: "",
    totalSlots: 0,
    freeSlots: 0,
    description: "",
    notes: "",
    distance: "",
    duration: "",
    smoking: false,
    pets: false,
    kids: false,
    gasCost: 0,
    tollsCost: 0,
    othersCost: 0,
    privacy: "public",
    vehicleId: "",
    driverId: "",
    vehicleSeats: 0,
  });
  const [open, setOpen] = useState(false);
  const [vehicleName, setVehicleName] = useState("");

  useEffect(() => {
    setTrip({
      origin: props.trip ? props.trip.origin : "",
      originId: props.trip ? props.trip.originId : "",
      originMeetingPoint: props.trip ? props.trip.originMeetingPoint : "",
      destination: props.trip ? props.trip.destination : "",
      destinationId: props.trip ? props.trip.destinationId : "",
      destinationMeetingPoint: props.trip ? props.trip.destinationMeetingPoint : "",
      date: props.trip ? props.trip.date : "",
      totalSlots: props.trip ? props.trip.totalSlots : 0,
      freeSlots: props.trip ? props.trip.freeSlots : 0,
      description: props.trip ? props.trip.description : "",
      notes: props.trip ? props.trip.notes : "",
      distance: props.trip ? props.trip.distance : "",
      duration: props.trip ? props.trip.duration : "",
      smoking: props.trip ? props.trip.smoking : false,
      pets: props.trip ? props.trip.pets : false,
      kids: props.trip ? props.trip.kids : false,
      gasCost: props.trip ? props.trip.gasCost : 0,
      tollsCost: props.trip ? props.trip.tollsCost : 0,
      othersCost: props.trip ? props.trip.othersCost : 0,
      privacy: props.trip ? props.trip.privacy : "public",
      vehicleId: props.trip ? props.trip.vehicleId : "",
      driverId: props.trip ? props.trip.driverId : "",
      vehicleSeats: props.trip ? props.trip.vehicle.seats : 0,
    });
    setVehicleName(
      props.trip
        ? props.trip.vehicle.brand +
            " " +
            props.trip.vehicle.model +
            " " +
            props.trip.vehicle.year
        : ""
    );
  }, [props]);

  const handleClose = () => {
    setTrip({
      origin: "",
      originId: "",
      originMeetingPoint: "",
      destination: "",
      destinationId: "",
      destinationMeetingPoint: "",
      date: "",
      totalSlots: 0,
      freeSlots: 0,
      description: "",
      notes: "",
      distance: "",
      duration: "",
      smoking: false,
      pets: false,
      kids: false,
      gasCost: 0,
      tollsCost: 0,
      othersCost: 0,
      privacy: "public",
      vehicleId: "",
      driverId: "",
      vehicleSeats: 0,
    });
    setVehicleName("");
    setErrors({});
    props.handleClose();
  };

  const AutocompleteVehicleOptions = props.vehicles.map((vehicle) => {
    return {
      label: vehicle.brand + " " + vehicle.model + " " + vehicle.year,
      id: vehicle.id,
    };
  });

  const setNames = (name, filter, place) => {
    if (filter === "origin") {
      setTrip((prevState) => ({
        ...prevState,
        [filter]: name,
        ["originId"]: place.place_id,
      }));
    }
    if (filter === "destination") {
      setTrip((prevState) => ({
        ...prevState,
        [filter]: name,
        ["destinationId"]: place.place_id,
      }));
    }
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setTrip((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (!!errors[name])
      setErrors({
        ...errors,
        [name]: null,
      });
  };

  const onDateChange = (newValue) => {
    let dateAux = new Date(newValue.$d);
    let dateFinal = dateAux.toISOString();

    setTrip((prevState) => ({
      ...prevState,
      ["date"]: dateFinal,
    }));

    if (!!errors["date"])
      setErrors({
        ...errors,
        ["date"]: null,
      });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setTrip((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const onVehicleChange = (event, value) => {
    let vehicleIdValue = value ? value.id : "";
    let vehicleNameValue = value ? value.label : "";

    setTrip((prevState) => ({
      ...prevState,
      ["vehicleId"]: vehicleIdValue,
      ["vehicleSeats"]: props.vehicles.find((vehicle) => vehicle.id === vehicleIdValue)
        .seats,
      ["totalSlots"]:
        props.vehicles.find((vehicle) => vehicle.id === vehicleIdValue).seats - 1,
    }));

    setVehicleName(vehicleNameValue);

    if (!!errors["vehicleId"])
      setErrors({
        ...errors,
        ["vehicleId"]: null,
      });
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const findFormErrors = () => {
    let {
      origin,
      originMeetingPoint,
      destination,
      destinationMeetingPoint,
      date,
      totalSlots,
      description,
      notes,
      smoking,
      pets,
      kids,
      gasCost,
      tollsCost,
      othersCost,
      privacy,
      vehicleId,
    } = trip;
    const newErrors = {};

    totalSlots = parseInt(totalSlots);
    gasCost = parseFloat(gasCost);
    tollsCost = parseFloat(tollsCost);
    othersCost = parseFloat(othersCost);
    let vehicleSeats = parseInt(props.trip.vehicle.seats);
    const driverId = session.user.id;

    let dateSelected = new Date(date);
    let dateToday = new Date();

    if (!origin || origin === "") newErrors.origin = t("cannot-be-blank");
    if (!originMeetingPoint || originMeetingPoint === "")
      newErrors.originMeetingPoint = t("cannot-be-blank");
    if (!destination || destination === "") newErrors.destination = t("cannot-be-blank");
    if (!destinationMeetingPoint || destinationMeetingPoint === "")
      newErrors.destinationMeetingPoint = t("cannot-be-blank");
    if (!date || date === "") newErrors.date = t("cannot-be-blank");
    if (dateSelected < dateToday) newErrors.date = t("date-must-be-in-the-future");
    if (!totalSlots || totalSlots === "") newErrors.totalSlots = t("cannot-be-blank");
    if (totalSlots === 0) newErrors.totalSlots = t("cannot-be-0");
    if (totalSlots < 0) newErrors.totalSlots = t("cannot-be-negative");
    if (totalSlots > vehicleSeats - 1)
      newErrors.totalSlots = t("cannot-be-greater-than-total-seats");
    if (!description || description === "") newErrors.description = t("cannot-be-blank");
    if (description.length > 250) newErrors.description = t("cannot-be-longer-than-250");
    if (!notes || notes === "") newErrors.notes = t("cannot-be-blank");
    if (notes.length > 250) newErrors.notes = t("cannot-be-longer-than-250");
    if (smoking === null) newErrors.smoking = t("cannot-be-null");
    if (pets === null) newErrors.pets = t("cannot-be-null");
    if (kids === null) newErrors.kids = t("cannot-be-null");
    if ((!gasCost || gasCost === "") && gasCost !== 0)
      newErrors.gasCost = t("cannot-be-blank");
    if (gasCost < 0) newErrors.gasCost = t("cannot-be-negative");
    if ((!tollsCost || tollsCost === "") && tollsCost !== 0)
      newErrors.gasCost = t("cannot-be-blank");
    if (tollsCost < 0) newErrors.gasCost = t("cannot-be-negative");
    if ((!othersCost || othersCost === "") && othersCost !== 0)
      newErrors.othersCost = t("cannot-be-blank");
    if (othersCost < 0) newErrors.othersCost = t("cannot-be-negative");
    if (!privacy || (privacy !== "private" && privacy !== "public"))
      newErrors.privacy = t("cannot-be-different-than-public-private");
    if (!driverId || driverId === "") newErrors.driverId = t("cannot-be-blank");
    if (!vehicleId || vehicleId === "") newErrors.vehicleId = t("cannot-be-blank");

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
          ...trip,
          totalSlots: parseInt(trip.totalSlots),
          freeSlots: trip.totalSlots - props.trip.passengers.length,
          gasCost: parseFloat(trip.gasCost),
          tollsCost: parseFloat(trip.tollsCost),
          othersCost: parseFloat(trip.othersCost),
          vehicleSeats: parseInt(trip.vehicleSeats),
          driverId: session.user.id,
          tripId: props.trip.id,
        };
        const response = await fetch("/api/trip", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (response.status === 200) {
          handleClose();
          props.refresh();
          props.handleNotification("success", "", t("trip-edited"));
        }
        if (response.status === 400) {
          const data = await response.json();
          setErrors(data);
          console.log(data);
          props.handleNotification("error", "", t("couldnt-edit-trip"));
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
    <Modal
      show={props.show}
      onHide={handleClose}
      size="xl"
      className={styles.modal}
      backdropClassName={styles.modalBackdrop}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("edit-trip")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formVehicle">
                  <Form.Label>{t("vehicle")}</Form.Label>
                  <Autocomplete
                    disablePortal
                    id="formVehicle"
                    name="vehicleId"
                    options={AutocompleteVehicleOptions}
                    value={vehicleName}
                    onChange={(event, value) => onVehicleChange(event, value)}
                    isOptionEqualToValue={() => {
                      return true;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.vehicleId ? true : false}
                        helperText={errors.vehicleId}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>{t("date")}</Form.Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      disablePast
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      label="Trip Date"
                      value={trip.date}
                      onChange={onDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onKeyDown={onKeyDown}
                          onClick={(e) => setOpen(true)}
                          error={errors.date ? true : false}
                          helperText={errors.date}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formOrigin">
                  <Form.Label>{t("trips-filter-origin")}</Form.Label>
                  <AutocompleteGoogle
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    id="origin"
                    placeholder={t("trips-filter-origin-placeholder")}
                    onPlaceSelected={(place) => {
                      setNames(place.formatted_address, "origin", place);
                    }}
                    className={`${styles.originInput} ${
                      errors.origin ? styles.locationInvalid : ""
                    }`}
                    value={trip.origin}
                    name="origin"
                    onChange={onInputChange}
                  />
                  <div
                    className={`${styles.invalidFeedback} ${
                      errors.origin ? styles.invalid : ""
                    }`}
                    type="invalid"
                  >
                    {errors.origin}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formOriginMeetingPoint">
                  <Form.Label>
                    {t("origin-meeting-point")} {t("address-landmark")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={trip.originMeetingPoint}
                    name="originMeetingPoint"
                    onChange={onInputChange}
                    isInvalid={!!errors.originMeetingPoint}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.originMeetingPoint}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formDestination">
                  <Form.Label>{t("trips-filter-destination")}</Form.Label>
                  <AutocompleteGoogle
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    id="destination"
                    placeholder={t("trips-filter-destination-placeholder")}
                    onPlaceSelected={(place) => {
                      setNames(place.formatted_address, "destination", place);
                    }}
                    className={`${styles.originInput} ${
                      errors.destination ? styles.locationInvalid : ""
                    }`}
                    value={trip.destination}
                    name="destination"
                    onChange={onInputChange}
                  />
                  <div
                    className={`${styles.invalidFeedback} ${
                      errors.destination ? styles.invalid : ""
                    }`}
                    type="invalid"
                  >
                    {errors.destination}
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formDestinationMeetingPoint">
                  <Form.Label>
                    {t("destination-meeting-point")} {t("address-landmark")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={trip.destinationMeetingPoint}
                    name="destinationMeetingPoint"
                    onChange={onInputChange}
                    isInvalid={!!errors.destinationMeetingPoint}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.destinationMeetingPoint}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>{t("description")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={trip.description}
                    name="description"
                    onChange={onInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formNotes">
                  <Form.Label>{t("notes")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={trip.notes}
                    name="notes"
                    onChange={onInputChange}
                    isInvalid={!!errors.notes}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formSeats">
                  <Form.Label>{t("seats-available")}</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    max={100}
                    value={trip.totalSlots}
                    name="totalSlots"
                    onChange={onInputChange}
                    isInvalid={!!errors.totalSlots}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.totalSlots}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formGasCost">
                  <Form.Label>{t("estimated-gas-costs")}</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      min={0}
                      value={trip.gasCost}
                      name="gasCost"
                      onChange={onInputChange}
                      isInvalid={!!errors.gasCost}
                    />
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.gasCost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formTollsCost">
                  <Form.Label>{t("estimated-tolls-costs")}</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      min={0}
                      value={trip.tollsCost}
                      name="tollsCost"
                      onChange={onInputChange}
                      isInvalid={!!errors.tollsCost}
                    />
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.tollsCost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formOthersCost">
                  <Form.Label>{t("estimated-other-costs")}</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      min={0}
                      value={trip.othersCost}
                      name="othersCost"
                      onChange={onInputChange}
                      isInvalid={!!errors.othersCost}
                    />
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      {errors.othersCost}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row className={styles.checkboxsRow}>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="formPets">
                  <InputGroup className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="pets"
                      onChange={handleCheckboxChange}
                      checked={trip.pets}
                      label={t("pets-allowed")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.pets}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="formKids">
                  <InputGroup className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="kids"
                      onChange={handleCheckboxChange}
                      checked={trip.kids}
                      label={t("kids-allowed")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.kids}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col sm={4}>
                <Form.Group className="mb-3" controlId="formSmoking">
                  <InputGroup className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="smoking"
                      onChange={handleCheckboxChange}
                      checked={trip.smoking}
                      label={t("smoking-allowed")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.smoking}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="formPrivacy">
                  <Form.Label>{t("trip-privacy")}</Form.Label>
                  <Form.Select
                    aria-label={t("trip-privacy-select")}
                    value={trip.privacy}
                    name="privacy"
                    onChange={onInputChange}
                    isInvalid={!!errors.privacy}
                  >
                    <option value="public">{t("public")}</option>
                    <option value="private">{t("private")}</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.privacy}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={submitData}>
          {t("save-changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripEditModal;
