import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./profile.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { NotificationManager } from "react-notifications";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Rating } from "@mui/material";
import prisma from "../../../lib/prisma";
import UserModal from "../../../components/modals/UserModal";
import { useTranslation } from "next-i18next";
import Spinner from "../../../components/Spinner";

export default function Profile(props) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const [sortOrder, setSortOrder] = useState("desc");
  const [show, setShow] = useState(false);
  const [modalUser, setModalUser] = useState(null);

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleClose = () => {
    setShow(false);
    setModalUser(null);
  };

  const handleShow = (u) => {
    if (u) setModalUser(u);
    setShow(true);
  };

  const sortReviews = (reviews, order) => {
    if (order === "asc") {
      return reviews.sort((a, b) => a.rating - b.rating);
    }
    if (order === "desc") {
      return reviews.sort((a, b) => b.rating - a.rating);
    }
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
        <title>{`Gather - ${props.user.username} Profile`}</title>
      </Head>
      <div className={styles.section}>
        <Container className={styles.container}>
          {status === "loading" && (
            <Row className="text-center">
              <Spinner />
            </Row>
          )}
          {!session && status !== "loading" && (
            <div className={`justify-content-md-center text-center`}>
              <Link href="/api/auth/signin" passHref>
                <Button variant="primary" className={styles.loginBtn}>
                  {t("access-not-allowed")}
                </Button>
              </Link>
            </div>
          )}
          {session && (
            <>
              <Row className={styles.mainRow}>
                <Col md={6}>
                  <Image
                    src={props.user.image}
                    alt={`Profile Image of ${props.user.username}`}
                    quality={75}
                    width={300}
                    height={300}
                    className={styles.profileImage}
                  />
                </Col>
                <Col md={6} className={styles.userData}>
                  <div className={styles.nameContainer}>
                    <h1 className={styles.name}>{props.user.name}</h1>
                    {session.user.username === props.user.username && (
                      <Button
                        variant="success"
                        className={styles.userEditBtn}
                        onClick={() => handleShow(props.user)}
                      >
                        <Image
                          src="/images/assets/settings.webp"
                          alt="Edit Profile"
                          width={25}
                          height={25}
                        />
                      </Button>
                    )}
                  </div>
                  <p>{props.user.bio}</p>
                  <div className={styles.averageRating}>
                    <h3>{t("average-rating-driver")}</h3>
                    <span className={styles.starsAverage}>
                      {props.user.averageScore.toFixed(2)}
                      {"  "}
                    </span>
                    <Rating
                      name="half-rating-read"
                      value={parseFloat(props.user.averageScore)}
                      readOnly
                      precision={0.5}
                      size="large"
                      className={styles.stars}
                    />
                  </div>
                  <Row>
                    <Col sm={6} className={styles.driverTrips}>
                      <div>{t("driver-trips")}</div>
                      <Image
                        src={"/images/profile/steering-wheel.webp"}
                        alt={`Trips as Driver`}
                        className="m-2"
                        quality={75}
                        width={75}
                        height={75}
                      />
                      <div>{props.user.finishedTripsDriven}</div>
                    </Col>
                    <Col sm={6} className={styles.passengerTrips}>
                      <div>{t("passenger-trips")}</div>
                      <Image
                        src={"/images/profile/passenger.webp"}
                        alt={`Trips as Passenger`}
                        className="m-2"
                        quality={75}
                        width={75}
                        height={75}
                      />
                      <div>{props.user.finishedTrips}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className={styles.reviewsTitleRow}>
                <Col md={6}>
                  <h1>{t("passengers-reviews")}</h1>
                </Col>
                <Col md={6}>
                  <Button
                    variant="secondary"
                    className={styles.sortBtn}
                    onClick={() => {
                      if (sortOrder === "asc") {
                        setSortOrder("desc");
                      } else {
                        setSortOrder("asc");
                      }
                    }}
                  >
                    {sortOrder === "asc" ? (
                      <>
                        {t("lower-ratings-first")}
                        <Image
                          src="/images/profile/sort-down.webp"
                          alt="Sort Reviews by Ascending Order"
                          width={25}
                          height={25}
                          className={styles.sortDown}
                        />
                      </>
                    ) : (
                      <>
                        {t("higher-ratings-first")}
                        <Image
                          src="/images/profile/sort-down.webp"
                          alt="Sort Reviews by Descending Order"
                          width={25}
                          height={25}
                          className={styles.sortUp}
                        />
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
              <Row>
                {props.user.reviews.length === 0 && (
                  <Col className="d-flex justify-content-center">
                    <h3 className={styles.noReviews}>{t("no-reviews")}</h3>
                  </Col>
                )}
                {sortReviews(props.user.reviews, sortOrder).map((review) => {
                  return (
                    <Col
                      key={review.id}
                      md={6}
                      xl={4}
                      className="d-flex justify-content-center"
                    >
                      <Card style={{ width: "20rem" }} className={styles.reviewCard}>
                        <Card.Body>
                          <Card.Header className={styles.reviewCardHeader}>
                            <Rating
                              name="read-only"
                              value={parseInt(review.rating)}
                              readOnly
                              size="large"
                            />
                          </Card.Header>
                          <Card.Title className={styles.reviewCardTitle}>
                            {review.title}
                          </Card.Title>
                          <Card.Text className={styles.reviewCardHText}>
                            {review.comment}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}
        </Container>
      </div>

      <UserModal
        show={show}
        handleClose={handleClose}
        user={modalUser}
        session={session}
        title="Edit Profile"
        handleNotification={handleNotification}
        refresh={refreshData}
      />
    </>
  );
}

export async function getServerSideProps({ req, query, locale }) {
  const session = await getSession({ req });
  if (session && (!session.user.username || session.user.username === "")) {
    return {
      redirect: { destination: "/finishregistration" },
    };
  }

  let username = query.username.toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      reviews: {
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
        },
      },
    },
  });
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      user: JSON.parse(JSON.stringify(user)),
    },
  };
}
