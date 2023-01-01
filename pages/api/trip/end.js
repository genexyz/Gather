// Next
import { getSession } from "next-auth/react";

// Prisma
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const trip = await prisma.trip.findUnique({
    where: {
      id: req.body.tripId,
    },
    include: {
      passengers: {
        select: {
          id: true,
        },
      },
    },
  });

  if (trip.driverId !== session.user.id) {
    return res.status(400).send("You are not the driver of this trip!");
  }

  if (trip.finished) {
    return res.status(400).send("This trip is already finished!");
  }

  const passengersIds = trip.passengers.map((passenger) => passenger.id);

  if (req.method === "PUT") {
    const driver = prisma.user.update({
      where: { id: trip.driverId },
      data: {
        finishedTripsDriven: {
          increment: 1,
        },
      },
    });

    const passengers = prisma.user.updateMany({
      where: {
        id: {
          in: passengersIds,
        },
      },
      data: {
        finishedTrips: {
          increment: 1,
        },
      },
    });

    const tripUpdate = prisma.trip.update({
      where: { id: req.body.tripId },
      data: {
        finished: true,
      },
    });

    const result = await prisma.$transaction([driver, passengers, tripUpdate]);

    console.log(result);
    res.json(result);
  }
}
