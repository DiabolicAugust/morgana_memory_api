import { Router } from "express";
import imagesController from "./imagesController.js";
import multer from "multer";

const imagesRouter = Router();

imagesRouter.get("/:id", imagesController.getImage);

export default imagesRouter;
