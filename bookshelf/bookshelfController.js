import Book from "../models/Book.js";
import { Readable } from "stream";
import mongoose from "mongoose";

class bookshelfController {
  async addBook(req, res) {
    try {
      const { title, author, text, rate } = req.body;

      // Check if required fields are present
      if (!title || !author || !text) {
        return res.status(400).json({
          message: "Fields title, text, and author cannot be blank!",
        });
      }

      let imageBuffer;

      // Check if file is present in the request
      if (req.file) {
        imageBuffer = req.file.buffer;
      }

      // Create a readable stream from the image buffer
      const readableImageStream = new Readable();
      readableImageStream.push(imageBuffer);
      readableImageStream.push(null);

      // Store the image in GridFS
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "images", // Set your bucket name
      });

      const uploadStream = bucket.openUploadStream("image.png", {
        contentType: "image/png", // Set your image content type
      });

      readableImageStream.pipe(uploadStream);

      // Wait for the image to be stored
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      const image = `/api/image/${uploadStream.id}`; // Set your image URL endpoint

      const book = Book({
        title,
        text,
        author,
        rate,
        image, // Add the imageUrl to the book object
      });

      await book.save();

      return res.json({
        message: "Book has been added successfully!",
        book: book,
      });
    } catch (error) {
      console.log(error);
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
        message: "Error while creating todo",
        error: error,
      });
    }
  }
}

export default new bookshelfController();
