import express from "express";
import mongoose from "mongoose";
import notesRouter from "./notes/notesRouter.js";
import todosRouter from "./todos/todosRouter.js";
import bookshelfRouter from "./bookshelf/bookshelfRouter.js";
import moviesRouter from "./movies/moviesRouter.js";
import dotenv from "dotenv";
import imagesRouter from "./images/imagesRouter.js";
import { Strings } from "./data/strings.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/notes", notesRouter);
app.use("/todos", todosRouter);
app.use("/books", bookshelfRouter);
app.use("/movies", moviesRouter);
app.use("/api/image", imagesRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    app.listen(PORT, () => console.log(Strings.general.serverStart));
  } catch (error) {
    console.log(error);
  }
};

start();
