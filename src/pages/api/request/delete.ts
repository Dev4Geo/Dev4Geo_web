import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import request from "@/models/request";
import { isJSONRequest } from "@/utils/apiUtils";
import { getAuth } from "../auth/[...nextauth]";
import mongoose from "mongoose";

async function deleteRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.body;
  const isDevMode = process.env.NODE_ENV === "development";
  const debug = process.env.DEBUG === "true";
  if (isDevMode && debug) {
    await dbConnect();
    const deletedRequest = await request.findOneAndDelete({
      _id: mongoose.Types.ObjectId.createFromHexString(id),
    });
    if (!deletedRequest) {
      return res
        .status(404)
        .json({ status: "error", message: "Request not found" });
    }
    return res.status(200).json({ status: "ok", data: deletedRequest });
  }

  let session = await getAuth(req, res);
  if (!session?.user?.oid) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await dbConnect();

  const dat = {
    _id: mongoose.Types.ObjectId.createFromHexString(id),
    user_id: session.user.oid.toString(),
  };

  const deletedRequest = await request.findOneAndDelete(dat);

  if (!deletedRequest) {
    return res
      .status(400)
      .json({ status: "error", message: "Document not found" });
  }

  return res.status(200).json({ status: "ok", data: deletedRequest });
}

export default deleteRequest;
