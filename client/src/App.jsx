import React, { useState } from "react";
import { ShoppingCart, User, Home, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Outlet } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import SingleProductInfo from "./components/SingleProductInfo";
import  HomeComponent from "./pages/HomePage";
import CartItem from "./components/CartItem";
import OrdersList from "./components/OrderList";


// const ordersData = [
//   {
//     "shippingInfo": {
//       "address": "my new address",
//       "city": "xy",
//       "pincode": "322",
//       "country": "US"
//     },
//     "paymentInfo": {
//       "payment_id": "pay_PNP4yQELeG5qpK",
//       "order_id": "order_PNP4pp9Ekfu5Nu",
//       "signature": "0ab334cf9dfbe13e8445ebc083437f3567bf138b697f9bb54d06b532c5342cbf"
//     },
//     "_id": "673d52dd4b0b352b66bf58eb",
//     "user": "673373d5eeb6586caac89333",
//     "orderItems": [
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731549486/t15lwpwesd8hbirl85hg.jpg",
//             "otherPics": []
//           },
//           "_id": "6735592d07d8a0a0b8fb10a9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "men",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-14T01:58:05.931Z",
//           "updatedAt": "2024-11-20T04:01:54.574Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d52dd4b0b352b66bf58ec"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945255/zrexk1jq475r2b668dt2.png",
//             "otherPics": []
//           },
//           "_id": "673b6325defc3c93fd4257f6",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "women",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:13.368Z",
//           "updatedAt": "2024-11-20T04:01:54.568Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d52dd4b0b352b66bf58ed"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945292/ygi95kao1zgvoyz4q2gj.png",
//             "otherPics": []
//           },
//           "_id": "673b634adefc3c93fd4257f9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "electronics",
//           "stock": 14,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:50.496Z",
//           "updatedAt": "2024-11-20T04:01:54.571Z",
//           "__v": 0
//         },
//         "quantity": 2,
//         "price": 20,
//         "_id": "673d52dd4b0b352b66bf58ee"
//       }
//     ],
//     "totalAmount": 80,
//     "paymentMethod": "online",
//     "paymentStatus": "completed",
//     "orderDeliveryStatus": "pending",
//     "isDelivered": false,
//     "orderDate": "2024-11-20T03:09:17.490Z",
//     "createdAt": "2024-11-20T03:09:17.521Z",
//     "updatedAt": "2024-11-20T03:09:17.521Z",
//     "__v": 0
//   },
//   {
//     "shippingInfo": {
//       "address": "my new address",
//       "city": "xy",
//       "pincode": "322",
//       "country": "US"
//     },
//     "paymentInfo": {
//       "payment_id": "pay_PNP4yQELeG5qpK",
//       "order_id": "order_PNP4pp9Ekfu5Nu",
//       "signature": "0ab334cf9dfbe13e8445ebc083437f3567bf138b697f9bb54d06b532c5342cbf"
//     },
//     "_id": "673d5f2b441d09eff86a5558",
//     "user": "673373d5eeb6586caac89333",
//     "orderItems": [
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731549486/t15lwpwesd8hbirl85hg.jpg",
//             "otherPics": []
//           },
//           "_id": "6735592d07d8a0a0b8fb10a9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "men",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-14T01:58:05.931Z",
//           "updatedAt": "2024-11-20T04:01:54.574Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f2b441d09eff86a5559"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945255/zrexk1jq475r2b668dt2.png",
//             "otherPics": []
//           },
//           "_id": "673b6325defc3c93fd4257f6",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "women",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:13.368Z",
//           "updatedAt": "2024-11-20T04:01:54.568Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f2b441d09eff86a555a"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945292/ygi95kao1zgvoyz4q2gj.png",
//             "otherPics": []
//           },
//           "_id": "673b634adefc3c93fd4257f9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "electronics",
//           "stock": 14,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:50.496Z",
//           "updatedAt": "2024-11-20T04:01:54.571Z",
//           "__v": 0
//         },
//         "quantity": 2,
//         "price": 20,
//         "_id": "673d5f2b441d09eff86a555b"
//       }
//     ],
//     "totalAmount": 80,
//     "paymentMethod": "online",
//     "paymentStatus": "completed",
//     "orderDeliveryStatus": "pending",
//     "isDelivered": false,
//     "orderDate": "2024-11-20T04:01:47.497Z",
//     "createdAt": "2024-11-20T04:01:47.533Z",
//     "updatedAt": "2024-11-20T04:01:47.533Z",
//     "__v": 0
//   },
//   {
//     "shippingInfo": {
//       "address": "my new address",
//       "city": "xy",
//       "pincode": "322",
//       "country": "US"
//     },
//     "paymentInfo": {
//       "payment_id": "pay_PNP4yQELeG5qpK",
//       "order_id": "order_PNP4pp9Ekfu5Nu",
//       "signature": "0ab334cf9dfbe13e8445ebc083437f3567bf138b697f9bb54d06b532c5342cbf"
//     },
//     "_id": "673d5f30441d09eff86a5563",
//     "user": "673373d5eeb6586caac89333",
//     "orderItems": [
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731549486/t15lwpwesd8hbirl85hg.jpg",
//             "otherPics": []
//           },
//           "_id": "6735592d07d8a0a0b8fb10a9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "men",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-14T01:58:05.931Z",
//           "updatedAt": "2024-11-20T04:01:54.574Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f30441d09eff86a5564"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945255/zrexk1jq475r2b668dt2.png",
//             "otherPics": []
//           },
//           "_id": "673b6325defc3c93fd4257f6",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "women",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:13.368Z",
//           "updatedAt": "2024-11-20T04:01:54.568Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f30441d09eff86a5565"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945292/ygi95kao1zgvoyz4q2gj.png",
//             "otherPics": []
//           },
//           "_id": "673b634adefc3c93fd4257f9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "electronics",
//           "stock": 14,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:50.496Z",
//           "updatedAt": "2024-11-20T04:01:54.571Z",
//           "__v": 0
//         },
//         "quantity": 2,
//         "price": 20,
//         "_id": "673d5f30441d09eff86a5566"
//       }
//     ],
//     "totalAmount": 80,
//     "paymentMethod": "online",
//     "paymentStatus": "completed",
//     "orderDeliveryStatus": "pending",
//     "isDelivered": false,
//     "orderDate": "2024-11-20T04:01:52.912Z",
//     "createdAt": "2024-11-20T04:01:52.920Z",
//     "updatedAt": "2024-11-20T04:01:52.920Z",
//     "__v": 0
//   },
//   {
//     "shippingInfo": {
//       "address": "my new address",
//       "city": "xy",
//       "pincode": "322",
//       "country": "US"
//     },
//     "paymentInfo": {
//       "payment_id": "pay_PNP4yQELeG5qpK",
//       "order_id": "order_PNP4pp9Ekfu5Nu",
//       "signature": "0ab334cf9dfbe13e8445ebc083437f3567bf138b697f9bb54d06b532c5342cbf"
//     },
//     "_id": "673d5f32441d09eff86a556e",
//     "user": "673373d5eeb6586caac89333",
//     "orderItems": [
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731549486/t15lwpwesd8hbirl85hg.jpg",
//             "otherPics": []
//           },
//           "_id": "6735592d07d8a0a0b8fb10a9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "men",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-14T01:58:05.931Z",
//           "updatedAt": "2024-11-20T04:01:54.574Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f32441d09eff86a556f"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945255/zrexk1jq475r2b668dt2.png",
//             "otherPics": []
//           },
//           "_id": "673b6325defc3c93fd4257f6",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "women",
//           "stock": 17,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:13.368Z",
//           "updatedAt": "2024-11-20T04:01:54.568Z",
//           "__v": 0
//         },
//         "quantity": 1,
//         "price": 20,
//         "_id": "673d5f32441d09eff86a5570"
//       },
//       {
//         "productId": {
//           "images": {
//             "coverPic": "http://res.cloudinary.com/dc28hoyil/image/upload/v1731945292/ygi95kao1zgvoyz4q2gj.png",
//             "otherPics": []
//           },
//           "_id": "673b634adefc3c93fd4257f9",
//           "owner": "673373d5eeb6586caac89333",
//           "name": "pr1",
//           "price": 20,
//           "description": "racing car",
//           "category": "electronics",
//           "stock": 14,
//           "numRating": 0,
//           "numReviews": 0,
//           "createdAt": "2024-11-18T15:54:50.496Z",
//           "updatedAt": "2024-11-20T04:01:54.571Z",
//           "__v": 0
//         },
//         "quantity": 2,
//         "price": 20,
//         "_id": "673d5f32441d09eff86a5571"
//       }
//     ],
//     "totalAmount": 80,
//     "paymentMethod": "online",
//     "paymentStatus": "completed",
//     "orderDeliveryStatus": "pending",
//     "isDelivered": false,
//     "orderDate": "2024-11-20T04:01:54.485Z",
//     "createdAt": "2024-11-20T04:01:54.489Z",
//     "updatedAt": "2024-11-20T04:01:54.489Z",
//     "__v": 0
//   }
// ]
import { Toaster } from "react-hot-toast";
function App() {
  
  return (
    <>
     <Toaster />
     <Navbar />
     <Outlet />
    </>
    
  );
 
}

export default App;
