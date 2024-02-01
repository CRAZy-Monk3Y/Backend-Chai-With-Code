import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // console.log(localFilePath);
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      media_metadata: true,
    });
    // file has been uploaded successfully
    // console.log("File is uploaded ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temp file
    return null;
  }
};

async function getVideoDuration(publicId) {
  try {
    const response = await cloudinary.api.resource(publicId, {
      resource_type: "video",
      image_metadata: true,
    });
    return response.video_duration;
  } catch (error) {
    console.error(`Error retrieving video duration: ${error}`);
    return null; // Or handle error appropriately
  }
}

export { uploadOnCloudinary, getVideoDuration };
