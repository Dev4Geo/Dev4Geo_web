import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGO_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!DB_NAME) {
  throw new Error(
    "Please define the MONGO_DB_NAME environment variable inside .env.local"
  );
}

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
    dbName: DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  cachedClient = client;
  return client;
}

