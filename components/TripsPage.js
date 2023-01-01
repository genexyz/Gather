import Link from "next/link";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import styles from "./TripsPage.module.css";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import TripJoinPrivateModal from "./modals/TripJoinPrivateModal";
import TripCard from "./TripCard";
import { useTranslation } from "next-i18next";

export default function TripsPage(props) {
  const [filter, setFilter] = useState({
    origin: "",
    destination: "",
    date: null,
    pets: null,
    smoking: null,
    kids: null,
    includeFull: false,
    passengers: 1,
  });
  const [open, setOpen] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);

  const { t } = useTranslation("common");

  const handleNotification = (type, message, title) => {
    if (type === "success") {
      NotificationManager.success(message, title, 6000);
    }
    if (type === "error") {
      NotificationManager.error(message, title, 6000);
    }
    if (type === "warning") {
      NotificationManager.warning(message, title, 6000);
    }
  };

  const handleClose = () => {
    setShowPrivate(false);
  };

  const handleShowPrivate = () => {
    setShowPrivate(true);
  };

  const setCheckboxFilter = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setFilter((prevState) => ({
        ...prevState,
        [name]: true,
      }));
    } else {
      if (name === "includeFull") {
        setFilter((prevState) => ({
          ...prevState,
          [name]: false,
        }));
      } else {
        setFilter((prevState) => ({
          ...prevState,
          [name]: null,
        }));
      }
    }
  };

  const onDateChange = (newValue) => {
    let dateAux = new Date(newValue.$d);
    let dateFinal = dateAux.toISOString();

    setFilter((prevState) => ({
      ...prevState,
      ["date"]: dateFinal,
    }));
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;

    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onResetClick = () => {
    setFilter({
      origin: "",
      destination: "",
      pets: null,
      kids: null,
      smoking: null,
      includeFull: false,
      date: null,
      passengers: 1,
    });
  };

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  let dataSearch = props.trips
    .filter((item) => {
      let dateAux = new Date(item.date);
      let day = dateAux.getDate();
      let month = dateAux.getMonth() + 1;
      let year = dateAux.getFullYear();
      let itemDate = `${year}-${month}-${day}`;

      let filterDate = null;
      if (filter.date) {
        let filterDateAux = new Date(filter.date);
        let filterDay = filterDateAux.getDate();
        let filterMonth = filterDateAux.getMonth() + 1;
        let filterYear = filterDateAux.getFullYear();
        filterDate = `${filterYear}-${filterMonth}-${filterDay}`;
      }
      return Object.keys(item).some(
        () =>
          item["origin"].toLowerCase().includes(filter.origin.toLowerCase()) &&
          item["destination"].toLowerCase().includes(filter.destination.toLowerCase()) &&
          (filter.pets === null || item["pets"] === filter.pets) &&
          (filter.smoking === null || item["smoking"] === filter.smoking) &&
          (filter.kids === null || item["kids"] === filter.kids) &&
          (filterDate === null || itemDate === filterDate) &&
          item["finished"] === false &&
          (filter.includeFull === null || !filter.includeFull
            ? item["freeSlots"] >= parseInt(filter.passengers)
            : true) &&
          new Date(item["date"]) >= new Date()
      );
    })
    .sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA - dateB;
    });

  // Show all trips in first page load
  if (
    filter.origin === "" &&
    filter.destination === "" &&
    filter.pets === null &&
    filter.smoking === null &&
    filter.kids === null &&
    filter.includeFull === null &&
    parseInt(filter.passengers) === 1 &&
    filter.date === null
  ) {
    dataSearch = props.trips
      .sort((a, b) => {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateA - dateB;
      })
      .filter((item) => {
        return new Date(item["date"]) >= new Date() && item.finished === false;
      });
  }

  return (
    <>
      <div className={styles.section}>
        <Container className={styles.container}>
          <Row>
            <Col lg={3} className={styles.filtersCol}>
              <Row>
                <h1>{t("trips-search-title")}</h1>
              </Row>
              <Form.Group className="mb-3" controlId="formOrigin">
                <Form.Label className={styles.inputLabel}>
                  {t("trips-filter-origin")}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="origin"
                  value={filter.origin}
                  onChange={onInputChange}
                  className={styles.originInput}
                  placeholder={t("trips-filter-origin-placeholder")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDestination">
                <Form.Label className={styles.inputLabel}>
                  {t("trips-filter-destination")}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destination"
                  value={filter.destination}
                  onChange={onInputChange}
                  className={styles.originInput}
                  placeholder={t("trips-filter-destination-placeholder")}
                />
              </Form.Group>
              <Row>
                <Form.Group className="mb-2">
                  <p className={styles.inputLabel}>{t("trips-filter-date")}</p>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast
                      open={open}
                      onOpen={() => setOpen(true)}
                      onClose={() => setOpen(false)}
                      value={filter.date}
                      onChange={onDateChange}
                      className={styles.datePicker}
                      renderInput={(params) => (
                        <TextField
                          onKeyDown={onKeyDown}
                          onClick={(e) => setOpen(true)}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className="mb-2">
                  <p className={styles.inputLabel}>{t("trips-filter-passengers")}</p>
                  <Form.Control
                    type="number"
                    name="passengers"
                    min={1}
                    max={100}
                    value={filter.passengers}
                    className={styles.passengersInput}
                    onChange={onInputChange}
                  />
                </Form.Group>
              </Row>
              <p className={styles.inputLabel}>{t("trips-filter-allowed")}</p>
              <Form.Check
                type="checkbox"
                id="checkboxPets"
                label={t("pets")}
                name="pets"
                value={filter.pets === null ? false : filter.pets}
                checked={filter.pets === null ? false : filter.pets}
                onChange={(value) => setCheckboxFilter(value)}
              />
              <Form.Check
                type="checkbox"
                id="checkboxKids"
                label={t("kids")}
                name="kids"
                value={filter.kids === null ? false : filter.kids}
                checked={filter.kids === null ? false : filter.kids}
                onChange={(value) => setCheckboxFilter(value)}
              />
              <Form.Check
                type="checkbox"
                id="checkboxSmoking"
                label={t("smoking")}
                name="smoking"
                value={filter.smoking === null ? false : filter.smoking}
                checked={filter.smoking === null ? false : filter.smoking}
                onChange={(value) => setCheckboxFilter(value)}
              />
              <p className={styles.inputLabel}>Extras:</p>
              <Form.Check
                type="checkbox"
                id="checkboxFull"
                label={t("trips-filter-include")}
                name="includeFull"
                value={filter.includeFull === null ? false : filter.includeFull}
                checked={filter.includeFull === null ? false : filter.includeFull}
                onChange={(value) => setCheckboxFilter(value)}
              />
              <Button
                variant="outline-secondary"
                className={styles.resetButton}
                onClick={onResetClick}
              >
                {t("trips-filter-reset")}
              </Button>
            </Col>
            <Col lg={9} className={styles.tripsCol}>
              <Row className={styles.tripsHeader}>
                <Col md={6}>
                  <h1 className={styles.titleH1}>{t("available-trips")}</h1>
                </Col>
                <Col md={6} className={styles.newTripCol}>
                  <Button
                    variant="secondary"
                    className={styles.privateTripBtn}
                    onClick={() => handleShowPrivate()}
                  >
                    {t("join-private-trip")}
                  </Button>
                  <Link href="/newtrip">
                    <Button variant="success" className={styles.newTripBtn}>
                      {t("create-trip")}
                    </Button>
                  </Link>
                </Col>
              </Row>
              <Row>
                {dataSearch.length === 0 ? (
                  <p className={styles.noTrips}>{t("no-trips")}</p>
                ) : (
                  dataSearch.map((trip) => (
                    <TripCard key={trip.id} trip={trip} mytrips={false} />
                  ))
                )}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      <TripJoinPrivateModal
        show={showPrivate}
        handleClose={handleClose}
        handleNotification={handleNotification}
      />
    </>
  );
}
