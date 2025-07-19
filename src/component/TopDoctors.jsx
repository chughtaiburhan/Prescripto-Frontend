import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from './context/AppContext';
import { Heading, Paragraph, Button } from './common'

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center gap-5 my-8 sm:my-12 md:my-16 text-gray-600 px-4 sm:px-6 md:px-10'>
      <div className='text-center max-w-4xl mx-auto'>
        <Heading
          text="Top Doctors to Book"
          size="3"
          color="gray-800"
          weight="medium"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4"
        />
        <Paragraph
          text="Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free"
          size="lg"
          color="gray-500"
          width="full"
          className="mb-4 text-sm sm:text-base md:text-lg px-2 sm:px-4 md:px-8"
        />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pt-5 gap-y-6 px-2 sm:px-4 md:px-0">
        {
          doctors.slice(0, 10).map((item, index) => (
            <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-lg min-h-[320px] sm:min-h-[340px] md:min-h-[360px]'>
              <img
                className='bg-blue-50 w-full h-48 sm:h-52 md:h-56 object-cover object-top'
                src={item.image}
                alt="doctor's-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
                }}
              />
              <div className='p-3 sm:p-4'>
                <div className='flex items-center gap-2 text-xs sm:text-sm text-center text-green-500 mb-2'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-gray-900 text-sm sm:text-base md:text-lg font-medium mb-1'>{item.name}</p>
                <p className='text-gray-600 text-xs sm:text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))
        }
      </div>
      <Button
        text="more"
        variant="secondary"
        size="lg"
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
        className="mt-6 sm:mt-8 md:mt-10"
      />
    </div>
  )
}

export default TopDoctors
