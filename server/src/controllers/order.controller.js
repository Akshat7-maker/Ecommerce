import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {Product }from "../models/product.model.js";
import mongoose from "mongoose";


// create order
const createOrder = asyncHandler(async (req, res, next) => {
    console.log("createOrder");
    // console.log(req.body);
    const{ paymentDetails: paymentInfo,
        shippingInfo,
        orderItems,
        totalAmount,
        totalQuantity,
        user,
        paymentMethod,
        paymentStatus 
    } = req.body;

    // console.log(paymentInfo,
    //     shippingInfo,
    //     orderItems,
    //     totalAmount,
    //     totalQuantity,
    //     user,
    //     paymentMethod,
    //     paymentStatus);

    // validate req fields
    if(!paymentInfo || !shippingInfo || !orderItems || !totalAmount || !totalQuantity || !user) {
        throw new ApiError(400, "Please fill all the fields")
    }

    // validate order items 
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        throw new ApiError(400, "Order items are required and must be an array.");
    }

    orderItems.forEach((item) => {
        if (!item.productId || !item.quantity || !item.price) {
          throw new ApiError(400, "Each order item must have productId, quantity, and price.");
        }

        if(!mongoose.Types.ObjectId.isValid(item.productId)) {
            throw new ApiError(400, "Each order item must have a valid productId.");
        }
      });

    // validate user
    if(!mongoose.Types.ObjectId.isValid(user)) {
        throw new ApiError(400, "Invalid user id");
    }
        


    const order = await Order.create({
        user,
        orderItems,
        shippingInfo,
        paymentMethod,
        paymentStatus,
        paymentInfo,
        totalAmount,
        totalQuantity,
        orderDate: new Date(),
        orderDeliveryStatus: "pending",
    });

    if(!order) {
        console.log("order not created");
        throw new ApiError(400, "Order not created")
    }

    // console.log(order);
    // reduce stock
    // do not use foreach because it does not work with asynchronous code
    // instead use classic for loop


    // order.orderItems.forEach(async (item) => {
    //     const product = await Product.findById(item.productId);
    //     if (product) {
    //       product.stock -= item.quantity;
    //       await product.save();
    //     }
    //   });


    for (let i = 0; i < order.orderItems.length; i++) {
        const item = order.orderItems[i];
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }

    return res
    .status(200)
    .json(new ApiResponse(200, order, "order created successfully"));

});

// get my orders
const myOrder = asyncHandler(async (req, res, next) => {
    const userId  = req.user._id
    console.log(userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5 ;

    const total = await Order.countDocuments({ user: userId });
    const orders = await Order.find({ user: userId })
    .populate("orderItems.productId")
    .skip((page - 1) * limit)
    .limit(limit);

    const dataToSend = {
        orders,
        total,
        limit,
        page,
        totalPages : Math.ceil(total / limit)
    }

    return res
    .status(200)
    .json(new ApiResponse(200, dataToSend, "Orders fetched successfully" ));



    // const orders = await Order.find({ user: userId }).populate("orderItems.productId");
    // // console.log(orders);
    // return res
    // .status(200)
    // .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getRecentOrders = asyncHandler(async (req, res, next) => {
    const  userId  = req.user._id;

    const totalOrders = await Order.countDocuments({ user: userId });
    const orders = await Order.find({ user: userId })
    .populate("orderItems.productId")
    .sort({ orderDate: -1 })
    .limit(2);

    const dataToSend = {
        orders,
        totalOrders,
    }

    return res
    .status(200)
    .json(new ApiResponse(200, dataToSend, "Orders fetched successfully"));

    
})
// get order by id
const getOrderById = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params
    // console.log(orderId);

    // check if id is valid
    if(!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(400, "Invalid order id")
    }

    if(!orderId) {
        throw new ApiError(400, "Please provide a order id")
    }

    const order = await Order.findById(orderId).populate("orderItems.productId");
    // console.log(orders);

    if(!order) {
        throw new ApiError(404, "Order not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// get all orders for admin
const getAllOrdersOfAdmin = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5 ;
    
    const orders = await Order.find({})
    .select("_id orderDate orderDeliveryStatus paymentStatus totalAmount paymentMethod")
    // .skip((page - 1) * limit)
    // .limit(limit)
    // .populate("orderItems.productId" , "name images price _id")
    // .populate("user", "name email");
    // console.log(orders);
    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
})

const getRecentOrdersOfAdmin = asyncHandler(async (req, res, next) => {

    const orders = await Order.find({})
    .select("_id orderDate orderDeliveryStatus paymentStatus totalAmount paymentMethod")
    .sort({ orderDate: -1 })
    .limit(2);
    // console.log(orders);
    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
})

// process order
const processOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params
    // console.log(orderId);
    const order = await Order.findById(orderId);
    if(!order) {
        throw new ApiError(404, "Order not found")
    }

    if(order.orderDeliveryStatus === "delivered") {
        throw new ApiError(400, "Order already delivered")
    }

    switch(order.orderDeliveryStatus) {
        case "pending":
            order.orderDeliveryStatus = "shipped";
            break;
        case "shipped":
            order.orderDeliveryStatus = "delivered";
            break;
        default:
            order.orderDeliveryStatus = "delivered";
            break;
    }

    await order.save();

    return res
    .status(200)
    .json(new ApiResponse(200, order, "Order processed successfully"));    
})

// delete order 
const deleteOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params
    // console.log(orderId);
    const order = await Order.findByIdAndDelete(orderId);
    if(!order) {
        throw new ApiError(404, "Order not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, order, "Order deleted successfully"));
})

export const allOrderControllers = {
    createOrder,
    myOrder,
    getOrderById,
    getAllOrdersOfAdmin,
    processOrder,
    deleteOrder,
    getRecentOrders,
    getRecentOrdersOfAdmin
}

export default allOrderControllers