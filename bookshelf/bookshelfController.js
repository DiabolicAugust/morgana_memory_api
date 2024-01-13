import Book from "../models/Book.js";
import { deleteImage, uploadRequestImage } from "../service/imageService.js";
import mongoose from "mongoose";

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
        message: "Book has been added successfully!",
        book: book,
      });
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const customError = Object.values(error.errors).map((err) => {
          return { message: err.message };
        });

        return res.status(400).json({
          message: customError,
        });
      }

      // Handle other types of errors here
      console.error(error);
      return res.status(400).json({
        message: error.message,
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
      if (book.image) {
        await deleteImage(book.image);
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
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({
          message: "The id field can not be blank",
        });
      }

      // Checking if book with this id exists
      const checkBook = await Book.findById(id);
      if (!checkBook) {
        return res.status(400).json({
          message: "There is no book with this id",
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
          message: "Error while updating a book",
        });
      }

      res.status(200).json({
        message: "Your book has been updated successfully!",
        book: updatedBook,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message: error.message,
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
        message: error.message,
      });
    }
  }

  async getBook(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "The id field can not be blank!",
        });
      }
      const book = await Book.findById(id);
      res.status(200).json({
        message: "Book by id",
        book: book,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}

export default new bookshelfController();
