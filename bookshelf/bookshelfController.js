import { Strings } from "../data/strings.js";
import Book from "../models/Book.js";
import { errorHandlingService } from "../service/errorService.js";
import { deleteImage, uploadRequestImage } from "../service/imageService.js";

class bookshelfController {
  async addBook(req, res) {
    try {
      const { title, author, text, rate } = req.body;

      //   if (!title || !author || !text) {
      //     return res.status(400).json({
      //       message: "Fields title, text, and author cannot be blank!",
      //     });
      //   }

      const image = await uploadRequestImage(req.file);

      const book = Book({
        title,
        text,
        author,
        rate,
        image,
      });

      await book.save();

      return res.json({
        message: Strings.requests.bookCreated,
        book: book,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async deleteBook(req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({
          message: Strings.errors.idValidationError,
        });
      }
      const book = await Book.findByIdAndDelete(id);
      if (!book) {
        return res.status(400).json({
          message: Strings.errors.noBookById,
        });
      }
      if (book.image) {
        await deleteImage(book.image);
      }

      return res.status(200).json({
        message: Strings.requests.bookDeleted,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async updateBook(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: Strings.errors.idValidationError,
        });
      }

      // Checking if book with this id exists
      const checkBook = await Book.findById(id);
      if (!checkBook) {
        return res.status(400).json({
          message: Strings.errors.noBookById,
        });
      }

      const update = req.body;

      // If user added new image and the book already has one - we need to delete an old image
      if (checkBook.image && req.file) {
        await deleteImage(checkBook.image);
      }

      //Uploading new image
      if (req.file) {
        const image = await uploadRequestImage(req.file);
        update.image = image;
      }

      //Updating the book with new data
      const updatedBook = await Book.findOneAndUpdate(
        { _id: update.id },
        { $set: update },
        { new: true, useFindAndModify: false }
      );

      // If something gone wrong and book was not updated - we need to delete new image
      if (!updatedBook) {
        await deleteImage(image);
        return res.status(404).json({
          message: Strings.errors.bookUpdateError,
        });
      }

      res.status(200).json({
        message: Strings.requests.bookUpdated,
        book: updatedBook,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async getBooks(req, res) {
    try {
      const books = await Book.find();
      res.status(200).json({
        message: Strings.requests.allBooks,
        books: books,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getBook(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: Strings.errors.idValidationError,
        });
      }
      const book = await Book.findById(id);
      res.status(200).json({
        message: Strings.requests.bookById,
        book: book,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }
}

export default new bookshelfController();
