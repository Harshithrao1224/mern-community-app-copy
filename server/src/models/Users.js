import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username:{ type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  myPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
});

export const UserModel = mongoose.model("users", UserSchema);
