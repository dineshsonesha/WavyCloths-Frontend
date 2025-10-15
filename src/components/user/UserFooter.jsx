import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

export default function UserFooter() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories/all");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubscribe = (e) => {
  e.preventDefault();
  if (!email.trim()) return;
  const templateParams = {
    user_email: email,
  };
  emailjs
    .send(
      "service_davo4yh",
      "template_x11puqm",
      templateParams,
      "NlLoYgIE1SlXU7VH1"
    )
    .then(
      () => {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: `Subscription email sent successfully to: ${email}`,
          confirmButtonColor: "#2563eb",
        });
        setEmail("");
      },
      (err) => {
        console.error("EmailJS Error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to send email. Try again later.",
          confirmButtonColor: "#dc2626", 
        });
      }
    );
};


  return (
    <>
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            {/* Left: Text + Form */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay Updated with WavyCloths
              </h3>
              <p className="text-gray-200 mb-6">
                Subscribe to our newsletter and get the latest trends, offers, 
                and style updates directly to your inbox.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 text-gray-900 outline-none transition"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Right: Image */}
            <div className="hidden md:block">
              <img
                src="/assets/images/Newsletter.png"
                alt="Newsletter"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300">
        {/* Footer Links */}
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-gray-700">
          
          {/* Categories (dynamic) */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <NavLink
                    to={`/products/${cat.id}`}
                    className="hover:text-blue-400 transition"
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/" className="hover:text-blue-400">Home</NavLink></li>
              <li><NavLink to="/products/all" className="hover:text-blue-400">Shop</NavLink></li>
              <li><NavLink to="/about" className="hover:text-blue-400">About Us</NavLink></li>
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">More</h4>
            <ul className="space-y-2 text-sm">
              <li><NavLink to="/faqs" className="hover:text-blue-400">FAQs</NavLink></li>
              <li><NavLink to="/shipping" className="hover:text-blue-400">Shipping & Returns</NavLink></li>
              <li><NavLink to="/privacy" className="hover:text-blue-400">Privacy Policy</NavLink></li>
              <li><NavLink to="/terms" className="hover:text-blue-400">Terms & Conditions</NavLink></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Follow Us</h4>
            <div className="flex gap-5 text-2xl">
              <a href="#" className="hover:text-blue-400"><FaFacebook /></a>
              <a href="#" className="hover:text-pink-400"><FaInstagram /></a>
              <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-gray-800 text-center py-5 text-sm text-gray-400">
          © {new Date().getFullYear()} WavyCloths. All rights reserved.
        </div>
      </footer>
    </>
  );
}
