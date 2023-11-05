import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
import { UserModel } from "../models/Users.js";

router.post("/register", async (req, res) => {
  const { email,username,password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ email,username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});
/*
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "email or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "email or password is incorrect" });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET);
  res.json({ token, userID: user._id,username:user.username });
});

export const verifyToken=(req, res, next)=>{
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.userId = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};*/
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      console.log("Authorized");
      req.userId = user.id;
      next();
    });
  } else {
    console.log("Unauthorized: No token provided");
    res.sendStatus(401);
  }
};
router.post("/logout",verifyToken, (req, res) => {
  res.clearCookie('access_token');
  res.sendStatus(200);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "email or password is incorrect" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "email or password is incorrect" });
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET);

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'None',
    secure:true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  
  res.json({ userID: user._id, username: user.username });
});

router.get('/auto-login', verifyToken, async (req, res) => {
  try {
    console.log("Trying auto-login");
    const user = await UserModel.findById(req.userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ userID: user._id, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export { router as userRouter };