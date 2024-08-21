import { dbConnect } from "@/lib/mongo";
import VoteComment from "@/models/voteComment";
import Comment from "@/models/comment";

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function createVoteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { request_id, comment_id } = req.body;
  if (!request_id || !comment_id) {
    return res.status(400).json({
      status: "error",
      message: "request_id and comment_id are required",
    });
  }

  let session = await getAuth(req, res);

  if (!session?.user?.oid) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  await dbConnect();

  const [comment, existingVote] = await Promise.all([
    Comment.findById(comment_id),
    VoteComment.findOne({
      request_id,
      comment_id,
      user_id: session.user.oid.toString(),
    }),
  ]);

  if (!comment) {
    return res
      .status(400)
      .json({ status: "error", message: "Comment not found" });
  }

  if (existingVote) {
    return res
      .status(400)
      .json({ status: "error", message: "Vote already exists" });
  }

  const [newVote] = await Promise.all([
    VoteComment.create({
      request_id,
      comment_id,
      user_id: session.user.oid.toString(),
    }),
    Comment.findByIdAndUpdate(comment_id, {
      $inc: { n_votes: 1 },
    }),
  ]);

  const output = {
    comment_id: newVote.comment_id,
    user_id: newVote.user_id,
  };

  return res.status(201).json({ status: "ok", data: output });
}
