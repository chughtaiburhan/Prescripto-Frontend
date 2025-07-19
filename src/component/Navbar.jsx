import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Doctors", path: "/doctors" },
    { label: "About", path: "/about" },
    { label: "Contact us", path: "/contact" },
  ];

  const logout = async () => {
    setToken(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");

    // Also clear admin panel credentials if they exist
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUserData");

    toast.success("User Logout Successfully!");
    navigate("/");
  };

  // Get user role from localStorage for debugging
  const userRole = localStorage.getItem("userRole") || "Not logged in";

  return (
    <div className="flex items-center justify-between text-sm py-3 sm:py-4 mb-3 sm:mb-5 border-b border-b-gray-400 px-4 sm:px-6">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-40 md:w-44 cursor-pointer"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        {navItems.map((item, index) => (
          <li className="py-1" key={index}>
            <NavLink
              onClick={() => setShowMenu(false)}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "active px-4 py-2 rounded inline-block"
                  : "px-4 py-2 rounded inline-block"
              }
            >
              {item.label}
              <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-full m-auto hidden" />
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="gap-4 flex items-center">
        {/* Debug: Show user role */}
        {token && (
          <div className="hidden md:block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Role: {userData?.role || userRole}
          </div>
        )}

        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative z-50">
            <img
              src={userData.image && userData.image !== "" ? userData.image : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&background=5f6FFF&color=fff&size=32&rounded=true&bold=true`}
              className="w-8 rounded-full  hover:scale-110 transition-transform"
              alt="prifile-pic"
            />
            <img
              src={assets.dropdown_icon}
              className="w-2.5 group-hover:rotate-180 transition-transform"
              alt="drop-down-icon"
            />
            <div className="hidden absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 group-hover:block z-50">
              <div className="min-w-48 bg-white rounded-xl shadow-2xl border border-gray-100 flex flex-col gap-2 p-4 animate-fadeIn">
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                <p
                  className="hover:text-[#5f6FFF] hover:bg-gray-50 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  onClick={() => navigate("my-profile")}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </p>
                <p
                  className="hover:text-[#5f6FFF] hover:bg-gray-50 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  onClick={() => navigate("my-appointment")}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Appointment
                </p>
                <hr className="my-1 border-gray-200" />
                <p className="hover:text-red-500 hover:bg-red-50 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2" onClick={logout}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 hidden md:flex">
            <button
              onClick={() => navigate("/login")}
              className="text-[#5f6FFF] border border-[#5f6FFF] cursor-pointer px-6 py-2 rounded-full font-medium hover:bg-[#5f6FFF] hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#5f6FFF] cursor-pointer text-white px-6 py-2 rounded-full font-medium hover:bg-[#4a5aee] transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
        <img
          className="w-5 sm:w-6 md:hidden cursor-pointer"
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt="menu"
        />
        {/* --------- Mobile Menu --------- */}
        <div
          className={` ${showMenu ? "fixed w-full h-full" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-4 sm:py-6 border-b border-gray-200">
            <img className="w-28 sm:w-36" src={assets.logo} alt="logo" />
            <img
              className="w-6 sm:w-7 cursor-pointer"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="close"
            />
          </div>
          <ul className="flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-5 text-base sm:text-lg font-medium">
            {navItems.map((item, index) => (
              <li className="w-full" key={index}>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "block w-full text-center px-4 py-3 rounded-lg bg-[#5f6FFF] text-white font-medium"
                      : "block w-full text-center px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {!token && (
              <>
                <li className="w-full mt-2">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setShowMenu(false);
                    }}
                    className="w-full text-[#5f6FFF] border border-[#5f6FFF] cursor-pointer px-6 py-3 rounded-full font-medium hover:bg-[#5f6FFF] hover:text-white transition-colors"
                  >
                    Login
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setShowMenu(false);
                    }}
                    className="w-full bg-[#5f6FFF] cursor-pointer text-white px-6 py-3 rounded-full font-medium hover:bg-[#4a5aee] transition-colors"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
