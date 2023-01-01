import styles from "./TripsList.module.css";
import { Row, Col, Container } from "react-bootstrap";
import TripCard from "./TripCard";
import { useTranslation } from "next-i18next";

const TripsList = (props) => {
  const { t } = useTranslation("common");

  props.trips.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <Container className={styles.container}>
      <Row className={styles.titleRow}>
        <Col>
          <h1 className={styles.titleH1}>{props.title}</h1>
        </Col>
      </Row>
      <Row className={styles.vehicleRow}>
        {props.trips.length > 0 ? (
          props.trips.map((trip) => {
            return <TripCard trip={trip} key={trip.id} mytrips={true} />;
          })
        ) : (
          <Col>
            <h1 className={styles.titleH1}>{t("no-trips-done-yet")}</h1>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TripsList;
