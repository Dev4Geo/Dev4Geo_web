
import { NextApiRequest } from "next/types";

export function isJSONRequest(req: NextApiRequest) {
  return (
    !req.headers["Content-Type"] ||
    req.headers["Content-Type"] !== "application/json"
  );
}