import Todo from '../models/Todo.js';

class todosController {
  async addTodo(req, res) {
    try {
      const { text } = req.body;
      if (!text) {
        return res
          .status(400)
          .json({ message: 'Text was not added or is blank' });
      }

      const todo = new Todo({
        text: text,
      });

      await todo.save();

      return res.status(200).json({
        message: 'Todo has been created',
        todo: todo,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error while creating todo',
        error: error,
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      const { todo_id } = req.body;

      if (!todo_id) {
        return res.status(400).json({
          message: 'Todo id was not added or is blank',
        });
      }

      const todo = await Todo.findById(todo_id);
      if (!todo) {
        return res.status(400).json({
          message: 'Wrong todo_id',
        });
      }
      await todo.deleteOne();
      return res.status(200).json({
        message: 'Todo was successfully deleted!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: 'Error while creating todo',
        error: error,
      });
    }
  }

  async completeTodo(req, res) {
    try {
      try {
        const { todo_id } = req.body;

        if (!todo_id) {
          return res.status(400).json({
            message: 'Todo id was not added or is blank',
          });
        }

        const todo = await Todo.findById(todo_id);

        if (!todo) {
          return res.status(400).json({
            message: 'Todo not found',
          });
        }

        todo.isCompleted = !todo.isCompleted;

        await todo.save();

        return res.status(200).json({
          message: 'Todo status updated successfully',
          todo: todo,
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message: 'Error while completing todo',
        });
      }
    } catch (error) {
      res.status(400).json({
        message: 'Error while creating todo',
        error: error,
      });
    }
  }

  async getTodos(req, res) {
    try {
      const todos = await Todo.find();
      res.json({
        message: 'All todos',
        todos: todos,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Error while creating todo',
        error: error,
      });
    }
  }
}

export default new todosController();
