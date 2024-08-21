import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import Comment from "@/models/comment";

export default async function readComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const limit = 20;

  const { id: request_id } = req.query;
  const { page } = req.query;
  const pageInt = parseInt(page as string, 10) || 1; // page start from 1

  await dbConnect();

  const comments = await Comment.find({
    request_id: request_id,
  })
    .sort({ updated_at: -1 })
    .limit(limit)
    .skip(limit * (pageInt - 1));

  return res.status(200).json({ status: "ok", data: comments });
}
