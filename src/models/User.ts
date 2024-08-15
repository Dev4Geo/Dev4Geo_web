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
  providerId: { type: String, required: true },
  provider: { type: String, required: true },
});

const User: Model<IUser> =
  mongoose.models.XUser || mongoose.model("XUser", UserSchema);

export default User;
