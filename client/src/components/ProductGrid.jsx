import React from 'react'
import ProductItem from './ProductItem'

// Dummy product data (replace with your actual data source)

export default function ProductGrid({children}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center"> Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  )
}