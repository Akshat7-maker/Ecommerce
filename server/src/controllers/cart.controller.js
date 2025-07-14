import asyncHandler from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.model.js";
import e from "express";

// get cart
const getCart = asyncHandler(async (req, res, next) => {
  const  userId  = req.user._id;
  // console.log(userId);

  if (!userId) {
    throw new ApiError(400, "Please provide a user id");
  }

  let userCart;
  // find a cart by user id
  userCart = await Cart.findOne({ user: userId }).populate(
    "cartItems.productId",
    "name images price _id"

  );

  // if cart not found, create a new cart for the user
  if (!userCart) {
    console.log("user cart not found");
    userCart = await Cart.create({
      user: userId,
      cartItems: []
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userCart, "Cart fetched successfully"));
});

// add to cart
const addToCart = asyncHandler(async (req, res, next) => {
  const userId = req.user._id
  const { productId, quantity } = req.body;
  console.log(userId, productId, quantity);
  if(!userId) {
    throw new ApiError(400, "Please provide a user id");
  }

  if(!productId || !quantity) {
    throw new ApiError(400, "Please provide a product id and quantity");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check if user has cart
  let cart = await Cart.findOne({ user: userId });

  // if cart not found, create a new cart for the user
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartItems: []
    });
  }

  // check if product is already in cart

  const existingProduct = cart.cartItems.find(
    (item) => item.productId.toString() === productId
  )

  if(existingProduct) {
    existingProduct.quantity += quantity;
  }else{
    cart.cartItems.push({
      productId: productId,
      quantity: quantity,
      price: product.price  
    })
  }

  // update total amount
  cart.totalAmount += product.price * quantity;
  cart.totalQuantity += quantity;

  // save cart
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "cartItems.productId",
    "name images price _id"
  );

  // return response
  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Product added to cart successfully"));
  

  // this apprach has less number of db ca
  // there is one more approach to solve  this add to product to cart problem
  


  // let cart = await Cart.findOneAndUpdate(
  //   { user: userId, "cartItems.productId": productId },
  //   {
  //     $inc:{
  //       "cartItems.$.quantity": quantity,
  //       totalAmount: product.price * quantity,
  //       totalQuantity: quantity
  //     }
  //   },
  //   { new: true }
  // )

  // if(!cart) {
  //   cart = await Cart.findOneAndUpdate(
  //     { user: userId },
  //     {
  //       $push: {
  //         cartItems: {
  //           productId: productId,
  //           quantity: quantity,
  //           price: product.price
  //         }
  //       },
  //       $inc: {
  //         totalAmount: product.price * quantity,
  //         totalQuantity: quantity
  //       }
  //     },
  //     { new: true , upsert: true } // Create the cart if it doesn't exist
  //   )
  // }

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, cart, "Product added to cart successfully"));
 


  // read it carefully about upsert
  // How upsert Handles Cart Creation

  //   findOneAndUpdate with upsert: true:
  //       If no cart exists for the user, a new cart will be created with the specified userId and the first product added to it.
  //       This eliminates the need for a separate find or create call to check whether a cart exists.

  //   Advantages:
  //       Minimizes database calls: No need to first check if the cart exists and then create it.
  //       Atomic operation: Ensures the cart is created and updated in a single database interaction.
});

// delete from cart
const deleteFromCart = asyncHandler(async (req, res, next) => {
  const { productId} = req.params;
  const userId = req.user._id

  console.log(userId, productId);

  if (!productId) {
    throw new ApiError(400, "Please provide a product id");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check if user has cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // find the product in the cart

  // const existingProduct = cart.cartItems.find(
  //   (item) => item.productId.toString() === productId
  // );

  const existingProductIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingProductIndex == -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // access the existing product in the cart
  const existingProduct = cart.cartItems[existingProductIndex];


  // Decrement the quantity or remove the product if the quantity is 1
  if(existingProduct.quantity === 1) {
    cart.cartItems.splice(existingProductIndex, 1);
    
  }else{
    existingProduct.quantity -= 1;
    
  }


  // update total amount
  cart.totalAmount -= product.price;
  cart.totalQuantity -= 1;


  // // Delete the cart if it's empty after removing the product
  // if (cart.cartItems.length === 0) {
  //   cart.totalAmount = 0;
  //   cart.totalQuantity = 0;
  // }

  // Save the updated cart
  await cart.save();

  
  const populatedCart = await Cart.findById(cart._id).populate(
    "cartItems.productId",
    "name images price _id"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, populatedCart.cartItems.length === 0 ? "Cart is now empty" :"Product deleted from cart successfully"));


  // let cart = await Cart.findOneAndUpdate(
  //   { user: req.user._id, "cartItems.productId": productId },
  //   {
  //     $inc: { "cartItems.$.quantity": -1, totalAmount: -product.price },
  //   },
  //   { new: true }
  // );

  // if (!cart) {
  //   throw new ApiError(404, "Cart not found");
  // }

  // if (
  //   cart.cartItems.some(
  //     (item) => item.productId.toString() === productId && item.quantity === 0
  //   )
  // ) {
  //   cart = await Cart.findOneAndUpdate(
  //     { user: req.user._id, "cartItems.productId": productId },
  //     {
  //       $pull: { cartItems: { productId: productId } },
  //     },
  //     { new: true }
  //   );
  // }

  // if(cart.cartItems.length === 0){
  //   cart = await Cart.findOneAndDelete({ user: req.user._id });
  // }

  // return res
  //   .status(200)
  //   .json(new ApiResponse(200, cart, "product deleted succesfuly"));
});

// remove from cart
const removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId} = req.params;
  const userId = req.user._id

  console.log(userId, productId);

  if (!productId) {
    throw new ApiError(400, "Please provide a product id");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // check if user has cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // find the product in the cart
  const existingProductIndex = cart.cartItems.findIndex(
    (item) => item.productId.toString() === productId
  )

  if (existingProductIndex == -1) {
    throw new ApiError(404, "Product not found in cart");
  }

  // access the existing product in the cart
  const existingProduct = cart.cartItems[existingProductIndex];

  // remove the product from the cart
  cart.cartItems.splice(existingProductIndex, 1);

  // update total amount
  cart.totalAmount -= product.price * existingProduct.quantity;
  cart.totalQuantity -= existingProduct.quantity;

  await cart.save();

  
  const populatedCart = await Cart.findById(cart._id).populate(
    "cartItems.productId",
    "name images price _id"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, populatedCart, populatedCart.cartItems.length === 0 ? "Cart is now empty" :"Product deleted from cart successfully"));

})

// reset cart
const resetCart = asyncHandler(async (req, res, next) => {
  const  userId  = req.user._id;
  const cart = await Cart.findOneAndDelete({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const newCart = await Cart.create({
    user: userId,
    cartItems: [],
    totalAmount: 0,
    totalQuantity: 0,
  })
  return res
    .status(200)
    .json(new ApiResponse(200, newCart, "Cart reset successfully"));
});

const allCartContoller = {
  addToCart,
  getCart,
  deleteFromCart,
  removeFromCart,
  resetCart
};

export default allCartContoller;
