
import { NextApiRequest } from "next/types";

export function isJSONRequest(req: NextApiRequest) {
  return (
    !req.headers["content-type"] ||
    req.headers["content-type"] !== "application/json"
  );
}