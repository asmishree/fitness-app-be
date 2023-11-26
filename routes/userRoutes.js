import express from "express";
import { User } from "../models/user.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const router = express.Router();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);


const verifyToken = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

// Route to get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Use the user ID from the decoded token to retrieve the user profile
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Send the user profile in the response
    res.json({ success: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post(
  "/login-google",
  body("token"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      // Check if the user already exists in your database
      let existingUser = await User.findOne({ email: payload.email });

      if (!existingUser) {
        // If the user doesn't exist, create a new user in your database
        const newUser = new User({
          name: payload.name,
          email: payload.email,
          // You can add other fields from the payload as needed
        });

        // Save the new user to the database
        await newUser.save();

        // Use the newly created user's ID for JWT
        existingUser = newUser;
      }

      // Generate JWT token
      const data = {
        user: {
          id: existingUser.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res.json({
        success: true,
        message: "Login with Google Successful",
        authToken: authToken,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);

router.post(
  "/register",
  body("email").isEmail(),
  body("name").isLength({ min: 3 }),
  body("gender"),
  body("age"),
  body("height"),
  body("weight"),
  body("password", "Password Length Must be 8 Characters").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, age, gender, height, weight, password } = req.body;
      let userData = await User.findOne({ email });
      if (userData) {
        return res.json({ message: "User Allready Exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      userData = await User.create({
        name,
        email,
        age,
        gender,
        height,
        weight,
        password: hashedPassword,
      });
      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({
        success: true,
        message: "Register Successfully",
        authToken: authToken,
      });
    } catch (error) {
      res.json({ success: false, message: "Please Enter Valid Details" });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let userData = await User.findOne({ email });
      if (!userData) {
        return res.json({ success: false, message: "Enter a valid Email" });
      }
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return res.json({ success: false, message: "password not match" });
      }

      const data = {
        user: {
          id: userData.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({
        success: true,
        authToken: authToken,
        message: "Login Successfull",
      });
    } catch (error) {
      console.error(error.message);
      res.send("Server Error");
    }
  }
);

export default router;
