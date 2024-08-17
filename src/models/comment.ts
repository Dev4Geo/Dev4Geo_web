// comment model on mongoose

import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
  request_id: string;
  user_id: string;
  user_name: string;
  text: string;
  n_votes: number;
  created_at: Date;
  updated_at: Date;
}

const CommentSchema: Schema<IComment> = new Schema({
    request_id: { type: String, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    text: { type: String, required: true },
    n_votes: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
