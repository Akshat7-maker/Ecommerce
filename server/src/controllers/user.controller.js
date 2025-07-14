import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const genrateAccessTokenRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.genrateAccessToken();
    const refreshToken = await user.genrateRefreshToken();

    // console.log("before saving refresh token",user)
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log("after saving refresh token",user)

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
const registerUser = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const { name, email, password, gender } = req.body;
  // console.log(req.file );
  // console.log(name, email, password, gender);

  // check if all the fields are filled
  if (!name || !email || !password || !gender) {
    throw new ApiError(400, "Please fill all the fields");
  }

  // check if user already exists
  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(400, "User with this email exists");
  }

  // check if user has uplaoded a profile pic
  let coverPicLocalPath;
  if (req.file?.path) {
    coverPicLocalPath = req.file.path;
  }

  // uplaod on cloudinary
  const coverPicUrl =
    coverPicLocalPath && (await uploadOnCloudinary(coverPicLocalPath));

  // create user
  const newUser = await User.create({
    name,
    email,
    password,
    gender,
    coverPic: coverPicUrl?.url || null,
  });

  // remove field that you dont want to send to the client eg: password, refreshToken etc
  const userDetailsToSend = await User.findById(newUser._id).select(
    "-password"
  );

  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, userDetailsToSend, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  // take data from request
  // check if user exists
  // check if password is correct
  // create access token and refresh token for the user
  // add refresh token to the user
  // send cookies
  // send response

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password");
  }

  const { accessToken, refreshToken } = await genrateAccessTokenRefreshToken(
    user._id
  );
  const options = {
    maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
    httpOnly: true, // Cookie is not accessible via JavaScript
    secure: false, // Cookie is sent only over HTTPS
    sameSite: "Strict", // Restricts the cookie to same-site requests
  };

  const loggedInUser = await User.findById(user._id).select("-password");
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  // set refresh token to null
  // clear cookies

  // console.log(req);
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: null },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const changeAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.isAdmin = !user.isAdmin;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User admin status changed successfully"));
});

const editProfile = asyncHandler(async (req, res, next) => {
    let userId = req.user._id
    console.log(userId)
  const { name, email, oldpassword, newpassword, gender } = req.body;

  // check if user has uplaoded a profile pic
  let coverPicLocalPath = null;
  if (req.file?.path) {
    coverPicLocalPath = req.file.path;
  }

  // check if user has uplaoded atleast one field
  if (
    !name &&
    !email &&
    !gender &&
    !coverPicLocalPath &&
    !oldpassword &&
    !newpassword
  ) {
    throw new ApiError(400, "Please fill at least one field");
  }

  // check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  if (newpassword && oldpassword) {
    // check if password is correct
    const isPasswordCorrect = await user.matchPassword(oldpassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect password");
    }
  }

  // uplaod on cloudinary
  const coverPicUrl =coverPicLocalPath && (await uploadOnCloudinary(coverPicLocalPath));



  const updateFields = {};

  if(name?.trim()) updateFields.name = name.trim();
  if(email?.trim()) updateFields.email = email.trim();
  if(gender?.trim()) updateFields.gender = gender.trim();

  if (coverPicUrl?.url) {
    updateFields.coverPic = coverPicUrl.url;
  }

  if(newpassword && oldpassword) {
    updateFields.password = newpassword;
  }

  // update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true }
  );

  // remove field that you dont want to send to the client eg: password, refreshToken etc
  const userDetailsToSend = await User.findById(updatedUser._id).select(
    "-password"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, userDetailsToSend, "User updated successfully"));
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const allUserControllers = {
  registerUser,
  loginUser,
  logoutUser,
  changeAdmin,
  editProfile,
  getAllUsers,
};

export default allUserControllers;

// **************** syntax to send cookies *******************
// res.cookie("name", "value", options);
// app.get('/set-cookie', (req, res) => {
//     // Set a cookie called 'token' with a value of 'abc123'
//     res.cookie('token', 'abc123', {
//       maxAge: 24 * 60 * 60 * 1000,  // Cookie expires in 1 day
//       httpOnly: true,               // Cookie is not accessible via JavaScript (security feature)
//       secure: true,                 // Cookie is sent only over HTTPS
//       sameSite: 'Strict'            // Restricts the cookie to same-site requests
//     });

//     res.send('Cookie has been set');
//   });

// Explanation of Options:

//     maxAge: Specifies how long the cookie is valid in milliseconds.
//     httpOnly: Makes the cookie inaccessible to JavaScript, helping prevent cross-site scripting (XSS) attacks.
//     secure: Ensures the cookie is only sent over HTTPS.
//     sameSite: Controls whether the cookie is sent with cross-site requests. "Strict" limits the cookie to same-site requests, while "Lax" or "None" allows it in more scenarios.
