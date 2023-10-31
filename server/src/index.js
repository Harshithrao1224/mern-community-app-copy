import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { userRouter } from './routes/user.js';
import { postsRouter } from './routes/posts.js';
import { unsaveRouter } from './routes/unsave.js';

dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // replace with your React app's URL
  credentials: true,
}));

// Routes
app.use("/auth", userRouter);
app.use("/posts", postsRouter);
app.use("/posts/savedPosts",unsaveRouter);

// Connect to MongoDB
mongoose.connect(process.env.DB).then(() => {
    app.listen(port, () => { console.log(`Server running on port: ${port}`) });
}).catch((error) => {
    console.log(error.message);
}
);