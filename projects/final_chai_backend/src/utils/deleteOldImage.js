import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const DeleteOldImage = async ({ imagePublicId }) => {
  try {
    if (!imagePublicId) {
      return null;
    }
    const result = await cloudinary.uploader.destroy(imagePublicId);
  } catch (error) {
    new ApiError(500, "Image deletion error");
  }
};

export { DeleteOldImage };
