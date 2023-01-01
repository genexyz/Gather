import { useSession, getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styles from "./trips.module.css";
import Head from "next/head";
import prisma from "../../../lib/prisma";
import TripsList from "../../../components/TripsList";
import { Container, Row } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import Spinner from "../../../components/Spinner";

export default function Profile(props) {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();

  const pastTrips = props.trips.filter((trip) => {
    const today = new Date();
    const tripDate = new Date(trip.date);
    return tripDate < today;
  });

  const upcomingTrips = props.trips.filter((trip) => {
    const today = new Date();
    const tripDate = new Date(trip.date);
    return tripDate >= today;
  });

  return (
    <>
      <Head>
        <title>{`Gather - ${props.username} Trips`}</title>
      </Head>
      <div className={styles.section}>
        {status === "loading" && (
          <Container className={styles.container}>
            <Row className="text-center">
              <Spinner />
            </Row>
          </Container>
        )}
        {session && (
          <>
            <TripsList
              className={styles.tripsList}
              trips={upcomingTrips}
              title={t("my-upcoming-trips")}
              session={session}
            />
            <TripsList
              className={styles.tripsList}
              trips={pastTrips}
              title={t("my-past-trips")}
              session={session}
            />
          </>
        )}
      </div>
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

  const tripsDriven = await prisma.trip.findMany({
    where: {
      driverId: session.user.id,
    },
    select: {
      id: true,
      freeSlots: true,
      origin: true,
      destination: true,
      date: true,
      finished: true,
      driver: {
        select: {
          image: true,
          averageScore: true,
          name: true,
        },
      },
    },
  });

  const tripsRidden = await prisma.trip.findMany({
    where: {
      passengers: {
        some: {
          id: session.user.id,
        },
      },
    },
    select: {
      id: true,
      freeSlots: true,
      origin: true,
      destination: true,
      date: true,
      finished: true,
      driver: {
        select: {
          image: true,
          averageScore: true,
          name: true,
        },
      },
    },
  });

  const trips = [...tripsDriven, ...tripsRidden];

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      trips: JSON.parse(JSON.stringify(trips)),
      username,
    },
  };
}
