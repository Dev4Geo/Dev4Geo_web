import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import request from "@/models/request";

async function getAllRequests(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const limit = 20;

  await dbConnect();
  if (process.env.NODE_ENV === "development") {
    const requests = await request.find({}).sort({ updated_at: -1 }).limit(100);
    return res.status(200).json({
      status: "ok",
      data: requests,
    });
  }

  const { page } = req.query;
  const pageInt = parseInt(page as string, 10) || 1; // page start from 1
  const requests = await request
    .find({})
    .sort({ updated_at: -1 })
    .limit(limit)
    .skip(limit * (pageInt - 1));
  return res.status(200).json({
    //
    status: "ok",
    page: pageInt,
    limit: limit,
    data: requests,
  });
}

export default getAllRequests;
