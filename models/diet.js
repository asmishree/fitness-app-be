import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  dietpref: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  yourdiet: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Diet = mongoose.model("Diet", schema);
