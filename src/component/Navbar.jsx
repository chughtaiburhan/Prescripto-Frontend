wwwimport React, { useState } from "react";
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
    toast.success("User Logout Successfully!");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="w-44 cursor-pointer "
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
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              src={userData.image}
              className="w-8 rounded-full"
              alt="prifile-pic"
            />
            <img
              src={assets.dropdown_icon}
              className="w-2.5"
              alt="drop-down-icon"
            />
            <div className="hidden absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 group-hover:block">
              <div className="min-w-48 bg-stone-100 flex flex-col gap-4 p-4 ">
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("my-profile")}
                >
                  My Profile
                </p>
                <p
                  className="hover:text-black cursor-pointer"
                  onClick={() => navigate("my-appointment")}
                >
                  My Appointment
                </p>
                <p className="hover:text-black cursor-pointer" onClick={logout}>
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] cursor-pointer text-white px-8 py-3 rounded-full font-light hidden md:block "
          >
            Create account
          </button>
        )}
        <img
          className="w-6 md:hidden"
          onClick={() => setShowMenu(true)}
          src={assets.menu_icon}
          alt=""
        />
        {/* --------- Mobile Menu --------- */}
        <div
          className={` ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="logo" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            {navItems.map((item, index) => (
              <li className="py-1" key={index}>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to={item.path}
                  activeClassName="active"
                >
                  <p className="px-4 py-2 rounded inline-block">{item.label}</p>
                  <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-5/5 m-auto hidden" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
