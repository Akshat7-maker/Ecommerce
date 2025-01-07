import { Coupon } from "../models/coupon.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


// create coupon
const createCoupon = asyncHandler(async (req, res, next) => {
    const {code, discount, expirationDate} = req.body;
    console.log(code, discount, expirationDate);

    const[day, month, year] = expirationDate.split("-");
    

    if(!code || !discount || !expirationDate) {
        throw new ApiError(400, "Please fill all the fields")
    }

    // check if code already exists
    const coupon = await Coupon.findOne({code: code.toLowerCase()});
    if(coupon) {
        throw new ApiError(400, "Coupon code already exists")
    }

    // create coupon
    const newCoupon = await Coupon.create({
        owner: req.user._id,
        code: code.toLowerCase(),
        discount,
        expirationDate: new Date(year, month - 1, day,12,0,0) 
    })

    return res
    .status(200)
    .json(new ApiResponse(200, newCoupon, "Coupon created successfully"))
})

// get all coupons
const getAllCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find({
        owner: req.user._id
    });
    return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupons fetched successfully"))
})

// get single coupon
const getCoupon = asyncHandler(async (req, res, next) => {
    const {couponId} = req.params;

    if(!couponId) {
        throw new ApiError(400, "Please provide a coupon id")
    }
    // check if coupon exists

    const coupon = await Coupon.findById(couponId);
    if(!coupon) {
        throw new ApiError(404, "Coupon not found")
    }

    // check if coupon is less valid through expiration date

    const today = new Date();
    const expirationDate = new Date(coupon.expirationDate);
    

    // Normalize both dates to ignore time part
    today.setHours(0, 0, 0, 0);
    expirationDate.setHours(0, 0, 0, 0);



    if(today.getTime() === expirationDate.getTime()) {

        return res
        .status(200)
        .json(new ApiResponse(200, "Coupon is valid only for today"))
        
    }
    else if(today > expirationDate) {
        return res
        .status(200)
        .json(new ApiResponse(200, "Coupon is not valid anymore"))
    }

    // return coupon discount
    return res
    .status(200)
    .json(new ApiResponse(200, coupon.discount, "Coupon fetched successfully"))
})



// update coupon
const updateCoupon = asyncHandler(async (req, res, next) => {
    const {couponId} = req.params;
    const {code, discount, expirationDate} = req.body;
    // console.log(code, discount, expirationDate);

    const[day, month, year] = expirationDate?.split("-")

    if(!couponId) {
        throw new ApiError(400, "Please provide a coupon id")
    }

    // check if coupon exists
    const coupon = await Coupon.findById(couponId);
    if(!coupon) {
        throw new ApiError(404, "Coupon not found")
    }

    // check code already exists
    const existingCoupon = await Coupon.findOne({code: code?.toLowerCase()});
    if(existingCoupon) {
        throw new ApiError(400, "Coupon code already exists")
    }

    // check the details 
    if([code, expirationDate].every((field) => !field?.trim()) &&
         (discount === undefined || discount === null || discount === "")) {
        throw new ApiError(400, "Please enter at least one field you want to update")
    }

    if(code?.trim()) coupon.code = code.trim().toLowerCase();
    if(discount !== undefined && discount !== null) coupon.discount = discount;
    if(expirationDate) coupon.expirationDate = new Date(year, month - 1, day,12,0,0);

    // update coupon
    await coupon.save();

    return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon updated successfully"))
})


// delete coupon
const deleteCoupon = asyncHandler(async (req, res, next) => {
    const {couponId} = req.params;

    if(!couponId) {
        throw new ApiError(400, "Please provide a coupon id")
    }

    // check if coupon exists
    const coupon = await Coupon.findById(couponId);
    if(!coupon) {
        throw new ApiError(404, "Coupon not found")
    }

    // delete coupon
    await coupon.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, "Coupon deleted successfully"))
})

const allCouponControllers = {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon
}

export default allCouponControllers