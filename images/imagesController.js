import mongoose from "mongoose";

class imagesController {
  async getImage(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          message: "The id can not be blank!",
        });
      }
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "images", // Set your bucket name
      });

      // Open a download stream from GridFS
      const downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(id)
      );

      // Pipe the image stream to the response
      downloadStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Error while getting image",
        error: error,
      });
    }
  }
}

export default new imagesController();
