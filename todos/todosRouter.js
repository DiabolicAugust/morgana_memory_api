import { Router } from 'express';
import todosController from './todosController.js';

const todosRouter = Router();

todosRouter.post('/createTodo', todosController.addTodo);
todosRouter.post('/deleteTodo', todosController.deleteTodo);
todosRouter.get('/getTodos', todosController.getTodos);
todosRouter.post('/completeTodo', todosController.completeTodo);

export default todosRouter;
