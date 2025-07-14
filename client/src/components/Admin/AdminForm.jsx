import React from 'react'
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { API } from '@/api/api';


function AdminForm({product}) {
    const { register, handleSubmit, formState: { errors }} = useForm({
      defaultValues: {
        name: product?.name || "",
        price: product?.price || 0,
        description: product?.description || "",
        category: product?.category   || "",
        stock: product?.stock || 0,
      },
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const onSubmit = async(data)=>{
  
     try {
       console.log(data);
       const formData = new FormData();
       formData.append("name", data.name);
       formData.append("price", data.price);
       formData.append("description", data.description);
       formData.append("category", data.category.toLowerCase());
       formData.append("stock", data.stock);
       formData.append("coverPic", data?.coverPic[0]);
       
       if(!product){

           const res = await axios.post("http://localhost:8000/api/v1/products/create-product", formData);
           //  console.log(res);
           toast.success("Product added successfully");
           navigate("/admin-panel/products")
       }else{
           const res = await axios.put(`http://localhost:8000/api/v1/products/${product._id}`, formData,
            {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
            }
           );
           //  console.log(res);
           toast.success("Product updated successfully");
           navigate("/admin-panel/products")
       }


     } catch (error) {
       console.log(error);
       setError(error?.response?.data?.message|| "An error occured");
  
      
     }
  
    }
  
    if(error){
      return <div>{error}</div>
    }
  
    return (
      <div className=" w-full mx-auto bg-gray-800 p-6 rounded-lg shadow-lg ">
          
        <h2 className="text-white text-2xl font-semibold mb-4">{product ? "Update Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-gray-300 font-medium mb-1">Name:</label>
            <input 
              className={`w-full p-2 rounded-md border ${errors.name ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`}
              type="text" id="name" {...register("name", { required: !product })} 
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">Name is required</span>}
          </div>
  
          {/* Price Field */}
          <div>
            <label htmlFor="price" className="block text-gray-300 font-medium mb-1">Price:</label>
            <input 
              className={`w-full p-2 rounded-md border ${errors.price ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`} 
              type="number" id="price" {...register("price", { required: !product })} 
            />
            {errors.price && <span className="text-red-500 text-sm mt-1">Price is required</span>}
          </div>
  
          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-300 font-medium mb-1">Description:</label>
            <textarea 
              className={`w-full p-2 rounded-md border ${errors.description ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`} 
              id="description" {...register("description", { required: !product })} 
            />
            {errors.description && <span className="text-red-500 text-sm mt-1">Description is required</span>}
          </div>
  
          {/* Cover Image Field */}
          <div>
            <label htmlFor="coverPic" className="block text-gray-300 font-medium mb-1">Cover Image:</label>
            <input 
              className={`w-full p-2 rounded-md border ${errors.coverPic ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`} 
              type="file" id="coverPic" {...register("coverPic", { required: !product })} 
            />
            {errors.coverPic && <span className="text-red-500 text-sm mt-1">Image is required</span>}
          </div>
  
          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-gray-300 font-medium mb-1">Category:</label>
            <input 
              className={`w-full p-2 rounded-md border ${errors.category ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`} 
              type="text" id="category" {...register("category", { required: !product })} 
            />
            {errors.category && <span className="text-red-500 text-sm mt-1">Category is required</span>}
          </div>
  
          {/* Stock Field */}
          <div>
            <label htmlFor="stock" className="block text-gray-300 font-medium mb-1">Stock:</label>
            <input 
              className={`w-full p-2 rounded-md border ${errors.stock ? "border-red-500" : "border-gray-600"} bg-gray-700 text-gray-100`} 
              type="text" id="stock" {...register("stock", { required: !product })} 
            />
            {errors.stock && <span className="text-red-500 text-sm mt-1">Stock is required</span>}
          </div>
  
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition"
          >
            {product ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    );
}

export default AdminForm
