import { Schema, model } from "mongoose";
import { Strings } from "../data/strings.js";

const Note = new Schema({
  text: { type: String, required: [true, Strings.errors.textValidationError] },
  dateOfCreation: { type: String, default: Date.now() },
});

export default model("Note", Note);
