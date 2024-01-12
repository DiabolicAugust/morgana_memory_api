import Book from "../models/Book.js";

class bookshelfController {
  async addBook(req, res) {
    try {
      const { title, author, text, rate } = req.body;
      if (!title || !author || !text) {
        return res.status(400).json({
          message: "Fields title, text and author can not be blank!",
        });
      }

      const book = Book({
        title,
        text,
        author,
        rate,
      });
      await book.save();
      return res.json({
        message: "Book has been added successfully!",
        book: book,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error while creating a book",
        error: error,
      });
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          message: "Id field can not be blank!",
        });
      }
      const book = await Book.findByIdAndDelete(id);
      if (!book) {
        return res.status(400).json({
          message: "There is no book with this id!",
        });
      }
      return res.status(200).json({
        message: "Book has been deleted successfully!",
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Error while creating todo",
        error: error,
      });
    }
  }

  async updateBook(req, res) {
    try {
      const book = req.body;
      const updatedBook = await Book.findOneAndUpdate(
        { _id: book.id },
        { $set: book },
        { new: true, useFindAndModify: false }
      );

      if (!updatedBook) {
        return res.status(404).json({
          message: "No book found with this id",
        });
      }

      res.status(200).json({
        message: "Your book has been updated successfully!",
        book: updatedBook,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: "Error while updating a book",
        error: error.message,
      });
    }
  }

  async getBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json({
        message: "All books",
        books: books,
      });
    } catch (error) {
      res.status(400).json({
        message: "Error while creating todo",
        error: error,
      });
    }
  }
}

export default new bookshelfController();
