import express from "express";
import { Blog } from "../models/blog.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Get all blogs
router.get("/getall", async (req, res) => {
  try {
    const blogs = await Blog.find().select("-description");
    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Create a new blog
router.post(
  "/create",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("summery").notEmpty().withMessage("Summary is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("img").notEmpty().withMessage("Image URL is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, summery, description, img } = req.body;

      const newBlog = new Blog({
        title,
        summery,
        description,
        img,
      });

      const blog = await newBlog.save();
      res.json({ message: "Blog created successfully", blog });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get blog by ID
router.get("/getblog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update blog by ID
router.put("/update/:id", async (req, res) => {
  try {
    const { title, summery, description, img } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, summery, description, img },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Delete blog by ID
router.delete("/delete/:id", async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  
      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.json({ message: "Blog deleted successfully", deletedBlog });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  

export default router;
