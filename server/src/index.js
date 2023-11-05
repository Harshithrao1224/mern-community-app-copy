import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import cookieParser from "cookie-parser";

import { verifyToken } from './routes/user.js';
import { userRouter } from './routes/user.js';
import { postsRouter } from './routes/posts.js';
import { unsaveRouter } from './routes/unsave.js';

dotenv.config()
const app = express();
const port = process.env.PORT;

// SSL certificate
const privateKey = fs.readFileSync('C:/Windows/System32/cert.key', 'utf8'); 
const certificate = fs.readFileSync('C:/Windows/System32/cert.crt', 'utf8'); 
const credentials = { key: privateKey, cert: certificate };
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'https://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  

// Routes
app.use("/auth", userRouter);
app.use("/posts", postsRouter);
app.use("/posts/savedPosts",unsaveRouter);

// Connect to MongoDB
mongoose.connect(process.env.DB).then(() => {
    // Create HTTPS server
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(port, () => {
        console.log(`HTTPS Server running on port ${port}`);
    });
}).catch((error) => {
    console.log(error.message);
});
