import { Router } from "express";
import todosController from "./todosController.js";

const todosRouter = Router();

todosRouter.post("/createTodo", todosController.addTodo);
todosRouter.delete("/deleteTodo", todosController.deleteTodo);
todosRouter.get("/getTodos", todosController.getTodos);
todosRouter.put("/completeTodo", todosController.completeTodo);

export default todosRouter;
