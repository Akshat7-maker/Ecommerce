import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">About Us</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
          Welcome to Next Gen Tech, your number one source for all tech
        Products. We're dedicated to giving you the very best of products,
          with a focus on customer service, dependability, and uniqueness. 
          Our products are sourced from the best manufacturers to bring you 
          the latest and most affordable Product Type directly to your door.
        </p>
        <div className="flex flex-wrap justify-center gap-16">
          <div className="max-w-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              Our mission is to provide high-quality products that meet the needs
              and desires of our customers. We aim to ensure a seamless shopping 
              experience with fast shipping, easy returns, and 24/7 customer support.
            </p>
          </div>
          <div className="max-w-sm">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              We envision becoming the leading online store for Tech Product, 
              known for offering the best selection, prices, and customer experience.
              We want to bring our customers closer to the products they love while
              making online shopping fun and stress-free.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h3>
          <ul className="text-lg text-gray-700 space-y-4 max-w-3xl mx-auto">
            <li className="flex items-center">
              <svg
                className="w-6 h-6 text-indigo-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v6m3-3H9"
                />
              </svg>
              High-quality, curated products from trusted suppliers.
            </li>
            <li className="flex items-center">
              <svg
                className="w-6 h-6 text-indigo-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v18h14V3H5z"
                />
              </svg>
              Easy returns and fast shipping for all orders.
            </li>
            <li className="flex items-center">
              <svg
                className="w-6 h-6 text-indigo-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              24/7 customer support to assist you with anything.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
