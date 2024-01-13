import { Readable } from "stream";
import mongoose from "mongoose";

export async function uploadRequestImage(file, filename = "image") {
  if (!file) {
    return "";
  }

  let imageBuffer;

  imageBuffer = file.buffer;

  // Create a readable stream from the image buffer
  const readableImageStream = new Readable();
  readableImageStream.push(imageBuffer);
  readableImageStream.push(null);

  const fileExtension = filename.split(".").pop();
  const contentType = `image/${
    fileExtension === "jpg" ? "jpeg" : fileExtension
  }`;

  // Store the image in GridFS
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });

  const uploadStream = bucket.openUploadStream(filename, {
    contentType: contentType,
  });

  readableImageStream.pipe(uploadStream);

  // Wait for the image to be stored
  await new Promise((resolve, reject) => {
    uploadStream.on("finish", resolve);
    uploadStream.on("error", reject);
  });

  return `/api/image/${uploadStream.id}`;
}

export async function deleteImage(image) {
  const imageId = image.split("/").pop();
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });

    bucket.delete(new mongoose.Types.ObjectId(imageId), (error) => {
      if (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
