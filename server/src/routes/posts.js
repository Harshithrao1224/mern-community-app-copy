import express from "express";
import mongoose from "mongoose";
import { PostsModel } from "../models/Posts.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await PostsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", async (req, res) => {
  const post = new PostsModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    image: req.body.image,
    tags: req.body.tags,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    userOwner: req.body.userOwner,
  });
  console.log(post);

  try {
    const result = await post.save();
    res.status(201).json({
      createdPost: {
        name: result.tile,
        image: result.image,
        tags: result.tags,
        body: result.body,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:postId", async (req, res) => {
  try {
    const result = await PostsModel.findById(req.params.postId.trim());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Recipe
router.put("/", async (req, res) => {
  const post = await PostsModel.findById(req.body.postID.trim());
  const user = await UserModel.findById(req.body.userID.trim());
  try {
    user.savedPosts.push(post);
    await user.save();
    res.status(201).json({ savedPosts: user.savedPosts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved recipes
router.get("/savedPosts/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId.trim());
    res.status(201).json({ savedPosts: user?.savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedPosts/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId.trim());
    const savedPosts = await PostsModel.find({
      _id: { $in: user.savedPosts },
    });

    console.log(savedPosts);
    res.status(201).json({ savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as postsRouter };