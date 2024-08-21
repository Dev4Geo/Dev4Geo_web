import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const voteCommentSchema = new Schema({
    user_id: { type: String, required: true },
    request_id: { type: String, required: true },
    comment_id: { type: String, required: true },
});


export default mongoose.models.VoteComment || mongoose.model('VoteComment', voteCommentSchema);
