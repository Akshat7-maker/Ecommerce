import React from "react";
import ProductGrid from "../ProductGrid";
import Loader from "../Loader";
import { useEffect, useState } from "react";
import api, { API } from "../../api/api";
import useLoader from "@/customHooks/loader";
import AdminProductItem from "./AdminProductItem";
import axios from "axios";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { loading, error, withLoader } = useLoader();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsShowing, setProductsShowing] = useState(0);
  const [priceSort, setPriceSort] = useState("");
  const [category, setCategory] = useState("");
  const [getCategories, setgetCategories] = useState([]);

  // const getAllProducts = async () => {
  //     withLoader(async () => {
  //         const allProducts = await api.getAllProducts();
  //         setProducts(allProducts.products);
  //     })
  // }

  const fetchProducts = async () => {
    let url = `/api/v1/products/get-all-products?page=${page}&limit=4`;

    const { data } = await API.get(url);

    const { data: products } = data;

    console.log(products);
    setProducts(products.products);
    setTotalPages(products.totalPages);
    setTotalProducts(products.totalProducts);
    setProductsShowing(products.productsShowing);
  };

  useEffect(() => {
    // getAllProducts();
    fetchProducts();
  }, [page]);

  if (loading) return <div>Loding ...</div>;
  if (error) return <div>{error}</div>;

  if (products.length === 0 && loading) return <div>No products found</div>;

  return (
    <>
      <ProductGrid>
        {products.map((product) => (
          <AdminProductItem key={product._id} product={product} />
        ))}
      </ProductGrid>

      <div className="flex justify-center items-center p-4 border-t mt-4">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-white">
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
    </>
  );
}

export default AdminProducts;
