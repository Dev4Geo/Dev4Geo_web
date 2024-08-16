import { dbConnect } from "@/lib/mongo";
import Request from "@/models/request";
import User from "@/models/User";
import { isJSONRequest } from "@/utils/apiUtils";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function createRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  if (isJSONRequest(req)) {
    return res
      .status(400)
      .json({ message: "Content-Type must be application/json" });
  }
  const isDevMode = process.env.NODE_ENV === "development";

  const { title, desc } = req.body;

  let session = await getAuth(req, res);

  if (isDevMode && !session?.user?.oid) {
    session = {
      user: {
        oid: new mongoose.Types.ObjectId(),
      },
      expires: "123",
    };
  }

  if (!session?.user?.oid) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  await dbConnect();

  const user = await User.findById(session.user.oid);
  if (!isDevMode && !user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  const newRequest = await Request.create({
    title,
    desc,
    user_id: session.user.oid.toString(),
  });

  const output = {
    title: newRequest.title,
    desc: newRequest.desc,
    created_at: newRequest.created_at,
    user_id: newRequest.user_id,
  };

  return res.status(201).json({ status: "ok", data: output });
}
