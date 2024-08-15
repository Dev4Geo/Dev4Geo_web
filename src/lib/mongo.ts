import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient: typeof mongoose | null = null;

export async function dbConnect() {
  if (cachedClient) {
    return cachedClient;
  }
  if (MONGODB_URI === undefined) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  const client = await mongoose.connect(MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

