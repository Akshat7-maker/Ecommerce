import React, { useEffect, useState } from "react";
import api from "../api/api";
import { API } from "../api/api";
import ProductGrid from "../components/ProductGrid";
import ProductItem from "../components/ProductItem";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import hero from "./images/h1.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
// main aim of this component is to display all the products
// from api fetch all products

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // fetch all products

  // const getAllProducts = async () => {
  //   try {
  //     setLoading(true);
  //     const allProducts = await api.getAllProducts();
  //     console.log(allProducts);
  //     setProducts(allProducts);
  //     setLoading(false);
  //   } catch (error) {
  //     throw error;
  //   }
  // };


  const getLatestProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await api.getLatestProducts();
      console.log(allProducts);
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await API.get("/products/get-categories");
      const { data: categories } = data;
      console.log(categories);
      setCategories(categories)
    } catch (error) {
      throw error;
    }
  };

  const handleform = (e) => {
    e.preventDefault();
    setEmail("");
  };


  useEffect(() => {
    getLatestProducts();
    getCategories();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      {/* hero section */}

      <section className="relative ">
        <div className="relative h-[450px] w-full overflow-hidden">
          <img
            src={hero}
            alt="Latest Technology"
            width={1920}
            height={600}
            className="object-cover w-full h-full"
          />
          {/* inset-0 bg-gradient-to-r from-black/60 to-black/30 */}
          <div className="absolute inset-0 ">
            <div className="container mx-auto px-4 relative h-full">
              <div className="flex h-full max-w-xl flex-col justify-center space-y-4 text-white">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Next-Gen Technology at Your Fingertips
                </h1>
                <p className="text-lg text-gray-200">
                  Discover the latest in laptops, smartphones, and digital accessories.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => navigate("/all-products")}
                    className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">

                    Shop Now
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* product grid */}
      <ProductGrid>
        {Array.isArray(products) && products?.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </ProductGrid>



      {/* categories */}
      {/* <section className="py-12 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                <button className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                  Browse {category.name} <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* special offers */}
      {/* <section className="py-12 md:py-24 bg-blue-600 text-white max-h-[400px]">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Special Offer
                </h2>
                <p className="text-xl opacity-90">
                  Get up to 40% off on selected laptops and smartphones. Limited time offer.
                </p>
              </div>
              <div className="flex gap-4">
                <button className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600">
                  Shop Now
                </button>
              </div>
            </div>
            <div className="relative h-[400px]">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Special Offer"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* newsletter */}
      <section className="py-12 md:py-24 bg-gray-50 ">
        <div className="container mx-auto px-4 max-h-[400px]">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Stay Updated
              </h2>
              <p className="mx-auto max-w-[450px] text-gray-500 md:text-xl">
                Subscribe to our newsletter for the latest tech news, exclusive offers, and product updates.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form 
              onSubmit={handleform}
              className="flex space-x-2">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  value={email}
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => toast.success("Subscribed successfully")}
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col gap-8 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-sm font-bold">About Us</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to={"/about-us"} className="hover:text-gray-600">Our Story</Link></li>
                
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to={"/contact-us"} className="hover:text-gray-600">Contact Us</Link></li>
                
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-gray-600">Help Center</Link></li>
                
              </ul>
            </div>
            
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              © 2024 TechStore. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-600">Privacy Policy</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-600">Terms of Service</Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-600">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;
