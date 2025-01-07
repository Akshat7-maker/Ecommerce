import React from "react";

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-container p-6 bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        🛒 My Stunning Orders
      </h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="order-card bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4">
              <h2 className="text-lg font-bold">
                Order ID: <span className="text-yellow-300">{order._id}</span>
              </h2>
              <p className="text-sm">Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Order Summary */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                <p className="text-gray-700">
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p className="text-gray-700">
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  Payment Status: {order.paymentStatus}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.orderDeliveryStatus === "Delivered"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  Delivery Status: {order.orderDeliveryStatus}
                </p>
              </div>

              {/* Shipping Info */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Shipping Info</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">Address: {order.shippingInfo.address}</p>
                  <p className="text-gray-700">City: {order.shippingInfo.city}</p>
                  <p className="text-gray-700">Pincode: {order.shippingInfo.pincode}</p>
                  <p className="text-gray-700">Country: {order.shippingInfo.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="item-card bg-gradient-to-br from-indigo-50 to-white border rounded-lg shadow hover:shadow-md transition duration-300"
                    >
                      <img
                        src={item.productId.images.coverPic}
                        alt={item.productId.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-gray-800">{item.productId.name}</h4>
                        <p className="text-sm text-gray-600">Category: {item.productId.category}</p>
                        <p className="text-gray-700">Price: ₹{item.price}</p>
                        <p className="text-gray-700">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
