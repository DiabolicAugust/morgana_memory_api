import { Strings } from "../data/strings.js";
import Todo from "../models/Todo.js";
import { errorHandlingService } from "../service/errorService.js";

class todosController {
  async addTodo(req, res) {
    try {
      const { text } = req.body;
      if (!text) {
        return res
          .status(400)
          .json({ message: Strings.errors.textValidationError });
      }

      const todo = new Todo({
        text: text,
      });

      await todo.save();

      return res.status(200).json({
        message: Strings.requests.todoCreated,
        todo: todo,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async deleteTodo(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: Strings.errors.todoIdValidationError,
        });
      }

      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(400).json({
          message: Strings.errors.wrongId,
        });
      }
      await todo.deleteOne();
      return res.status(200).json({
        message: Strings.requests.todoDeleted,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async completeTodo(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: Strings.errors.todoIdValidationError,
        });
      }

      const todo = await Todo.findById(id);

      if (!todo) {
        return res.status(400).json({
          message: Strings.errors.todoNotFound,
        });
      }

      todo.isCompleted = !todo.isCompleted;

      await todo.save();

      return res.status(200).json({
        message: Strings.requests.todoStatusUpdated,
        todo: todo,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async getTodos(req, res) {
    try {
      const todos = await Todo.find();
      res.json({
        message: Strings.requests.allTodos,
        todos: todos,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }
}

export default new todosController();
