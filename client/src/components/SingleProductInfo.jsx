
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { cartActions } from "../store/cartSlice";
import Loader from "./Loader";
import toast from "react-hot-toast";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

export default function SingleProductInfo() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate()

  // Fetch single product details
  const getSingleProduct = async () => {
    try {
      setLoading(true);
      const product = await api.getProductById(productId);
      setProduct(product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for the product
  const getReviews = async () => {
    try {
      const reviews = await api.getAllReviews(productId);
      setReviews(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch user-specific review
  const getUserReview = async () => {
    try {
      const review = await api.getUserReview(productId);
      if (review) {
        setUserReview(review);
        setRating(review.rating);
        setComment(review.comment);
      } else {
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    try {
      if(!user) {
        toast.error("to submit review login first")
        return
      }
      await api.createReview(productId,rating, comment);
      toast.success("Review submitted successfully!");
      getReviews();
      getUserReview();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    }
  };

  // Handle review update
  const handleReviewUpdate = async () => {
    try {
      await api.updateReview(userReview._id, rating, comment);
      toast.success("Review updated successfully!");
      getReviews();
      getUserReview();
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review.");
    }
  };

  // Handle review deletion
  const handleReviewDelete = async () => {
    try {
      await api.deleteReview(userReview._id);
      toast.success("Review deleted successfully!");
      getReviews();
      getUserReview();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review.");
    }
  };

  // Add product to cart
  const addToCart = async (product) => {
    try {
      if(!user){
        toast.error("first login")
        navigate("/login")
        return        
      }
      setIsDisabled(true);
      await api.addToCart(product._id, quantity);
      dispatch(cartActions.addToCart({ ...product, quantity }));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setIsDisabled(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  useEffect(() => {
    getSingleProduct();
    getReviews();
    getUserReview();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading...</h1>
          <Loader fullScreen={true} text="Fetching Product Details" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.images?.coverPic || "default-image.jpg"}
            alt={product.name || "No description available"}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Stack spacing={1}>
              <Rating
                name="half-rating-read"
                value={
                  reviews.length
                    ? reviews.reduce((total, review) => total + review.rating, 0) /
                    reviews.length
                    : 0
                }
                precision={0.5}
                readOnly
              />
            </Stack>
            <span className="text-sm text-gray-500 ml-2">({reviews.length})</span>
          </div>
          <p className="text-2xl font-semibold mb-4">₹{product.price.toFixed(2)}</p>
          <p className="text-gray-700 mb-6 mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap font-mono">
            {product.description}
          </p>

          {/* Quantity Input */}
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 px-2 py-1 border rounded"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            disabled={isDisabled}
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* User Review Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Review</h2>
        <div className="flex items-center mb-4">
          <label htmlFor="rating" className="mr-4">
            Rating:
          </label>
          <Rating
            name="user-rating"
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5}
          />
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Write your review here..."
        ></textarea>
        {!userReview ? (
          <button
            disabled={!rating || !comment}
            onClick={handleReviewSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
          >
            Submit Review
          </button>
        ) : (
          <>
            <button
              disabled={!rating || !comment}
              onClick={handleReviewUpdate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
            >
              Update Review
            </button>
            <button
              onClick={handleReviewDelete}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 mt-4"
            >
              Delete Review
            </button>
          </>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
          {reviews.length > 0 ? (
            reviews?.map((review, index) => (
              <div
                key={review._id || index}
                className="border rounded-lg p-4 mb-4 shadow-sm bg-gray-50"
              >
                <div className="flex items-center mb-2">
                  <strong className="mr-4">{review.user?.name || "Anonymous"}</strong>
                  <Rating
                    name={`read-only-${index}`}
                    value={review.rating}
                    readOnly
                    precision={0.5}
                  />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
}
