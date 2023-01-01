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

  if (!trip.finished) {
    return res.status(400).send("Trip is not finished!");
  }

  const review = await prisma.review.findFirst({
    where: {
      AND: [
        {
          tripId: req.body.tripId,
        },
        {
          reviewerId: req.body.reviewerId,
        },
      ],
    },
  });
  if (review) {
    return res.status(400).send("You already reviewed this trip!");
  }

  const userReviews = await prisma.review.findMany({
    where: {
      userId: req.body.userId,
    },
  });

  let newAverageRating = parseFloat(
    (userReviews.reduce((acum, review) => acum + review.rating, 0) + req.body.rating) /
      (userReviews.length + 1).toFixed(2)
  );

  if (req.method === "POST") {
    let { tripId, reviewerId, userId, title, description, rating } = req.body;

    rating = parseInt(rating);

    const newErrors = {};

    if (!rating || rating === 0) newErrors.rating = "Cannot be 0!";
    if (!title || title === "") newErrors.title = "Cannot be blank!";
    if (!description || description === "") newErrors.description = "Cannot be blank!";
    if (!tripId || tripId === "") newErrors.tripId = "Cannot be blank!";
    if (!reviewerId || reviewerId === "") newErrors.reviewerId = "Cannot be blank!";
    if (!userId || userId === "") newErrors.userId = "Cannot be blank!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }

    const newUserAverageRating = prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        averageScore: newAverageRating,
      },
    });

    const newReview = prisma.review.create({
      data: {
        title,
        comment: description,
        rating,
        trip: {
          connect: { id: tripId },
        },
        reviewer: {
          connect: { id: reviewerId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    const result = await prisma.$transaction([newUserAverageRating, newReview]);

    console.log(result);
    res.json(result);
  }
}
