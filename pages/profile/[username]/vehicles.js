import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import { NotificationManager } from "react-notifications";
import styles from "./vehicles.module.css";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import prisma from "../../../lib/prisma";
import VehicleModal from "../../../components/modals/VehicleModal";
import VehicleDeleteModal from "../../../components/modals/VehicleDeleteModal";
import { useTranslation } from "next-i18next";
import Spinner from "../../../components/Spinner";

export default function Profile(props) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [modalVehicle, setModalVehicle] = useState(null);
  const [modalType, setModalType] = useState("add");

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  const handleClose = () => {
    setShow(false);
    setDeleteShow(false);
    setModalVehicle(null);
  };

  const handleShow = (type, p) => {
    if (p) setModalVehicle(p);
    setModalType(type);
    setShow(true);
  };
  const handleDeleteShow = (p) => {
    if (p) setModalVehicle(p);
    setDeleteShow(true);
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
        <title>{`Gather - ${props.username} Vehicles`}</title>
      </Head>
      <div className={styles.section}>
        <Container className={styles.container}>
          {status === "loading" && (
            <Row className="text-center">
              <Spinner />
            </Row>
          )}
          {session && (
            <>
              <Row className={styles.titleRow}>
                <Col>
                  <h1 className={styles.titleH1}>{t("my-vehicles")}</h1>
                </Col>
                <Col className={styles.addAdminCol}>
                  <Button
                    className={styles.addAdminBtn}
                    onClick={() => handleShow("add", null)}
                  >
                    {t("add-vehicle")}
                  </Button>
                </Col>
              </Row>
              <Row className={styles.vehicleRow}>
                {props.vehicles.length > 0 ? (
                  props.vehicles.map((vehicle) => (
                    <Col md={6} lg={4} key={vehicle.id}>
                      <Card className={styles.vehicleCard}>
                        <Card.Body className={styles.vehicleBody}>
                          <Card.Title className={styles.vehicleTitle}>
                            {vehicle.brand} {vehicle.model} {vehicle.year}
                          </Card.Title>
                          <Card.Text as="div" className={styles.vehicleText}>
                            <p>
                              <span>{t("type")}: </span> {t(vehicle.type.toLowerCase())}
                            </p>
                            <p>
                              <span>{t("license-plate")}: </span> {vehicle.licensePlate}
                            </p>
                            <p>
                              <span>{t("color")}: </span> {vehicle.color}
                            </p>
                            <p>
                              <span>{t("seats")}: </span> {vehicle.seats}
                            </p>
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.vehicleFooter}>
                          <Button
                            variant="success"
                            className={styles.vehicleEditBtn}
                            onClick={() => handleShow("edit", vehicle)}
                          >
                            📝 {t("edit")}
                          </Button>
                          <Button
                            variant="danger"
                            className={styles.vehicleDeleteBtn}
                            onClick={() => handleDeleteShow(vehicle)}
                          >
                            🗑️ {t("delete")}
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <h1 className={styles.titleH1}>{t("not-have-vehicles")}</h1>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Container>
      </div>

      <VehicleModal
        show={show}
        handleClose={handleClose}
        type={modalType}
        vehicle={modalVehicle}
        handleNotification={handleNotification}
        refresh={refreshData}
        session={session}
      />

      <VehicleDeleteModal
        show={deleteShow}
        handleClose={handleClose}
        vehicle={modalVehicle}
        handleNotification={handleNotification}
        refresh={refreshData}
        session={session}
      />
    </>
  );
}

export async function getServerSideProps({ query, req, res, locale }) {
  const session = await getSession({ req });
  let username = query.username.toLowerCase();

  if (!session) {
    res.statusCode = 403;
    return {
      redirect: { destination: "/" },
    };
  }

  if (session && (!session.user.username || session.user.username === "")) {
    return {
      redirect: { destination: "/finishregistration" },
    };
  }

  if (session.user.username !== username) {
    res.statusCode = 403;
    return {
      redirect: { destination: "/" },
    };
  }

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerId: session.user.id,
    },
  });
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])), vehicles, username },
  };
}
