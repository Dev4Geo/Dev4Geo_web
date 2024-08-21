import { dbConnect } from "@/lib/mongo";
import VoteComment from "@/models/voteComment";

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function readVote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id: request_id } = req.query;
  if (!request_id) {
    return res.status(400).json({
      status: "error",
      message: "request_id is required",
    });
  }

  let session = await getAuth(req, res);

  if (!session?.user?.oid) {
    console.log(session?.user);
    return res.status(200).json({ status: "success", data: [] });
  }
  await dbConnect();

  const vote_counts = await VoteComment.aggregate([
    {
      $match: {
        request_id: request_id,
        user_id: session.user.oid.toString(),
      },
    },
    {
      $group: {
        _id: "$comment_id",
      },
    },
    {
      $project: {
        _id: 0,
        comment_id: "$_id",
      },
    },
  ]);

  // return list of strings of comment_id
  const comment_ids = vote_counts.map((vote) => vote.comment_id);

  return res.status(200).json({ status: "success", data: comment_ids });
}
