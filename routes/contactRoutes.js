import express from "express";
import { body, validationResult } from "express-validator";
import { MYContact } from "../models/mycontact.js";

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

      const newContact = new MYContact({
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
      const contacts = await MYContact.find();
      res.json(contacts);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });


  router.delete("/delete/:id", async (req, res) => {
    try {
      const contactId = req.params.id;
  
      // Check if the provided ID is valid
      if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
  
      // Find the contact by ID and delete it
      const deletedContact = await MYContact.findByIdAndDelete(contactId);
  
      // Check if the contact was found and deleted
      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
  
      res.json({ message: "Contact deleted successfully", deletedContact });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });


export default router;
