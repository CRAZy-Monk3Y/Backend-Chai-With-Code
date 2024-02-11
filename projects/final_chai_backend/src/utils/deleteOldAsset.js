import { ApiError } from "./ApiError.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const DeleteOldAsset = async ({ assetPublicId }) => {
  try {
    if (!assetPublicId) {
      return null;
    }
    const result = await cloudinary.uploader.destroy(assetPublicId);
  } catch (error) {
    new ApiError(500, "Asset deletion error");
  }
};

export { DeleteOldAsset };
