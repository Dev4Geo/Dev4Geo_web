import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import request from "@/models/request";
import { isJSONRequest } from "@/utils/apiUtils";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

async function editRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  if (isJSONRequest(req)) {
    return res
      .status(400)
      .json({ message: "Content-Type must be application/json" });
  }
  const isDevMode = process.env.NODE_ENV === "development";

  const { id, title, desc } = req.body;

  let session = await getSession({ req });

  if (isDevMode && !session?.user?.id) {
    session = {
      user: {
        id: new mongoose.Types.ObjectId(),
      },
      expires: "123",
    };
  }
  if (!session?.user?.id) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await dbConnect();

  const updatedRequest = await request.findOneAndUpdate(
    { _id: id, user_id: session.user.id },
    { title, desc, updated_at: new Date() },
    {
      new: true, // return new document instead of old one
      fields: { title: 1, desc: 1, updated_at: 1 },
    }
  );

  if (!updatedRequest) {
    return res
      .status(404)
      .json({ status: "error", message: "Request not found" });
  }

  return res.status(200).json({ status: "ok", data: updatedRequest });
}

export default editRequest;
