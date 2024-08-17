import { dbConnect } from "@/lib/mongo";
import Vote from "@/models/vote";

import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function readVote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";

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
    console.log(session?.user)
    return res.status(200).json({ status: "success", data: [] });
  }
  await dbConnect();

  const votes = await Vote.find({
    user_id: session.user.oid.toString(),
  });

  let request_ids = [];
  if (votes.length > 0) {
    request_ids = votes.map((vote) => vote.request_id);
  }

  return res.status(200).json({ status: "success", data: request_ids });
}
