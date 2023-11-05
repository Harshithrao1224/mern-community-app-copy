import express from 'express';
import { verifyToken } from './user.js';
import { UserModel } from "../models/Users.js";
const router = express.Router();
router.delete('/unsave/:userId',verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { postId } = req.body;

  try {
    let user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { savedPosts: postId } },
      { new: true }
      
    );
    console.log("Unsaved a post");
    if(!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.savedPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export { router as unsaveRouter };
