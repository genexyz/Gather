// Next
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";

// Components
import TripsPage from "../components/TripsPage";
import prisma from "../lib/prisma";

export default function Trips(props) {
  return (
    <>
      <Head>
        <title>Gather - Trips</title>
        <meta name="description" content="Gather - Available Trips" />
      </Head>
      <TripsPage trips={props.trips} />
    </>
  );
}

export async function getServerSideProps({ req, res, locale }) {
  const session = await getSession({ req });
  if (session && (!session.user.username || session.user.username === "")) {
    return {
      redirect: { destination: "/finishregistration" },
    };
  }

  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  const trips = await prisma.trip.findMany({
    where: {
      privacy: "public",
    },
    select: {
      id: true,
      freeSlots: true,
      origin: true,
      destination: true,
      date: true,
      finished: true,
      kids: true,
      pets: true,
      smoking: true,
      driver: {
        select: {
          image: true,
          averageScore: true,
          name: true,
        },
      },
    },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      trips: JSON.parse(JSON.stringify(trips)),
    },
  };
}
