// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/api";
// import { useDispatch, useSelector } from "react-redux";
// import { cartActions } from "../store/cartSlice";
// import Loader from "./Loader";
// import { set } from "react-hook-form";
// import toast from "react-hot-toast";
// import Rating from "@mui/material/Rating";
// import Stack from "@mui/material/Stack";

// // Dummy product data (replace with your actual data source)

// export default function SingleProductInfo() {
//   const { productId } = useParams();
//   // const { loading, error, withLoader } = useLoader();


//   const [quantity, setQuantity] = useState(1);
//   const [product, setProduct] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [reviews, setReviews] = useState([]);
//   const [userReview, setUserReview] = useState(null);
//   const [comment, setComment] = useState("");
//   const [isDisabled, setIsDisabled] = useState(false);
//   const [rating, setRating] = useState(1);
//   const {user} = useSelector((state) => state.auth);
//   const dispath = useDispatch();

//   // call api to get info of single product
//   const getSingleProduct = async () => {
//     try {
//       setLoading(true);
//       const product = await api.getProductById(productId);
//       console.log(product);
//       setProduct(product);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//     finally{
//       setLoading(false);
//     }
//   };

//   // call api to get reviews of single product
//   const getReviews = async () => {
//     try {
//       const reviews = await api.getAllReviews(productId);
//       setReviews(reviews);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // call api to get user reviews of single product

//   const getUserReview = async () => {
//     try {
//       setRating(1);
//       setComment("");
//       const review = await api.getUserReview(productId,user._id);
//       console.log("reviews",review);
//       if(review === null){
//         setUserReview(null);
//       }else{
//         setUserReview(review);
//         setRating(review.rating);
//         setComment(review.comment);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };



//   const handleQuantityChange = (e) => {
//     setQuantity(Math.max(1, parseInt(e.target.value) || 1));
//   };

//   // call api to create review
//   const handleReviewSubmit = async ()=>{

//     try {
//       const review = await api.createReview(productId,user._id, rating, comment);
//       getReviews();
//       getUserReview();
//       toast.success("Review created successfully!");
//       console.log(review);

//     } catch (error) {

//     }
//   }

//   // call api to delete review
//   const handleReviewDelete = async () => {

//     try {
//       console.log(userReview._id);
//       const review = await api.deleteReview(userReview._id);
//       getUserReview();
//       getReviews();
//       toast.success("Review deleted successfully!");
//       console.log(review);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleReviewUpdate = async () => {
//     try {
//       console.log(userReview,user._id, rating, comment);
//       setLoading(true);
//       const review = await api.updateReview(userReview._id,user._id, rating, comment);
//       getReviews();
//       toast.success("Review updated successfully!");
//       console.log(review);
//     } catch (error) {
//       console.log(error);
//     }finally{
//       setLoading(false);
//     }
//   };

//   const addToCart = async (product) => {
//     try {
//       setIsDisabled(true);
//       const cart = await api.addToCart(user._id, product._id, quantity);
//       if (!cart) {
//         return;
//       }

//     } catch (error) {
//       console.log(error);
//     }finally{
//       setIsDisabled(false);
//     }
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <span
//           key={i}
//           className={`text-xl ${
//             i <= rating ? "text-yellow-400" : "text-gray-300"
//           }`}
//         >
//           ★
//         </span>
//       );
//     }
//     return stars;
//   };

//   useEffect(() => {
//     getSingleProduct();
//     getReviews();
//     getUserReview();
//   }, [productId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
//           <Loader fullScreen={true} text="Fetching Product Details  " />
//         </div>
//       </div>
//     )
//   }

//   return (

//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row">
//             <div className="md:w-1/2">
//               <img
//                 src={product.images?.coverPic || "default-image.jpg"}
//                 alt={product.description || "No description available"}
//                 className="w-full h-auto object-cover rounded-lg shadow-md"
//               />
//             </div>
//             <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
//               <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//               <div className="flex items-center mb-4">
//                 {/* {renderStars(reviews.reduce((total, review) => total + review.rating, 0) / reviews.length)}
//                 <span className="ml-2 text-gray-600">
//                   ({reviews.length})
//                 </span> */}
//                 <Stack spacing={1}>
//                 <Rating
//                 name="half-rating-read"
//                 defaultValue={reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0}
//                 precision={0.5}
//                 readOnly
//               />
//               </Stack>
//               <span className="text-sm text-gray-500">({reviews.length})</span>
//               </div>
//               <p className="text-2xl font-semibold mb-4">
//                 ₹{product.price.toFixed(2)}
//               </p>
//               <p className="text-gray-700 mb-6 mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap font-mono">{product.description}</p>
//               <div className="flex items-center mb-6">
//                 <label htmlFor="quantity" className="mr-4">
//                   Quantity:
//                 </label>
//                 <input
//                   type="number"
//                   id="quantity"
//                   min="1"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   className="w-16 px-2 py-1 border rounded"
//                 />
//               </div>
//               <button
//                 // onClick={() =>
//                 //   dispath(cartActions.addToCart({ ...product, quantity }))
//                 // }
//                 disabled={isDisabled}
//                 onClick={()=> addToCart(product)}
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>

//           {/* {Current User Review Section} */}

//           {/* {check if user has already reviewed the product} */}

//           {/* if user has already reviewed the product */}
//           {/* show user review in your review section */}

//           {!userReview && (
//             <div className="mt-12">
//             <h2 className="text-2xl font-bold mb-4">Your Review</h2>
//             <div className="flex items-center mb-4">
//               <label htmlFor="rating" className="mr-4">
//                 Rating:
//               </label>
//               <input
//                 type="number"
//                 id="rating"
//                 min="1"
//                 max="5"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 className="w-16 px-2 py-1 border rounded"
//               />
//             </div>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="w-full p-2 border rounded"
//               placeholder="Write your review here..."
//             ></textarea>
//             <button
//               disabled={!rating || !comment}
//               onClick={handleReviewSubmit}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Submit Review
//             </button>
//           </div>
//           )}

//           {/* show user review in your review section 
//           so that user can update their review 
//           with rating and comment 
//           and update and delete their review */}

//           {userReview && (
//             <div className="mt-12">
//             <h2 className="text-2xl font-bold mb-4">Your Review</h2>
//             <div className="flex items-center mb-4">
//               <label htmlFor="rating" className="mr-4">
//                 Rating:
//               </label>
//               <input
//                 type="number"
//                 id="rating"
//                 min="1"
//                 max="5"
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 className="w-16 px-2 py-1 border rounded"
//               />
//             </div>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               className="w-full p-2 border rounded"
//               placeholder="Write your review here..."
//             ></textarea>
//             <button
//               disabled={!rating || !comment}
//               onClick={handleReviewUpdate}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Update Review
//             </button>
//             <button
//               onClick={handleReviewDelete}
//               className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Delete Review
//             </button>
//           </div>
//           )}











//         {/* {Customer Reviews Section} */}
//           <div className="mt-12">
//             <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
//             {reviews.length > 0 ? (
//               reviews.map((review) => (
//                 <div key={review.id} className="border-b border-gray-200 py-4">
//                   <div className="flex items-center mb-2">
//                     <span className="font-semibold mr-2">
//                       {review.user.name}
//                     </span>
//                     {renderStars(review.rating)}
//                   </div>
//                   <p className="text-gray-700">{review.comment}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No reviews yet.</p>
//             )}
//           </div>
//         </div>

//   );
// }

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      const review = await api.getUserReview(productId, user._id);
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
      await api.createReview(productId, user._id, rating, comment);
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
      await api.updateReview(userReview._id, user._id, rating, comment);
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
      setIsDisabled(true);
      await api.addToCart(user._id, product._id, quantity);
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
            reviews.map((review, index) => (
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
