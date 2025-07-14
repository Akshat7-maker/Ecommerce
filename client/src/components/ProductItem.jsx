import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cartActions } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import api from "../api/api";
import { useSelector } from "react-redux";
import { myCartActions } from "@/store/myCartSlice";
import toast from "react-hot-toast";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Star } from "lucide-react";

function ProductItem({ product }) {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const addToCart = async (product) => {
    console.log("Product ID:", product);
    // dispatch(cartActions.addToCart({...product, quantity: 1}));
    try {
      setIsDisabled(true);
      const cart = await api.addToCart( product._id);
      if (cart) {
        toast.success("Product added from cart");
        dispatch(myCartActions.setCart(cart));
      }

      setIsDisabled(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    // <div
    //   key={product._id}
    //   className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105  transition duration-300"
    // >
    //   <Link to={`/product-info/${product?._id}`}>
    //     <img
    //       src={product?.images?.coverPic}
    //       alt={product?.description}
    //       className="w-full h-48 object-cover hover:scale-105 transition duration-300"
    //     />
    //   </Link>
    //   <div className="p-4">
    //     <h2 className="text-lg font-semibold mb-2">{product?.name}</h2>
    //     <div className="flex items-center gap-2">
    //       <Stack spacing={1}>
    //         <Rating
    //           name="half-rating-read"
    //           defaultValue={product?.avgRating || 0}
    //           precision={0.5}
    //           readOnly
    //         />
    //       </Stack>
    //       <span>({product?.reviewCount || 0})</span>
    //     </div>
    //     <p className="text-gray-600">${product?.price?.toFixed(2)}</p>
    //     <button
    //       disabled={isDisabled}
    //       onClick={() => addToCart(product)}
    //       className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
    //     >
    //       Add to Cart
    //     </button>
    //   </div>
    // </div>

    <div
      key={product.name}
      className="group rounded-lg border border-gray-200 bg-white overflow-hidden"
    >
      <div className="relative aspect-square">
        <Link to={`/product-info/${product?._id}`}>
        <img
          src={product?.images?.coverPic}
          alt={product?.description}
          width={400}
          height={400}
          className="object-cover transition-transform group-hover:scale-105"
        />
        </Link>
        {product.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Stack spacing={1}>
              <Rating
                name="half-rating-read"
                defaultValue={product?.avgRating || 5}
                precision={0.5}
                readOnly
              />
            </Stack>
          </div>
          <span className="text-sm text-gray-500">({product?.reviewCount || 5})</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {product?.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="font-bold text-xl">₹{product?.price}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product?.oldPrice || 0}
              </span>
            )}
          </div>
          <button 
          onClick={()=> addToCart(product)}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;


