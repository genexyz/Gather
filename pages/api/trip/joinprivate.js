// Next
import { getSession } from "next-auth/react";

// Prisma
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  let { inviteCode } = req.body;

  const newErrors = {};

  if (!inviteCode || inviteCode === "") newErrors.inviteCode = "Cannot be blank!";

  if (Object.keys(newErrors).length > 0) {
    return res.status(400).send(newErrors);
  }

  if (req.method === "POST") {
    const trip = await prisma.trip.findUnique({
      where: {
        inviteCode: req.body.inviteCode,
      },
    });

    if (!trip) {
      return res.status(400).send({ inviteCode: "Trip not found!" });
    }

    console.log(trip.id);
    res.json(trip.id);
  }
}
