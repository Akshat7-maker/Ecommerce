import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";


// middleware to check if user is admin 
const isAdmin = asyncHandler(async (req, res, next) => {

    if(req.user.isAdmin) {
        next();
    } else {
        throw new ApiError(403, "You are not authorized to access this resource")
    }
})

export default isAdmin

