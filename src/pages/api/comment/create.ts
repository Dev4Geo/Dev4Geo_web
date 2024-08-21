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

  const newComment = await Comment.create({
    request_id,
    user_id: session.user.oid.toString(),
    user_name: is_show_name ?? true ? session.user.name : undefined,
    text,
  });

  const hardUpdateNComments = async () => {
    const nComments = await Comment.find({ request_id: request_id }).countDocuments();
    const res = await Request.updateOne(
      //
      { _id: request_id },
      { n_comments: nComments }
    );
  };
  hardUpdateNComments();

  const comment = {
    request_id: newComment.request_id,
    user_id: newComment.user_id,
    user_name: newComment.user_name,
    text: newComment.text,
    created_at: newComment.created_at,
    updated_at: newComment.updated_at,
  };

  return res.status(201).json({ status: "ok", data: comment });
}
