import { Router } from "express";
import bookshelfController from "./bookshelfController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bookshelfRouter = Router();

bookshelfRouter.post(
  "/createBook",
  upload.single("image"),
  bookshelfController.addBook
);

bookshelfRouter.delete("/deleteBook", bookshelfController.deleteBook);
bookshelfRouter.put(
  "/updateBook",
  upload.single("image"),
  bookshelfController.updateBook
);
bookshelfRouter.get("/getBooks", bookshelfController.getBooks);
bookshelfRouter.get("/getBook/:id", bookshelfController.getBook);

export default bookshelfRouter;
