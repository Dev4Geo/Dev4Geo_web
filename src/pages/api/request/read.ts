import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import request from "@/models/request";

async function getAllRequests(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const limit = 20;
  const { id, page } = req.query;

  await dbConnect();

  if (id) {
    const this_request = await request.findOne({
      _id: id,
    });

    if (!this_request) {
      return res
        .status(400)
        .json({ status: "error", message: "Request not found" });
    }

    return res.status(200).json({
      status: "ok",
      data: this_request,
    });
  }

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
