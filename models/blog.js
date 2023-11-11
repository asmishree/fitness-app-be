import mongoose from "mongoose";

const schema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true,
  },
  summery: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Blog = mongoose.model("Blog", schema);
