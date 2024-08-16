import { NextApiRequest, NextApiResponse } from "next";
import User from "@/models/User";
import { dbConnect } from "@/lib/mongo";

export default async function getAllUsers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  // insert one user dummy
  const user = new User({
    name: "John Doe",
    email: "eee@gmail.com",
    image: "https://via.placeholder.com/150",
    providerId: "12345",
    provider: "google",
  });
  // insert

//   await user.save();
//   return res.status(200).json({ status: "ok user", data: user });

  try {
    const users = await User.find({});
    res.status(200).json({ status: "ok", data: users });
  } catch (error) {
    res.status(400).json({ status: "error", message: `${error}` });
  }
}
