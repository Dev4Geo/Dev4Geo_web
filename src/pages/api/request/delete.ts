import { dbConnect } from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import request from "@/models/request";
import { isJSONRequest } from "@/utils/apiUtils";
import { getSession } from "next-auth/react";

async function deleteRequest(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  if (isJSONRequest(req)) {
    return res
      .status(400)
      .json({ message: "Content-Type must be application/json" });
  }

  const { id } = req.body;
  const isDevMode = process.env.NODE_ENV === "development";
  if (isDevMode) {
    await dbConnect();
    const deletedRequest = await request.findOneAndDelete({
      _id: id,
    });
    if (!deletedRequest) {
      return res
        .status(404)
        .json({ status: "error", message: "Request not found" });
    }
    return res.status(200).json({ status: "ok", data: deletedRequest });
  }

  let session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  await dbConnect();

  const deletedRequest = await request.findOneAndDelete({
    _id: id,
    user_id: session.user.oid.toString(),
  });

  if (!deletedRequest) {
    return res
      .status(404)
      .json({ status: "error", message: "Request not found" });
  }

  return res.status(200).json({ status: "ok", data: deletedRequest });
}

export default deleteRequest;
