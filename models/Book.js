import { Schema, model } from "mongoose";

const Book = new Schema({
  title: {
    type: String,
    required: [true, "Title can not be blank!"],
    unique: {
      value: true,
      message: "You already have a book with this title!",
    },
  },
  author: { type: String, required: [true, "Author can not be blank!"] },
  rate: {
    type: Number,
    default: 1,
    min: [1, "Rate number can be from 1 to 5"],
    max: 5,
  },
  text: { type: String, required: [true, "Text can not be blank!"] },
  image: { type: String, default: "" },
  dateOfCreation: { type: String, default: Date.now() },
  isCompleted: { type: Boolean, default: false },
});

export default model("Book", Book);
