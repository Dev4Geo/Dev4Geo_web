
import { dbConnect } from "@/lib/mongo";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";
import Comment from "@/models/comment";

export default async function updateComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";

  const { comment_id, text } = req.body;
  if (!comment_id || !text) {
    return res
      .status(400)
      .json({ status: "error", message: "comment_id and text are required" });
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

  const comment = await Comment.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId.createFromHexString(comment_id),
      user_id: session.user.oid.toString(),
    },
    { text, updated_at: new Date() },
    { new: true }
  );

  if (!comment) {
    return res
      .status(400)
      .json({ status: "error", message: "Comment not found" });
  }

  return res.status(200).json({ status: "ok", data: comment });
}