import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function CartItem({cartitem, removeFromCart, deleteFromCart, addToCart}) {

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <Link to={`/product-info/${cartitem?.productId?._id}`} className="flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        <img
          src={cartitem?.productId?.images?.coverPic}
          alt="Product Name"
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold text-lg">{cartitem?.productId?.name}</h3>
          <p className="text-gray-600">₹{cartitem?.price?.toFixed(2)}</p>
        </div>
      </div>
      </Link>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={cartitem.quantity > 1? ()=> deleteFromCart(cartitem?.productId?._id):()=> removeFromCart(cartitem?.productId?._id)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Decrease quantity"
          >
            {cartitem.quantity > 1 ? <span className="text-xl font-bold">-</span>:<span className="text-xl font-bold">x</span>}
            
          </button>
          <span className="w-8 text-center" aria-live="polite" aria-label="Quantity">
            {cartitem.quantity}
          </span>
          <button
            onClick={()=> addToCart(cartitem?.productId?._id)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            aria-label="Increase quantity"
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
        <button
          onClick={() => removeFromCart(cartitem?.productId?._id)}
          className="text-red-500 hover:text-red-700 focus:outline-none focus:underline"
          aria-label="Remove item from cart"
        >
          Remove
        </button>
      </div>
    </div>
  )
}