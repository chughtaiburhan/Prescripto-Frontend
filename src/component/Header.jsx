import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='relative flex flex-col md:flex-row flex-wrap bg-[#5f6FFF] px-6 md:px-10 lg:px-20 rounded-sm overflow-hidden'>
      {/* Animated 3D Medical Background */}
      <div className='absolute inset-0 pointer-events-none z-0'>
        {/* Floating Circles */}
        <svg width="100%" height="100%" className="animate-float-slow" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
          <circle cx="10%" cy="20%" r="40" fill="#fff" fillOpacity="0.08">
            <animate attributeName="cy" values="20%;30%;20%" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle cx="80%" cy="70%" r="60" fill="#fff" fillOpacity="0.10">
            <animate attributeName="cy" values="70%;60%;70%" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="10%" r="30" fill="#fff" fillOpacity="0.07">
            <animate attributeName="cy" values="10%;18%;10%" dur="7s" repeatCount="indefinite" />
          </circle>
        </svg>
       
        {/* Floating Medical Cross */}
        <svg width="60" height="60" className="absolute left-[80%] top-[15%] animate-float-fast" style={{ zIndex: 0 }}>
          <rect x="25" y="10" width="10" height="40" rx="3" fill="#fff" fillOpacity="0.13" />
          <rect x="10" y="25" width="40" height="10" rx="3" fill="#fff" fillOpacity="0.13" />
        </svg>
      </div>
      {/* Left Side */}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] '>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight '>
          Book Appointment <br /> With Trusted Doctor
        </p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light '>
          <img className='w-28' src={assets.group_profiles} alt="group_profile" />
          <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' />
            schedule your appointment hassle-free.</p>
        </div>
        <Link to="/about" className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
          Learn more about our specialities  <img src={assets.arrow_icon} alt="arrow-icon" className='w-3' />
        </Link>
      </div>
      {/* Right Side  */}
      <div className='md:w-1/2  relative'>
        <img src={assets.header_img} className='w-full md:absolute bottom-0 h-auto rounded-full animate-zoom-inout' alt="header-img" />
      </div>
    </div>
  )
}

export default Header
