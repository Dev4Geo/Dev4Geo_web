import { dbConnect } from "@/lib/mongo";
import VoteComment from "@/models/voteComment";
import Comment from "@/models/comment";

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function deleteVoteComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "id is required",
    });
  }

  let session = await getAuth(req, res);

  if (!session?.user?.oid) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }
  await dbConnect();

  const [voteComment, comment] = await Promise.all([
    VoteComment.findOneAndDelete({
      comment_id: id,
      user_id: session.user.oid.toString(),
    }),
    Comment.findByIdAndUpdate(id, {
      $inc: { n_votes: -1 },
    }),
  ]);

  if (!voteComment) {
    return res.status(400).json({ status: "error", message: "Vote not found" });
  }

  return res.status(200).json({ status: "ok" });
}
