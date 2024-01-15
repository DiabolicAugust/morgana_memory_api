import { Router } from "express";
import moviesController from "./moviesController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const moviesRouter = Router();

moviesRouter.post(
  "/createMovie",
  upload.single("image"),
  moviesController.addMovie
);

moviesRouter.delete("/deleteMovie/:id", moviesController.deleteMovie);
moviesRouter.put(
  "/updateMovie",
  upload.single("image"),
  moviesController.updateMovie
);
moviesRouter.get("/getMovies", moviesController.getMovies);
moviesRouter.get("/getMovie/:id", moviesController.getMovie);

export default moviesRouter;
