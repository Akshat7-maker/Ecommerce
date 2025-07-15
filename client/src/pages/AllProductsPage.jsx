import useLoader from "@/customHooks/loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api/api";
import { myCartActions } from "@/store/myCartSlice";
import toast from "react-hot-toast";
import { API } from "@/api/api";

function AllProductsPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const { loading, error, withLoader } = useLoader();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0)
  const [productsShowing, setProductsShowing] = useState(0)
  const [priceSort, setPriceSort] = useState("");
  const [category, setCategory] = useState("");
  const [getCategories, setgetCategories] = useState([])
  


  const fetchProducts = async () => {

    let url = `/products/get-all-products?page=${page}&limit=5`;

    if (priceSort || category) {
      url = `/products/get-filter-products?pricesort=${priceSort}&category=${category}&page=${page}&limit=5`;
    }
    const { data } = await API.get(url);

    const { data: products } = data;

    console.log(products);
    setProducts(products.products);
    setTotalPages(products.totalPages);
    setTotalProducts(products.totalProducts)
    setProductsShowing(products.productsShowing)
  };

  const fetchCategories = async () => {
    const { data } = await API.get("/products/get-categories");
    const { data: categories } = data;
    console.log(categories);
    setgetCategories(categories)
  }
  const handlepriceChange = async (e) => {
    const { value, name, checked } = e.target;
    console.log(value, name, checked);

    setPriceSort(value);
    setPage(1);
  };

  const handleCategoryChange = async (e) => {
    const { value } = e.target;
    console.log(value);

    setCategory(value);
    setPage(1);
  };

  const addToCart = async (product) => {
    await withLoader(async () => {
      const cart = await api.addToCart( product._id);
      console.log("added to cart ", cart);
      if (cart) {
        dispatch(myCartActions.setCart(cart));
        toast.success("Product added to cart");
        // getCart();
      }
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, priceSort, category]);



  return (

    <div className="grid grid-cols-12  min-h-screen  ">
      {/* left side */}
      <div className="col-span-2 bg-slate-950 postion-fixed p-4">
        <h2 className="text-2xl font-bold text-white mt-6">Filter Products</h2>

        {/* on basis of price */}

        <div className="mt-4">
          <h3 className="text-lg font-bold text-white">On basis of Price</h3>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value={"desc"}
                onChange={handlepriceChange}
              />
              <label className="text-white" htmlFor="desc">high to low</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value={"asc"}
                onChange={handlepriceChange}
              />
              <span className="text-white">low to high</span>
            </div>
          </div>
        </div>

        {/* on basis of category */}

        <div className="mt-5 ">
          <h3 className="text-lg font-bold text-white">On basis of Category</h3>
          <select
            name="category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-gray-100 mt-3 "
          >
            <option value="">Select Category</option>
            {getCategories?.map((category) => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* right side */}
      <div className="col-span-10 bg-slate-600 p-10">
        <h1 className="text-5xl font-bold text-white">All Products</h1>

        {/* showing products of total products */}
        <p className="text-sm text-white mt-3 mb-3">
          Showing {productsShowing} of {totalProducts} products
        </p>


        {/* cards */}
        <div className="grid grid-cols-3 gap-4">
          {products?.map((product) => {
            return (
              <div
                key={product.name}
                className="group rounded-lg border border-gray-200 bg-white overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Link to={`/product-info/${product?._id}`}>
                  <img
                    src={product?.images?.coverPic}
                    alt={product?.description}
                    width={400}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  </Link>

                  {product.badge && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Stack spacing={1}>
                        <Rating
                          name="half-rating-read"
                          defaultValue={product?.avgRating}
                          precision={0.5}
                          readOnly
                        />
                      </Stack>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product?.reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-xl">
                      ₹{product?.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product?.oldPrice || 0}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* pagination */}


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

        <div>
        </div>
      </div>
    </div>
  );
}

export default AllProductsPage;
