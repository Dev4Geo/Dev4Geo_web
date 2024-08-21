import { dbConnect } from "@/lib/mongo";
import Vote from "@/models/vote";
import Request from "@/models/request";


import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "../auth/[...nextauth]";

export default async function deleteVote(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const debug =
    process.env.NODE_ENV === "development" && process.env.DEBUG === "true";

  const { request_id } = req.body;

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

  const [request, existingVote] = await Promise.all([
    Request.findById(request_id),
    Vote.findOne({
      request_id,
      user_id: session.user.oid.toString(),
    }),
  ]);

  if (!request) {
    return res
      .status(400)
      .json({ status: "error", message: "Request not found" });
  }

  if (!existingVote) {
    return res
      .status(400)
      .json({ status: "error", message: "Vote does not exist" });
  }

  const [deletedVote] = await Promise.all([
    Vote.findByIdAndDelete(existingVote._id),
    Request.findByIdAndUpdate(request_id, {
      $inc: { n_votes: -1 },
    }),
  ]);

  const output = {
    request_id: deletedVote.request_id,
    user_id: deletedVote.user_id,
  };

  return res.status(200).json({ status: "ok", data: output });
}
