import { Schema, model } from "mongoose";

const Todo = new Schema({
  text: { type: String, required: true },
  dateOfCreation: { type: String, default: Date.now() },
  isCompleted: { type: Boolean, default: false },
});

export default model("Todo", Todo);
