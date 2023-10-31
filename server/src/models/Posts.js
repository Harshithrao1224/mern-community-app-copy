import mongoose from 'mongoose';
const PostsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tags: [{
        type: String,
        required: true,
    }],
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
});
export const PostsModel = mongoose.model("posts", PostsSchema);
