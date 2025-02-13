import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await user.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token and access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({
  //   message: "coffee",
  // });

  //get user details from frontend
  //validation - not empty
  //check if user is already exists: user, email
  //check for image , check for avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in db
  //remove password and refresh token field from response
  //check for user validation
  //return response

  //1. get user details from frontend

  const { fullName, email, username, password } = req.body;
  console.log("email", email);

  //2. validation - not empty

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //3. check if user is already exists: user, email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(existedUser);
  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }

  console.log(req.files);

  //4. check for image , check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.files.coverImage[0].path;
  // }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file is required");

  //create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

//login

const loginUser = asyncHandler(async, (req, res) => {});
//req body -> data
//username or email
//find the user
//password check
//access and refresh token
//send cookies

//req body -> data
const { email, username, password } = req.body;

// if user/ email is not find
if (!username || !email) {
  throw new ApiError(400, "username or email is not present");
}

//
const user = await User.findOne({
  $or: [{ username }, { email }],
});

if (!user) {
  throw new ApiError(404, "user does not exist ");
}

const isPasswordValid = await user.isPasswordCorrect(password);

if (!isPasswordValid) {
  throw new ApiError(401, "password is incorrect");
}

const { accessToken, refreshToken } = await generateAccessAndRefereshToken(
  user._id,
);

const loggedInUser = await User.findById(user._id),select(
  "-password -refeshToken"
)

const option = {
  httpOnly: true,
  secure:true
}
return res
.status(200)
.cookie("accessToken", accessToken, option)
.cookie("refreshToken", refreshToken, option)
.json(
  new ApiResponse(
    200,
    {
      user: loggedInUser.accessToken,
      refreshToken
    },
    "User logged in  SUCCESSFULLY"
  )
)


export { registerUser, loginUser };
