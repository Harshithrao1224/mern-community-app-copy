import express from "express";
import mongoose from "mongoose";
import { PostsModel } from "../models/Posts.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await PostsModel.find({}).populate({
      path: 'userOwner',
      select: 'username -_id'
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put('/like',verifyToken, async (req, res) => {
  const { postID, userID } = req.body;

  try {
    const post = await PostsModel.findById(postID);
    if (!post.likes.includes(userID)) {
      post.likes.push(userID);
      post.likesCount += 1; // Increment likesCount
      await post.save();
    }

    res.json({ likesCount: post.likesCount }); // Return the updated likesCount
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.put('/unlike',verifyToken, async (req, res) => {
  const { postID, userID } = req.body;

  try {
    const post = await PostsModel.findById(postID);
    if (post.likes.includes(userID)) {
      const index = post.likes.indexOf(userID);
      post.likes.splice(index, 1);
      post.likesCount -= 1; // Decrement likesCount
      await post.save();
    }

    res.json({ likesCount: post.likesCount }); // Return the updated likesCount
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// Create a new post
router.post("/",verifyToken, async (req, res) => {
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
    await UserModel.updateOne(
      { _id: req.body.userOwner },
      { $push: { myPosts: result._id } }
    );

    res.status(201).json({
      createdPost: {
        name: result.title,
        image: result.image,
        tags: result.tags,
        body: result.content,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:postId", async (req, res) => {
  try {
    const result = await PostsModel.findById(req.params.postId.trim());
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
//Update a post
router.put("/:postId",verifyToken, async (req, res) => {
  const { postId } = req.params;
  const updatedPostData = req.body;

  try {
    const updatedPost = await PostsModel.findByIdAndUpdate(postId, updatedPostData, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      updatedPost: {
        title: updatedPost.title,
        image: updatedPost.image,
        tags: updatedPost.tags,
        content: updatedPost.content,
        _id: updatedPost._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Post
router.put("/", verifyToken,async (req, res) => {
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

// Get id of saved posts
router.get("/savedPosts/ids/:userId",verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId.trim());
    res.status(201).json({ savedPosts: user?.savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get('/search/:searchTerm', async (req, res) => {
  const searchTerm = req.params.searchTerm.toString();
  console.log(searchTerm);
  try {
    const results = await PostsModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } }
      ]
    }).populate({
      path: 'userOwner',
      select: 'username -_id'
    });
    res.json(results);
  } catch (error) {
    console.error('Error searching for posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
// Get saved posts
router.get("/savedPosts/:userId",verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId.trim());
    const savedPosts = await PostsModel.find({
      _id: { $in: user.savedPosts },
    }).populate({
      path: 'userOwner',
      select: 'username -_id'
    });

    console.log(savedPosts);
    res.status(201).json({ savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/myPosts/:userId",verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId.trim());
    const myPosts = await PostsModel.find({
      _id: { $in: user.myPosts },
    });

    console.log(myPosts);
    res.status(201).json({ myPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.delete("/myPosts/delete/:userId",verifyToken, async (req, res) => {
  try {
    const { postId } = req.body;
    await UserModel.updateOne(
      { _id: req.params.userId },
      { $pull: { myPosts: postId } }
    );
    await PostsModel.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as postsRouter };