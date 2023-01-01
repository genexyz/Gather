import { Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import styles from "./PassengerCard.module.css";

export default function PassengerCard({
  passenger,
  session,
  trip,
  isDriver,
  handleRemove,
}) {
  const { t } = useTranslation("common");

  return (
    <Col lg={6} xxl={4}>
      <div className={isDriver ? styles.passengerCardDriver : styles.passengerCard}>
        <Row className={styles.user}>
          <Col xs={4}>
            <Image
              src={passenger.image}
              alt={passenger.name}
              width={70}
              height={70}
              className={styles.userImage}
            />
          </Col>
          <Col xs={8}>
            <div className={styles.passengerInfo}>
              <h3>{passenger.name}</h3>
              <a
                href={`https://wa.me/${passenger.phone}`}
                target="_blank"
                rel="noreferrer"
                className={styles.phoneLink}
              >
                <h4>
                  <Image
                    src="/images/trips/whatsapp.webp"
                    className="m-2"
                    alt="Whatsapp"
                    width={20}
                    height={20}
                  />
                  {passenger.phone}
                </h4>
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={isDriver ? styles.driverBio : styles.passengerBio}>
              <p>{passenger.bio}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link href={`/profile/${passenger.username}`} passHref>
              <Button
                className={
                  isDriver ? styles.driverProfileButton : styles.passengerProfileButton
                }
              >
                {t("see-profile")}
              </Button>
            </Link>
          </Col>
          {session.user.id === trip.driver.id &&
            passenger.id !== trip.driver.id &&
            !trip.finished && (
              <Col>
                <Button className={styles.passengerRemoveButton} onClick={handleRemove}>
                  {t("remove-passenger")}
                </Button>
              </Col>
            )}
        </Row>
      </div>
    </Col>
  );
}
