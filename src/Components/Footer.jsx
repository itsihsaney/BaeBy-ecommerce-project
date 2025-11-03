import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaTiktok,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-12 px-6 md:px-20 mt-10 border-t border-gray-200 shadow-sm">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-200 pb-10">
        {/* Brand */}
        <div>
          {/* 🔹 Replace this image link with your logo */}
          <img
            src="/BaeBy Official Logo.png"
            alt="BaebyStore Logo"
            className="w-32 mb-4"
          />

          <p className="text-sm leading-relaxed text-gray-500">
            Elevate your vibe with the trendiest GenZ fits, accessories & skincare.
            Stay bold. Stay Baeby.
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-5">
            <a
              href="#"
              className="p-2 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              <FaTiktok />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-gray-100 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/products"
                className="hover:text-pink-500 transition"
              >
                All Products
              </Link>
            </li>
            <li>
              <Link
                to="/products/clothes"
                className="hover:text-pink-500 transition"
              >
                Clothes
              </Link>
            </li>
            <li>
              <Link
                to="/products/toys"
                className="hover:text-pink-500 transition"
              >
                Toys
              </Link>
            </li>
            <li>
              <Link
                to="/products/skincare"
                className="hover:text-pink-500 transition"
              >
                Skin Care
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            
            <li>
              <Link to="/contact" className="hover:text-pink-500 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-pink-500 transition">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-pink-500 transition">
                Returns & Refunds
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-pink-500" /> support@baeby.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-pink-500" /> +91 8590698873
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-pink-500" /> Palakkad, Kerala, IN
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Baeby. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-pink-500 transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-pink-500 transition">
            Terms & Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
