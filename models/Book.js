import { Schema, model } from "mongoose";
import { Strings } from "../data/strings.js";

const Book = new Schema({
  title: {
    type: String,
    required: [true, Strings.errors.titleValidationError],
    unique: {
      value: true,
      message: Strings.errors.titleUniqueError,
    },
  },
  author: {
    type: String,
    required: [true, Strings.errors.authorValidationError],
  },
  rate: {
    type: Number,
    default: 1,
    min: [1, Strings.errors.rateValueError],
    max: 5,
  },
  text: { type: String, required: [true, Strings.errors.textValidationError] },
  image: { type: String, default: "" },
  dateOfCreation: { type: String, default: Date.now() },
  isCompleted: { type: Boolean, default: false },
});

export default model("Book", Book);
