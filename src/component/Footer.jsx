import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm ">
        {/* Left Section */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Prescripto is your trusted healthcare companion, connecting you with qualified doctors and specialists for convenient online consultations. Book appointments, get prescriptions, and access quality healthcare from the comfort of your home.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-xl font-medium mb-5 ">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-xl font-medium mb-5 ">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+923292198843</li>
            <li>chughtaiburhan3@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Copy right text */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024 @ Burhan's - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
