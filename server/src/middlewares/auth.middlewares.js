import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/apiError.js";

const verifyUser = asyncHandler(async (req, res, next) => {
    // console.log("verifyUser",req);
    const token = req.cookies.accessToken;

    if(!token) {
        throw new ApiError(401, "Please login to access this resource")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
    // console.log("decodedToken",decodedToken);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
    if(!user) {
        throw new ApiError(401, "Please login to access this resource")
    }

    req.user = user;
    next();
})

export default verifyUser