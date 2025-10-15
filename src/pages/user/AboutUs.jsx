import React from "react";
import { FaLeaf, FaShippingFast, FaUsers } from "react-icons/fa";

export default function AboutUs() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div>
          <img
            src="/assets/images/About.png" 
            alt="About WavyCloths"
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Right: Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-blue-600">WavyCloths</span>
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At <span className="font-semibold">WavyCloths</span>, we believe fashion
            is more than clothing – it’s self-expression. We bring you trendy, 
            comfortable, and sustainable apparel designed for every occasion.
          </p>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <FaLeaf className="text-green-500 text-3xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Eco Friendly</h4>
              <p className="text-sm text-gray-500">Sustainable fabrics</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <FaShippingFast className="text-blue-500 text-3xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Fast Delivery</h4>
              <p className="text-sm text-gray-500">Nationwide shipping</p>
            </div>

            <div className="text-center bg-white p-6 rounded-xl shadow hover:shadow-md transition">
              <FaUsers className="text-indigo-500 text-3xl mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800">Trusted by Many</h4>
              <p className="text-sm text-gray-500">Thousands of happy customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
