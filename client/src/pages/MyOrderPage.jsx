// import React from 'react'
// import OrderList from '../components/OrderList'

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import Loader from "../components/Loader";

// This would typically come from your app's state or API

export default function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  // call api to get orders of login user
  const { user } = useSelector((state) => state.auth);
  const getOrders = async () => {
    try {
      setLoading(true);
      const myData = await api.getAllOrders(page);
      console.log(myData);
      if (myData) {
        setOrders(myData.orders);
        setTotalPages(myData.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [page]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "processing":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
          <Loader fullScreen={true} text="Fetching orders..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order {order._id}
                    </h2>
                    <button
                      onClick={() => toggleOrderDetails(order._id)}
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline"
                    >
                      {expandedOrder === order._id
                        ? "Hide Details"
                        : "Show Details"}
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className={getStatusColor(order.orderDeliveryStatus)}>
                      Status: {order.orderDeliveryStatus}
                    </span>
                  </div>
                  <div className="text-right text-lg font-semibold text-gray-900">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </div>
                  {expandedOrder === order._id && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-2">
                        Order Items
                      </h3>
                      <ul className="space-y-4">
                        {order.orderItems.map((item) => (
                          <li className="flex items-center">
                            <img
                              src={item.productId?.images?.coverPic}
                              alt={item.productId?.name}
                              className="w-20 h-20 object-cover rounded-md mr-4"
                            />
                            <div className="flex-grow">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{item.name}</span>
                                <span>
                                ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Quantity: {item.quantity} | Price: $
                                {item.price.toFixed(2)} each
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        {totalPages > 1 && (
          <div>
            <div>
              {/* to tell user how many pages are there */}
              <p className="text-sm text-gray-600 mt-4">
                Showing page {page} of {totalPages}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="mx-4 text-gray-600">Page {page}</span>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
