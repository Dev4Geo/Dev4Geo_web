import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  providerId: string;
  provider: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
