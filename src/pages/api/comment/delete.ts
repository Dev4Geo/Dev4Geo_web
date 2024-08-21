import { dbConnect } from "@/lib/mongo";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";
import Comment from "@/models/comment";
import Request from "@/models/request";

export default async function deleteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";

  const { comment_id } = req.body;

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

  const comment = await Comment.findOneAndDelete({
    _id: mongoose.Types.ObjectId.createFromHexString(comment_id),
    user_id: session.user.oid.toString(),
  });

  if (!comment) {
    return res
      .status(400)
      .json({ status: "error", message: "Comment not found" });
  }

  await Request.updateOne(
    { _id: mongoose.Types.ObjectId.createFromHexString(comment.request_id) },
    { $inc: { n_comments: -1 } }
  );

  return res.status(200).json({ status: "ok" });
}
