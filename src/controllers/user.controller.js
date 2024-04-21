import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  //validation - not empty
  //check if user already exist : username : email
  //check for images and chek for avatar
  // upload them in cloudinary
  //create user object - create entry in db
  //remove pass and refresh token fiend from response
  //check for user creation
  //response

  const { fullName, email, username, password } = req.body;

  console.log("username :", username);
  console.log("pass :", password);

  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username is already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is reqired");
  }
  if (!coverImagePath) {
    throw new ApiError(400, "coverImage file is reqired");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is reqired");
  }

  if (!coverImage) {
    throw new ApiError(400, "Cover file is reqired");
  }

  const user = await User.create({
    fullName,
    avatarUrl: avatar.url,
    coverImageUrl: coverImage.url || "",
    username: username,
    email,
    password,
  });


  const createdUser = await User.findById(user._id).select("-password -refreshToken");

if (!createdUser) {
  throw new ApiError(500, "something went wrong");
}

return res.status(201).json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registerUser };
