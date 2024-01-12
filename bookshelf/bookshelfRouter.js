import { Router } from "express";
import bookshelfController from "./bookshelfController.js";

const bookshelfRouter = Router();

bookshelfRouter.post("/createBook", bookshelfController.addBook);
bookshelfRouter.post("/deleteBook", bookshelfController.deleteBook);
bookshelfRouter.post("/updateBook", bookshelfController.updateBook);
bookshelfRouter.get("/getBooks", bookshelfController.getBooks);

export default bookshelfRouter;
