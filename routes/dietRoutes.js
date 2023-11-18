import express from "express";
import { body, validationResult } from "express-validator";
import { Diet } from "../models/diet.js";

const router = express.Router();

// Create a new diet
router.post(
  "/create",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("dietpref").notEmpty().withMessage("Dietary Preference is required"),
    body("activity").notEmpty().withMessage("Activity Level is required"),
    body("yourdiet").notEmpty().withMessage("Your Diet is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, dietpref, activity, yourdiet } = req.body;

      const newDiet = new Diet({
        title,
        dietpref,
        activity,
        yourdiet,
      });

      const diet = await newDiet.save();
      res.json({ message: "Diet created successfully", diet });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get all diets
router.get("/getall", async (req, res) => {
  try {
    const diets = await Diet.find();
    res.json(diets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/shortby", async (req, res) => {
  try {
    let sortParams = {};

    // Check if dietpref is provided in the query
    if (req.query.dietpref) {
      sortParams.dietpref = req.query.dietpref;
    }

    // Check if activity is provided in the query
    if (req.query.activity) {
      sortParams.activity = req.query.activity;
    }

    // Fetch diets based on the sort parameters
    let diets = await Diet.find(sortParams);

    // Shuffle the diets array
    diets = shuffleArray(diets);

    res.json(diets);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}




// Get diet by ID
router.get("/getdiet/:id", async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);

    if (!diet) {
      return res.status(404).json({ message: "Diet not found" });
    }

    res.json(diet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update diet by ID
router.put(
  "/update/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("dietpref").notEmpty().withMessage("Dietary Preference is required"),
    body("activity").notEmpty().withMessage("Activity Level is required"),
    body("yourdiet").notEmpty().withMessage("Your Diet is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, dietpref, activity, yourdiet } = req.body;

      const updatedDiet = {
        title,
        dietpref,
        activity,
        yourdiet,
      };

      const diet = await Diet.findByIdAndUpdate(req.params.id, updatedDiet, {
        new: true,
      });

      if (!diet) {
        return res.status(404).json({ message: "Diet not found" });
      }

      res.json({ message: "Diet updated successfully", diet });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Delete diet by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const diet = await Diet.findByIdAndRemove(req.params.id);

    if (!diet) {
      return res.status(404).json({ message: "Diet not found" });
    }

    res.json({ message: "Diet deleted successfully", diet });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
