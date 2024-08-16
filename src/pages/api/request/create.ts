import { dbConnect } from "@/lib/mongo";
import Request from "@/models/request";
import User from "@/models/User";
import { isJSONRequest } from "@/utils/apiUtils";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

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
  let session = await getSession({ req });

  if (isDevMode && !session?.user?.id) {
    session = {
      user: {
        id: new mongoose.Types.ObjectId(),
      },
      expires: "123",
    };
  }

  if (!session?.user?.id) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  await dbConnect();

  const user = await User.findById(session.user.id);
  if (!isDevMode && !user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  const newRequest = await Request.create(
    {
      title,
      desc,
      user_id: session.user.id,
    },
  );

  const output = {
    title: newRequest.title,
    desc: newRequest.desc,
    created_at: newRequest.created_at,
    user_id: newRequest.user_id,
  }

  return res.status(201).json({ status: "ok", data: output });
}
