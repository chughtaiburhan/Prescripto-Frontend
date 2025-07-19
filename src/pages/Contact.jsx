import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets";
const Contact = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">CONTACT US</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={assets.contact_image}
                alt="Medical consultation"
                className="w-full h-auto object-cover"
                style={{ minHeight: "400px" }}
              />
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-2">
            {/* Office Information */}
            <div className="bg-white rounded-lg p-4 ">
              <h2 className="text-xl font-semibold text-gray-600 mb-6">OUR OFFICE</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-medium">Address:</p>
                  <p className="text-gray-600">11C-1 North Karachi</p>
                  <p className="text-gray-600">Karachi, Sindh, Pakistan</p>

                </div>

                <div>
                  <p className="text-gray-700 font-medium">Phone:</p>
                  <p className="text-gray-600">Tel: (+92) 3292198843</p>
                </div>

                <div>
                  <p className="text-gray-700 font-medium">Email:</p>
                  <p className="text-gray-600">Email: chughtaiburhan3@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Careers Section */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">DOCTORS AT PRESCRIPTO</h2>
              <p className="text-gray-600 mb-6">
                Learn more about our teams and Doctors available.
              </p>
              <Link
                to="/doctors"
                className="inline-block border border text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-[#5f6FFF] hover:text-white transition-colors duration-300"
              >
                Explore Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
