import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const requestSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    n_votes: { type: Number, default: 0 },
    n_comments: { type: Number, default: 0 },
    status: { type: String, enum:['o', 'c', 'i'], default: 'o'},
    user_id: { type: String, required: true },
    tags: { type: [String], default: [] }
});

export default mongoose.models.Request || mongoose.model('Request', requestSchema);