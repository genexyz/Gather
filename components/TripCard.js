import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { Col, Row, Card, Button } from "react-bootstrap";
import styles from "./TripCard.module.css";

export default function TripCard({ trip, mytrips }) {
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  let backgroundStyle = styles.transparent;
  let colorStyle = styles.white;
  let borderStyle = styles.borderWhite;
  if (trip.freeSlots === 1) {
    backgroundStyle = styles.red;
    colorStyle = styles.textRed;
    borderStyle = styles.borderRed;
  } else if (trip.freeSlots >= 4) {
    backgroundStyle = styles.green;
    colorStyle = styles.textGreen;
    borderStyle = styles.borderGreen;
  } else if (trip.freeSlots >= 2) {
    backgroundStyle = styles.yellow;
    colorStyle = styles.textYellow;
    borderStyle = styles.borderYellow;
  }
  let originImage = "/images/trips/location.webp";
  let destinationImage = "/images/trips/location3.webp";
  let calendarImage = "/images/trips/timetable.webp";
  let arrowImage = "/images/trips/down.webp";
  if (trip.freeSlots === 0) {
    originImage = "/images/trips/placeholder.webp";
    destinationImage = "/images/trips/placeholder1.webp";
    calendarImage = "/images/trips/schedule.webp";
    arrowImage = "/images/trips/downarrow.webp";
  }

  return (
    <Col md={6} xxl={4} className={styles.tripCol} key={trip.id}>
      <Card
        className={`${styles.tripCard} ${
          trip.freeSlots === 0 ? styles.disabledCard : ""
        }`}
      >
        <div className={styles.tripCardHeader + " " + backgroundStyle}>
          {session && (
            <>
              <Image
                src={trip.driver.image}
                alt={`Profile picture of the driver ${trip.driver.name}`}
                width={50}
                height={50}
                className={styles.profilePicture}
              />
              <div className={styles.driverDetails}>
                <p className="strong">{trip.driver.name}</p>
                <p>
                  {t("average-rating")} {trip.driver.averageScore.toFixed(1)}/5
                </p>
              </div>
            </>
          )}
          {!session && (
            <>
              <Image
                src="/images/header/user.webp"
                alt={`Dummy Profile picture of the driver`}
                width={50}
                height={50}
                className={styles.profilePicture}
              />
              <div className={styles.driverDetails}>
                <Link className={styles.signInLink} href="/api/auth/signin" passHref>
                  {t("sign-in-to-see")}
                </Link>
                <p>{t("average-rating")} -/-</p>
              </div>
            </>
          )}
        </div>
        <Card.Body className={styles.tripBody}>
          <div className={styles.tripLocation}>
            <Row className={styles.tripToFromLocation}>
              <div className={styles.tripPlaceholder}>
                <Image
                  src={originImage}
                  alt="Origin Location Icon"
                  width={30}
                  height={30}
                />
              </div>
              <div className={styles.tripLocationName}>
                <Card.Title className={styles.tripTitle}>
                  {trip.origin.split(",")[0]}
                </Card.Title>
                <Card.Subtitle className={styles.tripSubtitle}>
                  {trip.origin.split(/(,)/).slice(2)}
                </Card.Subtitle>
              </div>
            </Row>
            <Row>
              <div className={styles.tripPlaceholder}></div>
              <div className={styles.tripArrow}>
                <Image
                  src={arrowImage}
                  alt="Down arrow between origin and location"
                  width={30}
                  height={30}
                />
              </div>
            </Row>
            <Row className={styles.tripToFromLocation}>
              <div className={styles.tripPlaceholder}>
                <Image
                  src={destinationImage}
                  alt="Destination Location Icon"
                  width={30}
                  height={30}
                  className={styles.tripLocationIcon}
                />
              </div>
              <div className={styles.tripLocationName}>
                <Card.Title className={styles.tripTitle}>
                  {trip.destination.split(",")[0]}
                </Card.Title>
                <Card.Subtitle className={styles.tripSubtitle}>
                  {trip.destination.split(/(,)/).slice(2)}
                </Card.Subtitle>
              </div>
            </Row>
          </div>
          <Card.Text as="div" className={styles.tripText}>
            <Row className={styles.dateRow}>
              <Col xs={3}>
                <Image
                  src={calendarImage}
                  alt="Date and Time Icon"
                  width={35}
                  height={35}
                  className={styles.iconImage}
                />
              </Col>
              <Col xs={9} className={styles.dateTextCol}>
                <p>
                  {new Date(trip.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  {new Date(trip.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Col>
            </Row>
            {(trip.freeSlots > 0 || mytrips) && (
              <>
                <div className={styles.availableSeats}>
                  <p>
                    <span className={colorStyle}>{trip.freeSlots} </span>
                    {trip.freeSlots === 1 ? t("available-seat") : t("available-seats")}
                  </p>
                </div>
                <Link href={`/trips/${trip.id}`} passHref>
                  <Button
                    className={
                      styles.viewTripBtn + " " + backgroundStyle + " " + borderStyle
                    }
                  >
                    {t("view-trip")}
                  </Button>
                </Link>
              </>
            )}
            {trip.freeSlots === 0 && !mytrips && (
              <Row className={styles.noSeatsRow}>
                <div className={styles.noSeatsDiv}>GATHERED</div>
              </Row>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
