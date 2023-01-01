// Next
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";

// Prisma
import prisma from "../../lib/prisma";
import { useSession, getSession } from "next-auth/react";

// Styles
import styles from "./trip.module.css";
import { Rating, Tooltip } from "@mui/material";
import { Container, Row, Col, Button } from "react-bootstrap";

// Components
import { NotificationManager } from "react-notifications";
import TripJoinModal from "../../components/modals/TripJoinModal";
import TripLeaveModal from "../../components/modals/TripLeaveModal.js";
import TripRemoveUserModal from "../../components/modals/TripRemoveUserModal";
import TripEndModal from "../../components/modals/TripEndModal";
import TripReviewModal from "../../components/modals/TripReviewModal";
import TripEditModal from "../../components/modals/TripEditModal";
import TripDeleteModal from "../../components/modals/TripDeleteModal";
import PassengerCard from "../../components/PassengerCard";
import Spinner from "../../components/Spinner";

export default function Trip(props) {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [passenger, setPassenger] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { t } = useTranslation("common");

  const router = useRouter();
  const locale = router.locale;

  const refreshData = () => {
    router.replace(router.asPath);
  };
  const handleClose = () => {
    setShow(false);
    setShowLeave(false);
    setShowRemove(false);
    setShowEnd(false);
    setShowReview(false);
    setShowEdit(false);
    setShowDelete(false);
    setPassenger(null);
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleRemoveShow = (p) => {
    setPassenger(p);
    setShowRemove(true);
  };
  const handleLeaveShow = () => {
    setShowLeave(true);
  };
  const handleEndShow = () => {
    setShowEnd(true);
  };
  const handleReviewShow = () => {
    setShowReview(true);
  };
  const handleEditShow = () => {
    setShowEdit(true);
  };
  const handleDeleteShow = () => {
    setShowDelete(true);
  };

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

  return (
    <>
      <Head>
        <title>{`Gather - ${props.trip.origin} to ${props.trip.destination} Trip`}</title>
      </Head>
      <div className={styles.section}>
        <Container className={styles.container}>
          {status === "loading" && (
            <Row className={styles.mainRow + " " + "text-center"}>
              <Spinner />
            </Row>
          )}
          {!session && status !== "loading" && (
            <Row className={styles.mainRow + " " + "text-center"}>
              <h1>{t("must-be-logged-view")}</h1>
            </Row>
          )}
          {session && (
            <Row className={styles.mainRow}>
              <Col lg={4} className={styles.userCol}>
                <Row className={styles.user}>
                  <Col xs={4}>
                    <Image
                      src={props.trip.driver.image}
                      alt={props.trip.driver.name}
                      width={80}
                      height={80}
                      className={styles.userImage}
                    />
                  </Col>
                  <Col xs={8}>
                    <div className={styles.userInfo}>
                      <h3>{props.trip.driver.name}</h3>
                      <Rating
                        name="half-rating-read"
                        value={parseFloat(props.trip.driver.averageScore)}
                        readOnly
                        precision={0.5}
                        className={styles.stars}
                      />
                      <span className={styles.starsAverage}>
                        {"  "}
                        {props.trip.driver.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className={styles.userBio}>
                      <p>{props.trip.driver.bio}</p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Link href={`/profile/${props.trip.driver.username}`}>
                    <Button className={styles.profileButton}>{t("see-profile")}</Button>
                  </Link>
                </Row>
                <Row className={styles.vehicleRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/vehicle.webp"
                      alt="Vehicle Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.vehicleNameCol}>
                    <p>
                      {props.trip.vehicle.brand} {props.trip.vehicle.model}{" "}
                      {props.trip.vehicle.year}{" "}
                    </p>
                  </Col>
                </Row>
                <Row className={styles.vehicleRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/steering.webp"
                      alt="Trips Driven Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.vehicleNameCol}>
                    <p>
                      {props.trip.driver.finishedTripsDriven} {t("trips-driven")}{" "}
                    </p>
                  </Col>
                </Row>
                <Row className={styles.vehicleRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/passenger.webp"
                      alt="Trips As Passenger Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.vehicleNameCol}>
                    <p>
                      {props.trip.driver.finishedTrips} {t("trips-passenger")}{" "}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col lg={4} className={styles.tripCol}>
                <Row className={styles.destinationRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/placeholder.webp"
                      alt="Origin Location Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.tripOriginCol}>
                    <h3> {props.trip.origin} </h3>
                    <p> {props.trip.originMeetingPoint} </p>
                  </Col>
                </Row>
                <Row className={styles.arrowRow}>
                  <div>
                    <Image
                      src="/images/trips/downarrow.webp"
                      alt="Origin to Destination Arrow Icon"
                      width={45}
                      height={45}
                      className={styles.iconImage}
                    />
                  </div>
                </Row>
                <Row className={styles.destinationRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/placeholder1.webp"
                      alt="Destination Location Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.tripOriginCol}>
                    <h3> {props.trip.destination} </h3>
                    <p> {props.trip.destinationMeetingPoint} </p>
                  </Col>
                </Row>
                <Row className={styles.dateRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/schedule.webp"
                      alt="Date and Time Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.dateTextCol}>
                    <h3>
                      {locale === "en" &&
                        new Date(props.trip.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      {locale === "es" &&
                        new Date(props.trip.date)
                          .toLocaleDateString("es-ES", {
                            weekday: "long",
                          })
                          .charAt(0)
                          .toUpperCase() +
                          new Date(props.trip.date)
                            .toLocaleDateString("es-ES", {
                              weekday: "long",
                            })
                            .slice(1)
                            .toLowerCase()}{" "}
                      {new Date(props.trip.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      })}
                      {" - "}
                      {new Date(props.trip.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </h3>
                  </Col>
                </Row>
                <Row className={styles.slotsRow}>
                  <Col xs={2}>
                    <Image
                      src="/images/trips/sharing.webp"
                      alt="Slots Left Icon"
                      width={35}
                      height={35}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={10} className={styles.slotsTextCol}>
                    <h3>
                      {" "}
                      <span>{props.trip.freeSlots}</span>{" "}
                      {props.trip.freeSlots === 1
                        ? t("seat-left-out")
                        : t("seats-left-out")}{" "}
                      {props.trip.totalSlots}{" "}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className={styles.tripDesc}>{props.trip.description}</div>
                  </Col>
                </Row>
                {props.trip.notes !== "" && (
                  <Row>
                    <Col>
                      <div className={styles.paper}>
                        <div className={styles.pattern}>
                          <div className={styles.content}>{props.trip.notes}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
                <Row className={styles.buttonRow}>
                  {session &&
                    session.user.id === props.trip.driver.id &&
                    !props.trip.finished && (
                      <Button
                        className={styles.editButton}
                        onClick={() => handleEditShow()}
                      >
                        📝 {t("edit-trip")}
                      </Button>
                    )}
                  {session &&
                    session.user.id === props.trip.driver.id &&
                    !props.trip.finished && (
                      <Button
                        className={styles.leaveButton}
                        onClick={() => handleEndShow()}
                      >
                        ⛔ {t("end-trip")}
                      </Button>
                    )}
                  {session &&
                    session.user.id !== props.trip.driver.id &&
                    props.trip.freeSlots > 0 &&
                    !props.trip.passengers.find(
                      (passenger) => passenger.id === session.user.id
                    ) && (
                      <Button className={styles.joinButton} onClick={() => handleShow()}>
                        {t("join-trip")}
                      </Button>
                    )}
                  {session &&
                    session.user.id !== props.trip.driver.id &&
                    props.trip.passengers.find(
                      (passenger) => passenger.id === session.user.id
                    ) &&
                    !props.trip.finished && (
                      <Button
                        className={styles.leaveButton}
                        onClick={() => handleLeaveShow()}
                      >
                        {" "}
                        {t("leave-trip")}{" "}
                      </Button>
                    )}
                  {session &&
                    session.user.id !== props.trip.driver.id &&
                    props.trip.passengers.find(
                      (passenger) => passenger.id === session.user.id
                    ) &&
                    props.trip.finished &&
                    !props.isReviewed && (
                      <Button
                        className={styles.reviewButton}
                        onClick={() => handleReviewShow()}
                      >
                        {" "}
                        {t("review-driver")}{" "}
                      </Button>
                    )}
                </Row>
              </Col>
              <Col lg={4} className={styles.othersCol}>
                <Row className={styles.privacyRow}>
                  <Col xs={1}>
                    <Image
                      src="/images/trips/tripstatus.webp"
                      alt="Trip Status Icon"
                      width={30}
                      height={30}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={11} className={styles.privacyTextCol}>
                    <h3>
                      <span className="strong">
                        {props.trip.finished
                          ? t("finished")
                          : new Date(props.trip.date) > new Date()
                          ? t("upcoming")
                          : t("ongoing")}
                      </span>{" "}
                    </h3>
                  </Col>
                </Row>
                <Row className={styles.privacyRow}>
                  <Col xs={1}>
                    <Image
                      src={`/images/trips/${
                        props.trip.privacy === "public" ? "unlocked" : "privacy"
                      }.webp`}
                      alt="Privacy Icon"
                      width={30}
                      height={30}
                      className={styles.iconImage}
                    />
                  </Col>
                  <Col xs={11} className={styles.privacyTextCol}>
                    <h3>
                      {props.trip.privacy === "public" ? t("public") : t("private")}{" "}
                    </h3>
                  </Col>
                </Row>

                {session &&
                  props.trip.privacy === "private" &&
                  props.trip.driverId === session.user.id && (
                    <Row>
                      <Col>
                        <p>
                          <span className="strong"> {t("invite-code")}:</span>{" "}
                          {props.trip.inviteCode}
                        </p>
                      </Col>
                    </Row>
                  )}
                <Row className={styles.filtersRow}>
                  <Tooltip title={t("pets-allowed")}>
                    <Col xs={4}>
                      <Image
                        src="/images/trips/pets.webp"
                        alt="Pets Icon"
                        width={40}
                        height={40}
                        className={styles.iconImage}
                      />
                      <Image
                        src={`/images/trips/${
                          props.trip.pets ? "checked" : "notallowed1"
                        }.webp`}
                        alt="Pets Icon"
                        width={30}
                        height={30}
                        className={styles.allowedImage}
                      />
                    </Col>
                  </Tooltip>
                  <Tooltip title={t("smoking-allowed")}>
                    <Col xs={4}>
                      <Image
                        src="/images/trips/cigarette.webp"
                        alt="Smoking Icon"
                        width={40}
                        height={40}
                        className={styles.iconImage}
                      />
                      <Image
                        src={`/images/trips/${
                          props.trip.smoking ? "checked" : "notallowed1"
                        }.webp`}
                        alt="Smoking Allowed Icon"
                        width={30}
                        height={30}
                        className={styles.allowedImage}
                      />
                    </Col>
                  </Tooltip>
                  <Tooltip title={t("kids-allowed")}>
                    <Col xs={4}>
                      <Image
                        src="/images/trips/children.webp"
                        alt="Kids Icon"
                        width={40}
                        height={40}
                        className={styles.iconImage}
                      />
                      <Image
                        src={`/images/trips/${
                          props.trip.kids ? "checked" : "notallowed1"
                        }.webp`}
                        alt="Kids Allowed Icon"
                        width={30}
                        height={30}
                        className={styles.allowedImage}
                      />
                    </Col>
                  </Tooltip>
                </Row>
                <hr />
                <Row className={styles.privacyRow}>
                  <Tooltip title={t("estimated-travel-distance")}>
                    <Col xs={2}>
                      <Image
                        src="/images/trips/distance.webp"
                        alt="Distance Icon"
                        width={40}
                        height={40}
                        className={styles.iconImage}
                      />
                    </Col>
                  </Tooltip>
                  <Col xs={10} className={styles.distanceTextCol}>
                    <h3>
                      {Math.round(
                        parseFloat(props.trip.distance.split(" ")[0].replace(",", "")) *
                          0.621371
                      )}{" "}
                      {t("miles")} / {props.trip.distance.replace(",", "")}
                    </h3>
                  </Col>
                </Row>
                <Row className={styles.privacyRow}>
                  <Tooltip title={t("estimated-travel-time")}>
                    <Col xs={2}>
                      <Image
                        src="/images/trips/hourglass.webp"
                        alt="Estimated Travel Time Icon"
                        width={40}
                        height={40}
                        className={styles.iconImage}
                      />
                    </Col>
                  </Tooltip>
                  <Col xs={10} className={styles.distanceTextCol}>
                    <h3>{props.trip.duration}</h3>
                  </Col>
                </Row>
                <Row className={styles.filtersRow}>
                  <Tooltip title={t("gas")}>
                    <Col xs={4} className={styles.costsCol}>
                      <Image
                        src="/images/trips/gas-station.webp"
                        alt="Gas Cost Icon"
                        width={40}
                        height={40}
                        className={styles.costImage}
                      />
                      ${props.trip.gasCost}
                    </Col>
                  </Tooltip>
                  <Tooltip title={t("tolls")}>
                    <Col xs={4} className={styles.costsCol}>
                      <Image
                        src="/images/trips/toll.webp"
                        alt="Tolls Cost Icon"
                        width={40}
                        height={40}
                        className={styles.costImage}
                      />
                      ${props.trip.tollsCost}
                    </Col>
                  </Tooltip>
                  <Tooltip title={t("other-costs")}>
                    <Col xs={4} className={styles.costsCol}>
                      <Image
                        src="/images/trips/extra.webp"
                        alt="Others Costs Icon"
                        width={40}
                        height={40}
                        className={styles.costImage}
                      />
                      ${props.trip.othersCost}
                    </Col>
                  </Tooltip>
                </Row>
                {session &&
                  session.user.id === props.trip.driver.id &&
                  !props.trip.finished && (
                    <>
                      <hr />
                      <Row className={styles.buttonRow}>
                        <Button
                          className={styles.leaveButton}
                          onClick={() => handleDeleteShow()}
                        >
                          🗑️ {t("delete-trip")}
                        </Button>
                      </Row>
                    </>
                  )}
              </Col>
            </Row>
          )}

          {session &&
            (session.user.id === props.trip.driver.id ||
              props.trip.passengers.find(
                (passenger) => passenger.id === session.user.id
              )) && (
              <>
                <Row className={styles.passengersRow}>
                  <Col className={styles.passengersTitleCol}>
                    <h3>{t("trips-passengers")}</h3>
                  </Col>
                </Row>
                <Row className={styles.passengersCardsRow}>
                  <PassengerCard
                    passenger={props.trip.driver}
                    trip={props.trip}
                    session={session}
                    isDriver={true}
                  />
                  {props.trip.passengers.map((passenger) => (
                    <PassengerCard
                      key={passenger.id}
                      passenger={passenger}
                      trip={props.trip}
                      session={session}
                      isDriver={false}
                      handleRemove={() => handleRemoveShow(passenger)}
                    />
                  ))}
                </Row>
              </>
            )}
        </Container>
      </div>

      <TripJoinModal
        show={show}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        userId={session ? session.user.id : null}
        refresh={refreshData}
      />

      <TripRemoveUserModal
        show={showRemove}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        passenger={passenger}
        refresh={refreshData}
      />

      <TripLeaveModal
        show={showLeave}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        tripStatus={props.trip.finished}
        userId={session ? session.user.id : null}
        refresh={refreshData}
      />

      <TripEndModal
        show={showEnd}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        userId={session ? session.user.id : null}
        refresh={refreshData}
      />

      <TripReviewModal
        show={showReview}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        reviewerId={session ? session.user.id : null}
        driver={props.trip.driver}
        refresh={refreshData}
      />

      <TripEditModal
        show={showEdit}
        handleClose={handleClose}
        handleNotification={handleNotification}
        trip={props.trip}
        vehicles={props.trip.driver.vehicles}
        refresh={refreshData}
      />

      <TripDeleteModal
        show={showDelete}
        handleClose={handleClose}
        handleNotification={handleNotification}
        tripId={props.trip.id}
        userId={session ? session.user.id : null}
        username={session ? session.user.username : null}
        finished={props.trip.finished}
        refresh={refreshData}
      />
    </>
  );
}

export async function getServerSideProps({ query, req, locale }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/api/auth/signin" },
    };
  }

  if (session && (!session.user.username || session.user.username === "")) {
    return {
      redirect: { destination: "/finishregistration" },
    };
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id: query.id,
    },
    include: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          seats: true,
        },
      },
      driver: {
        select: {
          id: true,
          averageScore: true,
          finishedTrips: true,
          finishedTripsDriven: true,
          username: true,
          bio: true,
          name: true,
          image: true,
          phone: true,
          vehicles: true,
        },
      },
      passengers: {
        select: {
          id: true,
          name: true,
          bio: true,
          phone: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!trip) {
    return {
      notFound: true,
    };
  }

  let review = null;

  if (session) {
    review = await prisma.review.findFirst({
      where: {
        tripId: query.id,
        reviewerId: session.user.id,
      },
    });
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      trip: JSON.parse(JSON.stringify(trip)),
      isReviewed: review ? true : false,
    },
  };
}
