
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminProductItem({product}) {

  const navigate = useNavigate();

  return (
    <div
      key={product._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105  transition duration-300"
    >
      <Link to={`/product-info/${product._id}`}>
        <img
          src={product?.images?.coverPic || "/placeholder.svg"}
          alt={product?.description || "Product"}

          className="w-full h-48 object-cover hover:scale-105 transition duration-300"
        />
      </Link>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{product?.name || "Product Name"}</h2>
        <p className="text-gray-600">₹{product?.price?.toFixed(2) || "Product Price"}</p>
        <button 
        onClick={() => navigate(`/admin-panel/show-product-details/${product._id}`)}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
          Show Details Of Product
        </button>
      </div>
    </div>
  )
}

export default AdminProductItem
