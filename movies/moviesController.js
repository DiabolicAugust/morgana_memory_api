import { Strings } from "../data/strings.js";
import Movie from "../models/Movie.js";
import { errorHandlingService } from "../service/errorService.js";
import { deleteImage, uploadRequestImage } from "../service/imageService.js";

class MovieshelfController {
  async addMovie(req, res) {
    try {
      const { title, author, text, rate } = req.body;

      //   if (!title || !author || !text) {
      //     return res.status(400).json({
      //       message: "Fields title, text, and author cannot be blank!",
      //     });
      //   }

      const movie = Movie({
        title,
        text,
        author,
        rate,
      });

      await movie.save();

      const image = await uploadRequestImage(req.file);

      const updatedMovie = await Movie.findOneAndUpdate(
        { _id: movie.id },
        {
          $set: {
            image: image,
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedMovie) {
        await deleteImage(image);
        return res.status(404).json({
          message: Strings.errors.movieUpdateError,
        });
      }

      return res.json({
        message: Strings.requests.MovieCreated,
        movie: updatedMovie,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: Strings.errors.idValidationError,
        });
      }
      const movie = await Movie.findByIdAndDelete(id);
      if (!movie) {
        return res.status(400).json({
          message: Strings.errors.noMovieById,
        });
      }
      if (movie.image) {
        await deleteImage(movie.image);
      }

      return res.status(200).json({
        message: Strings.requests.movieDeleted,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async updateMovie(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(404).json({
          message: Strings.errors.idValidationError,
        });
      }

      // Checking if Movie with this id exists
      const checkMovie = await Movie.findById(id);
      if (!checkMovie) {
        return res.status(404).json({
          message: Strings.errors.noMovieById,
        });
      }

      const update = req.body;

      // If user added new image and the Movie already has one - we need to delete an old image
      if (checkMovie.image && req.file) {
        await deleteImage(checkMovie.image);
      }

      //Uploading new image
      if (req.file) {
        const image = await uploadRequestImage(req.file);
        update.image = image;
      }

      //Updating the Movie with new data
      const updatedMovie = await Movie.findOneAndUpdate(
        { _id: update.id },
        { $set: update },
        { new: true, useFindAndModify: false }
      );

      // If something gone wrong and Movie was not updated - we need to delete new image
      if (!updatedMovie) {
        await deleteImage(image);
        return res.status(404).json({
          message: Strings.errors.movieUpdateError,
        });
      }

      res.status(200).json({
        message: Strings.requests.movieUpdated,
        movie: updatedMovie,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }

  async getMovies(req, res) {
    try {
      const movies = await Movie.find();
      res.status(200).json({
        message: Strings.requests.allMovies,
        movies: movies,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getMovie(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: Strings.errors.idValidationError,
        });
      }
      const movie = await Movie.findById(id);
      res.status(200).json({
        message: Strings.requests.movieById,
        movie: movie,
      });
    } catch (error) {
      errorHandlingService(error, res);
    }
  }
}

export default new MovieshelfController();
