import { dbConnect } from "@/lib/mongo";
import Request from "@/models/request";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";
import Comment from "@/models/comment";

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";

  const { request_id, text, is_show_name } = req.body;

  if (!request_id || !text) {
    return res
      .status(400)
      .json({ status: "error", message: "request_id and text are required" });
  }

  let session = await getAuth(req, res);

  if (debug && !session?.user?.oid) {
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

  const request = await Request.findById({ _id: request_id });
  if (!request) {
    return res
      .status(400)
      .json({ status: "error", message: "Request not found" });
  }

  const newRequest = await Comment.create({
    request_id,
    user_id: session.user.oid.toString(),
    user_name: is_show_name ?? true ? session.user.name : undefined,
    text,
  });

  const output = {
    request_id: newRequest.request_id,
    user_id: newRequest.user_id,
    user_name: newRequest.user_name,
    text: newRequest.text,
    created_at: newRequest.created_at,
    updated_at: newRequest.updated_at,
  };

  return res.status(201).json({ status: "ok", data: output });
}
