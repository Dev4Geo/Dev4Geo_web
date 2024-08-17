import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    user_id: { type: String, required: true },
    request_id: { type: String, required: true },
});

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema);
