// Next
import { getSession } from "next-auth/react";

// Prisma
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method === "DELETE") {
    if (!req.body.id || req.body.id === "") {
      return res.status(400).send("Wrong Payload");
    }

    if (req.body.userId !== session.user.id) {
      return res.status(401).send("Unauthorized");
    }

    const result = await prisma.vehicle.delete({
      where: { id: req.body.id },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    if (req.body.userId !== session.user.id) {
      return res.status(401).send("Unauthorized");
    }

    let { type, licensePlate, brand, model, year, color, seats, userId } = req.body;

    seats = parseInt(seats);

    const newErrors = {};
    if (!type || type === "") newErrors.type = "Cannot be blank!";
    if (!["Car", "Motorbike", "Bus", "Van", "Truck", "Other"].includes(type))
      newErrors.type =
        "Cannot be a value different than Car, Motorbike, Bus, Van, Truck or Other!";
    if (!seats) newErrors.seats = "Cannot be blank & should be a number!";
    if (seats < 0) newErrors.seats = "Cannot be negative!";
    if (seats === 0) newErrors.seats = "Cannot be 0!";
    if (seats > 100) newErrors.seats = "Cannot be more than 100!";
    if (!licensePlate || licensePlate === "") newErrors.licensePlate = "Cannot be blank!";
    if (!brand || brand === "") newErrors.brand = "Cannot be blank!";
    if (!model || model === "") newErrors.model = "Cannot be blank!";
    if (!year || year === "") newErrors.year = "Cannot be blank!";
    if (!color || color === "") newErrors.color = "Cannot be blank!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (req.method === "POST") {
      const result = await prisma.vehicle.create({
        data: {
          type,
          licensePlate,
          brand,
          model,
          year,
          color,
          seats,
          owner: {
            connect: { id: userId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      const result = await prisma.vehicle.update({
        where: { id: req.body.id },
        data: {
          type,
          licensePlate,
          brand,
          model,
          year,
          color,
          seats,
          owner: {
            connect: { id: userId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
