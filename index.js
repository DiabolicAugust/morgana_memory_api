import express from "express";
import mongoose from "mongoose";
import notesRouter from "./notes/notesRouter.js";
import todosRouter from "./todos/todosRouter.js";
import bookshelfRouter from "./bookshelf/bookshelfRouter.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/notes", notesRouter);
app.use("/todos", todosRouter);
app.use("/books", bookshelfRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log("\x1b[31 m Server started! \x1b[0m"));
  } catch (error) {
    console.log(error);
  }
};

start();
