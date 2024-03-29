import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/User.models.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getVideoDuration, uploadOnCloudinary } from "../utils/cloudinary.js";
import { DeleteOldAsset } from "../utils/deleteOldAsset.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //   validation - not empty
  if (
    [title, description].some(
      (field) => field?.trim() === "" || field?.trim() === undefined
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // extract the localpath from multer uploads
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // verify if localpath exists
  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Videofile and thumbnail must be provided");
  }

  // upload on cloudinary
  const video = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  // check if files uploaded
  if (!video || !thumbnail) {
    throw new ApiError(
      500,
      "Videofile and thumbnail could not be uploaded to server"
    );
  }

  const duration = await getVideoDuration(video.public_id);

  // create a Video object
  let vid = await Video.create({
    videoFile: video?.url || "",
    thumbnail: thumbnail?.url || "",
    title,
    description,
    videoFilePublicId: video.public_id,
    thumbnailPublicId: thumbnail.public_id,
    duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, { vid }, "Video added successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video id parameter is missing. ");
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Invalid video Id");
  }

  res.status(200).json(new ApiResponse(200, video, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(204, "Need to provide videoId ");
  }
  const videoFileLocalPath = req.file?.path;
  // console.log({ videoId, videoFileLocalPath });

  const prevVideo = await Video.findById(videoId);

  if (!videoFileLocalPath) {
    throw new ApiError(204, "Need to provide VideofileLocalPath");
  }

  const vid = await uploadOnCloudinary(videoFileLocalPath);

  if (!vid) {
    throw new ApiError(500, "Videofile could not be uploaded to server");
  }

  // remove old vide from cloudinary
  DeleteOldAsset(prevVideo.videoFilePublicId);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { videoFile: vid.url, videoFilePublicId: vid.public_id },
    },
    { new: true }
  );
  res.status(200).json(new ApiResponse(200, video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video id parameter is missing. ");
  }

  // Check if video exists
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Delete video from Cloudinary
  await DeleteOldAsset(video.videoFilePublicId);

  // Delete thumbnail from Cloudinary
  await DeleteOldAsset(video.thumbnailPublicId);

  // Delete video from db
  await Video.findByIdAndDelete(videoId);

  res.status(200).json({
    success: true,
    message: "Video deleted successfully",
  });
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo
};

