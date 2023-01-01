// Next
import Head from "next/head";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import NewTripPage from "../components/NewTripPage";
import prisma from "../lib/prisma";

export default function NewTrip(props) {
  return (
    <>
      <Head>
        <title>Gather - Create a Trip</title>
        <meta name="description" content="Gather - Create a Trip" />
      </Head>
      <NewTripPage vehicles={props.vehicles} />
    </>
  );
}

export async function getServerSideProps({ req, locale }) {
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

  if (session) {
    let vehicles = await prisma.vehicle.findMany({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        seats: true,
      },
    });

    if (vehicles.length === 0) {
      return {
        redirect: { destination: `/profile/${session.user.username}/vehicles` },
      };
    }

    return {
      props: { ...(await serverSideTranslations(locale, ["common"])), vehicles },
    };
  }
}
