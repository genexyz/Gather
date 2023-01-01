// Next
import { getSession } from "next-auth/react";

// Prisma
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  if (req.body.id !== session.user.id) {
    return res.status(401).send("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (user && user.id !== session.user.id) {
    return res.status(400).send({ username: "Username already taken" });
  }

  if (req.method === "PUT") {
    let { name, username, phone, nationalId, image, bio } = req.body;

    if (!image || image === "") {
      image = "https://cdn-icons-png.flaticon.com/512/1177/1177568.png";
    }

    if (!nationalId || nationalId === "") {
      nationalId = "0000000000000";
    }

    username = username.toLowerCase();
    const newErrors = {};
    if (!name || name === "") newErrors.name = "Cannot be blank!";
    if (!username || username === "") newErrors.username = "Cannot be blank!";
    if (username.length < 5) newErrors.username = "Username is too short!";
    if (username.length > 25) newErrors.username = "Username is too long!";
    if (!phone || phone === "") newErrors.phone = "Cannot be blank!";
    if (!bio || bio === "") newErrors.bio = "Cannot be blank!";
    if (bio.length > 400) newErrors.bio = "Bio is too long!";

    if (Object.keys(newErrors).length > 0) {
      return res.status(400).send(newErrors);
    }
    const result = await prisma.user.update({
      where: { id: req.body.id },
      data: {
        name,
        username,
        nationalId,
        phone,
        bio,
        image,
      },
    });
    console.log(result);
    res.json(result);
  }
}
