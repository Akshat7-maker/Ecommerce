import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrderTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/orders/get-all-orders-of-admin?page=${page}&limit=5`
      );
      const { data: myData } = data;
      // console.log(myData)
      
      setOrders(myData);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setError(error);
      setLoading(false);
    }
  };

  const selectPageHandler = (selectedPage) => {
    if (selectedPage >= 1 && selectedPage <= totalPages && selectedPage !== page) {
      setPage(selectedPage);
    }
  };   

  const processOrder = async (orderId) => {
    try {
        setError(null);
        setLoading(true);
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/orders/process-order/${orderId}`
      );
      const { data: myData } = data;
      console.log(myData);
      fetchOrders();
    } catch (error) {
      setError(error.message);
    }finally{
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/orders/delete-order/${orderId}`
      );
      const { data: myData } = data;
      console.log(myData);
      fetchOrders();
    } catch (error) {
      setError(error.message);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error?.message || "An error occurred"}
      </div>
    );
  }

  if(orders.length === 0){
    return (

      <div className="flex justify-center items-center h-screen text-red-600">
        No order available yet 
      </div>

    )

  }

  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order ID
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Amount
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Payment Method
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Payment Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Date
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Order Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Process Order
                </th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                  Delete Order
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order?._id || Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?._id || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    ₹{order?.totalAmount || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.paymentMethod || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.paymentStatus || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {new Date(order?.orderDate).toLocaleDateString() || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    {order?.orderDeliveryStatus || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    <button 
                    onClick={() => processOrder(order?._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

                        Process
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-b">
                    <button 
                    onClick={() => deleteOrder(order?._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderTable;
