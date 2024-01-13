import mongoose from "mongoose";

export function errorHandlingService(error, res, customErrorString) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: validationError(error),
    });
  }

  // Handle other types of errors here
  console.error(error);
  return res.status(400).json({
    message: customErrorString ?? error.message,
  });
}

function validationError(error) {
  const customError = Object.values(error.errors).map((err) => {
    return { message: err.message };
  });

  return customError;
}
