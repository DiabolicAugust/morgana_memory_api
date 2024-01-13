import Todo from "../models/Todo.js";
import { errorHandlingService } from "../service/errorService.js";

class todosController {
  async addTodo(req, res) {
    try {
      const { text } = req.body;
      if (!text) {
        return res
          .status(400)
          .json({ message: "Text was not added or is blank" });
      }

      const todo = new Todo({
        text: text,
      });

      await todo.save();

      return res.status(200).json({
        message: "Todo has been created",
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
          message: "Todo id was not added or is blank",
        });
      }

      const todo = await Todo.findById(id);
      if (!todo) {
        return res.status(400).json({
          message: "Wrong id",
        });
      }
      await todo.deleteOne();
      return res.status(200).json({
        message: "Todo was successfully deleted!",
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
          message: "Todo id was not added or is blank",
        });
      }

      const todo = await Todo.findById(id);

      if (!todo) {
        return res.status(400).json({
          message: "Todo not found",
        });
      }

      todo.isCompleted = !todo.isCompleted;

      await todo.save();

      return res.status(200).json({
        message: "Todo status updated successfully",
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
        message: "All todos",
        todos: todos,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }
}

export default new todosController();
