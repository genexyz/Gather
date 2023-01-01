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
    if (!req.body.tripId || req.body.tripId === "") {
      return res.status(400).send("Wrong Payload");
    }

    if (req.body.userId !== session.user.id) {
      return res.status(401).send("Unauthorized");
    }

    if (req.body.finished) {
      return res.status(400).send("Trip already finished - Cant delete finished trips");
    }

    const result = await prisma.trip.delete({
      where: { id: req.body.tripId },
    });
    console.log(result);
    res.json(result);
  }

  if (req.method === "POST" || req.method === "PUT") {
    if (req.body.driverId !== session.user.id) {
      return res.status(401).send("Unauthorized");
    }

    let {
      origin,
      originMeetingPoint,
      destination,
      destinationMeetingPoint,
      date,
      totalSlots,
      freeSlots,
      description,
      notes,
      distance,
      duration,
      smoking,
      pets,
      kids,
      gasCost,
      tollsCost,
      othersCost,
      privacy,
      vehicleId,
      driverId,
      vehicleSeats,
      originId,
      destinationId,
    } = req.body;
    const newErrors = {};

    totalSlots = parseInt(totalSlots);
    freeSlots = parseInt(freeSlots);
    gasCost = parseFloat(gasCost);
    tollsCost = parseFloat(tollsCost);
    othersCost = parseFloat(othersCost);
    let dateSelected = new Date(date);
    let dateToday = new Date();
    date = dateSelected.toISOString();

    if (!origin || origin === "") newErrors.origin = "Cannot be blank!";
    if (!originMeetingPoint || originMeetingPoint === "")
      newErrors.originMeetingPoint = "Cannot be blank!";
    if (!destination || destination === "") newErrors.destination = "Cannot be blank!";
    if (!destinationMeetingPoint || destinationMeetingPoint === "")
      newErrors.destinationMeetingPoint = "Cannot be blank!";
    if (!date || date === "") newErrors.date = "Cannot be blank!";
    if (dateSelected < dateToday) newErrors.date = "Date must be in the future!";
    if (!totalSlots || totalSlots === "") newErrors.totalSlots = "Cannot be Blank!";
    if (totalSlots === 0) newErrors.totalSlots = "Cannot be 0!";
    if (totalSlots < 0) newErrors.totalSlots = "Cannot be negative!";
    if (totalSlots > vehicleSeats - 1)
      newErrors.totalSlots = "Cannot be greater than vehicle available seats!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (description.length > 250)
      newErrors.description = "Cannot be longer than 250 characters!";
    if (!notes) notes = "";
    if (notes.length > 250) newErrors.notes = "Cannot be longer than 250 characters!";
    if (!distance) distance = "";
    if (!duration) duration = "";
    if (smoking === null) newErrors.smoking = "Cannot be null!";
    if (pets === null) newErrors.pets = "Cannot be null!";
    if (kids === null) newErrors.kids = "Cannot be null!";
    if ((!gasCost || gasCost === "") && gasCost !== 0)
      newErrors.gasCost = "Cannot be blank!";
    if (gasCost < 0) newErrors.gasCost = "Cannot be negative!";
    if ((!tollsCost || tollsCost === "") && tollsCost !== 0)
      newErrors.gasCost = "Cannot be blank!";
    if (tollsCost < 0) newErrors.gasCost = "Cannot be negative!";
    if ((!othersCost || othersCost === "") && othersCost !== 0)
      newErrors.othersCost = "Cannot be blank!";
    if (othersCost < 0) newErrors.othersCost = "Cannot be negative!";
    if (!privacy || (privacy !== "private" && privacy !== "public"))
      newErrors.privacy = "Cannot be a value different than private or public!";
    if (!driverId || driverId === "") newErrors.driverId = "Cannot be blank!";
    if (!vehicleId || vehicleId === "") newErrors.vehicleId = "Cannot be blank!";
    if (!originId || originId === "")
      newErrors.origin = "An origin from the google dropdown must be selected!";
    if (!destinationId || destinationId === "")
      newErrors.destination = "A destination from the google dropdown must be selected!";

    if (originId && originId !== "" && destinationId && destinationId !== "") {
      const URL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:${originId}&destinations=place_id:${destinationId}&key=${process.env.GOOGLE_MAPS_MATRIX_API_KEY}`;

      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.rows[0].elements[0].status === "ZERO_RESULTS") {
        distance = "No route available";
        duration = "No route available";
      } else {
        distance = data.rows[0].elements[0].distance.text;
        duration = data.rows[0].elements[0].duration.text;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    if (req.method === "POST") {
      const result = await prisma.trip.create({
        data: {
          origin,
          originId,
          originMeetingPoint,
          destination,
          destinationId,
          destinationMeetingPoint,
          date,
          totalSlots,
          freeSlots,
          description,
          notes,
          distance,
          duration,
          smoking,
          pets,
          kids,
          gasCost,
          tollsCost,
          othersCost,
          privacy,
          vehicle: {
            connect: { id: vehicleId },
          },
          driver: {
            connect: { id: driverId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
    if (req.method === "PUT") {
      const result = await prisma.trip.update({
        where: { id: req.body.tripId },
        data: {
          origin,
          originId,
          originMeetingPoint,
          destination,
          destinationId,
          destinationMeetingPoint,
          date,
          totalSlots,
          freeSlots,
          description,
          notes,
          distance,
          duration,
          smoking,
          pets,
          kids,
          gasCost,
          tollsCost,
          othersCost,
          privacy,
          vehicle: {
            connect: { id: vehicleId },
          },
          driver: {
            connect: { id: driverId },
          },
        },
      });
      console.log(result);
      res.json(result);
    }
  }
}
