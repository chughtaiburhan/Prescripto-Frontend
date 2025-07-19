import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row bg-[#5f6FFF] rounded-lg px-4 sm:px-6 md:px-14 lg:px-12 my-8 sm:my-12 md:my-20 md:mx-10">
      {/* Left Side */}
      <div className="flex-1 py-6 sm:py-8 md:py-16 lg:py-24 lg:pl-5 text-center  md:text-left">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white leading-tight">
          <p>Book Appointment</p>
          <p className="mt-2 sm:mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="bg-white text-sm sm:text-base text-gray-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:scale-105 mt-4 sm:mt-6 transition-all mx-auto md:mx-0 block"
        >
          Create account
        </button>
      </div>
      {/* Right Side */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          src={assets.appointment_img}
          alt="banner-img"
          className="w-full absolute bottom-0 right-0 max-w-md animate-zoom-inout"
        />
      </div>
    </div>
  );
};

export default Banner;
