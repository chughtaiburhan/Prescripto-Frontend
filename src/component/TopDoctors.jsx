import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { AppContext } from './context/AppContext';
import { Heading, Paragraph, Button } from './common'

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className='flex flex-col items-center gap-5 my-16 text-gray-600 md:mx-10'>
      <Heading
        text="Top Doctors to Book"
        size="3"
        color="gray-800"
        weight="medium"
      />
      <Paragraph
        text="Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free"
        size="lg"
        color="gray-500"
        width="2/3"
        className="mb-4"
      />
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {
          doctors.slice(0, 10).map((item, index) => (
            <div onClick={() => navigate(`/appointment/${item._id}`)} key={index} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 '>
              <img
                className='bg-blue-50 w-full h-48 object-cover'
                src={item.image}
                alt="doctor's-image"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
                }}
              />
              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Abailable</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
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
        className="mt-10"
      />
    </div>
  )
}

export default TopDoctors
