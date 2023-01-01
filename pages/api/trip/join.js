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
  });

  if (trip.driverId === session.user.id) {
    return res.status(400).send("You are the driver of this trip!");
  }

  if (trip.freeSlots === 0 || trip.freeSlots < 0) {
    return res.status(400).send("No free slots left!");
  }

  if (trip.finished) {
    return res.status(400).send("Trip is already finished!");
  }

  if (req.method === "PUT") {
    const result = await prisma.trip.update({
      where: { id: req.body.tripId },
      data: {
        passengers: {
          connect: { id: req.body.userId },
        },
        freeSlots: trip.freeSlots - 1,
      },
    });
    console.log(result);
    res.json(result);
  }
}
