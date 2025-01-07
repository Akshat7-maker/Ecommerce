import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api';
import Loader from './Loader';
// This would typically come from your app's state or API
// const orderData1 = {
//   orderId: '#ORD12345',
//   date: '2023-11-20',
//   status: 'Shipped',
//   items: [
//     { id: 1, name: 'Classic T-Shirt', price: 19.99, quantity: 2 },
//     { id: 2, name: 'Denim Jeans', price: 49.99, quantity: 1 },
//     { id: 3, name: 'Sneakers', price: 79.99, quantity: 1 },
//   ],
// }

export default function OrderSummary() {

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState('');
    // function of this component is to display the order summary after user has successfully paid and placed the order

    // 1.get the orderId from the url parameter
    const { orderId } = useParams();

    // 2.use the orderId to fetch the order data from the backend
    const getOrderData = async () => {
        try {
            setError('');
            setLoading(true);
            const order = await api.getOrderById(orderId);
            console.log(order);
            if(order) {
                setOrderData(order);
            }
            
        } catch (error) {
            // console.log(error);
            setError(error.response?.data?.message|| "Something went wrong");
            
        }finally {
            setLoading(false);
        }
    }

    // 3.use useEffect to fetch the order data when the component mounts
    useEffect(() => {
        getOrderData();
    }, [orderId]);

    if(loading) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <Loader />
                    </div>
                </div>
            </div>)
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderData) {
        return null; // Add a fallback if `orderData` is still null
    }


  return (
    
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {/* display order summary */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="mb-6">
            <p className="text-sm text-gray-600">Order ID: {orderData._id}</p>
            <p className="text-sm text-gray-600">Date: {orderData.orderDate}</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-green-600">{orderData.orderDeliveryStatus}</span></p>
          </div>
          {/* display shipping info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Information</h3>
            <p className="text-sm text-gray-600">Name: {orderData.shippingInfo.name}</p>
            <p className="text-sm text-gray-600">Address: {orderData.shippingInfo.address}</p>
            <p className="text-sm text-gray-600">City: {orderData.shippingInfo.city}</p>
            <p className="text-sm text-gray-600">State: {orderData.shippingInfo.state}</p>
            <p className="text-sm text-gray-600">Country: {orderData.shippingInfo.country}</p>
            <p className="text-sm text-gray-600">Pincode: {orderData.shippingInfo.pincode}</p>
          </div>
          {/* display order items */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchased Items</h3>
            <div className="space-y-4">
              {orderData.orderItems.map((item) => (
                <div  className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <img src={item.productId?.images?.coverPic|| ""} alt={item.name} className="w-12 h-12 object-cover rounded mr-4" />
                    <div>
                      <h4 className="text-md font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    Quantity: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">${orderData.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}