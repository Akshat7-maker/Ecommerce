import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import useLoader from "../../customHooks/loader";
import Loader from "../Loader";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../../api/api";


function ShowDetailsOfProduct() {
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const { loading, error, withLoader } = useLoader();
  const navigate = useNavigate();

  // fetch the product details using productId

  const getProductDetails = async () => {
    await withLoader(async () => {
      const product = await api.getProductById(productId);
      setProduct(product);
    });
  };

  const onDelete = async (id) => {
    await withLoader(async () => {
      const deleted = await API.delete(
        `/api/v1/products/${id}`
      );
      console.log("deleted", deleted);

      toast.success("Product deleted successfully");
      navigate("/admin-panel/products");
    });
  };

  const onUpdate = (id) => {
    navigate(`/admin-panel/update-product/${id}`);
  };

  // use effect to fetch the product details

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  if (!product) return <div>No product found</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold mb-4">
        {product?.name || "Product Name"}
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-600 font-semibold">Description:</p>
          <p className="text-gray-800 mt-4 p-4 border rounded bg-gray-100 whitespace-pre-wrap font-mono">
            {product?.description || "Product Description"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Category:</p>
          <p className="text-gray-800">
            {product?.category || "Product Category"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Price:</p>
          <p className="text-gray-800">
          ₹{product?.price.toFixed(2) || "Product Price"}
          </p>
        </div>
        <div>
          <p className="text-gray-600 font-semibold">Stock:</p>
          <p
            className={product?.stock > 10 ? "text-green-600" : "text-red-600"}
          >
            {product?.stock || "Product Stock"}
          </p>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => onDelete(product?._id)}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Delete Product
        </button>
        <button
          onClick={() => onUpdate(product?._id)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          <Edit className="w-5 h-5 mr-2" />
          Update Product
        </button>
      </div>
    </div>
  );
}

export default ShowDetailsOfProduct;
