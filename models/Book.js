import { Schema, model } from "mongoose";

const Book = new Schema({
  title: { type: String, require: true },
  author: { type: String, require: true },
  rate: { type: Number, default: 0 },
  text: { type: String, require: true },
  image: { type: String, default: "" },
  dateOfCreation: { type: String, default: Date.now() },
  isCompleted: { type: Boolean, default: false },
});

export default model("Book", Book);
