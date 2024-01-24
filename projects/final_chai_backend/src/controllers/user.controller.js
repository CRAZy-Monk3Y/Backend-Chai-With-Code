import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //   get user details from req
  const { username, email, fullName, password } = req.body;
  console.log({ username, email, fullName, password });
  //   validation - not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if already exists: username , email
  const existingUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with same credentials already exists");
  }
  //   check for images, check for avatar
  const avatarImageLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Avatar image not provided");
  }
  // upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarImageLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar image not provided");
  }
  console.log(avatar);
  //   create User object  - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //   remove password & refresh token field from response
  // check for creation response
  const savedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!savedUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // return response
  res
    .status(201)
    .json(new ApiResponse(200, savedUser, "User registered successfully"));
});

export { registerUser };
