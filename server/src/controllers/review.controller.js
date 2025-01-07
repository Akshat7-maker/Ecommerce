import asyncHandler from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";

// create review
const createReview = asyncHandler(async (req, res, next) => {
  const { productId,userId } = req.params;
  const { rating, comment } = req.body;

  console.log(rating, comment);

  // user is only allowed to create one review for a product
  const existingReview = await Review.findOne({
    product: productId,
    // user: req.user._id,
    user: userId
  });

  if (existingReview) {
    throw new ApiError(
      400,
      "You have already created a review for this product"
    );
  }

  // check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check if all the fields are filled
  if (!rating || !comment) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const review = await Review.create({
    product: productId,
    // user: req.user._id,
    user: userId,
    rating,
    comment,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review created successfully"));
});

// get all reviews
const getAllReviews = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Please provide a product id");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const reviews = await Review.find({ product: productId }).populate("user", "name");
  // console.log(reviews);
  if (!reviews) {
    throw new ApiError(404, "Reviews not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// get a single review
const getReviewOfUser = asyncHandler(async (req, res, next) => {
  const { productId,userId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Please provide a product id");
  }

  const review = await Review.findOne({
    product: productId,
    user: userId
  })

  // if (!review) {
  //   throw new ApiError(404, "Review not found");
  // }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfully"));
  
})

// update review
const updateReview = asyncHandler(async (req, res, next) => { 
  const { reviewid, userId } = req.params;
  const { rating, comment } = req.body;

  if (!rating && !comment) {
    throw new ApiError(400, "Please fill at least one of the fields");
  }

  if (!reviewid) {
    throw new ApiError(400, "Please provide a review id");
  }

  const review = await Review.findOne({
    _id: reviewid,
    user: userId
  });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  await review.save();

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));

  

});

// delete review
const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewid } = req.params;

  if (!reviewid) {
    throw new ApiError(400, "Please provide a review id");
  }

  const review = await Review.findByIdAndDelete(reviewid);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const allReviewControllers = {
  createReview,
  getAllReviews,
  deleteReview,
  getReviewOfUser,
  updateReview
};

export default allReviewControllers;
