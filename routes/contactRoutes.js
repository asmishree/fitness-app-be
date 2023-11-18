import express from "express";
import { body, validationResult } from "express-validator";
import { Contact } from "../models/contact.js";

const router = express.Router();

router.post(
  "/create",
  [
    body("name").notEmpty().withMessage("name is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        message,
      });

      const contact = await newContact.save();
      res.json({ message: "We Will Contact you Soon", contact });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/getall", async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });


export default router;
