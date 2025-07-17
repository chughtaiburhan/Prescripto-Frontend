import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'
import { Heading, Paragraph } from './common'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-10 sm:pt-16 sm:pb-0  text-gray-600' id='speciality'>
      <Heading
        text="Find by Speciality"
        size="3"
        color="gray-800"
        weight="medium"
      />
      <Paragraph
        text="Find the best specialists for your needs, view their profiles, and book appointments with just a few clicks. Our doctors are highly qualified, experienced."
        size="lg"
        color="gray-600"
        width="11/12"
      />
      <div className='flex sm:justify-center gap-3 sm:gap-5 pt-5 w-full overflow-x-auto'>
        {
          specialityData.map((item, index) => (
            <Link onClick={() => scrollTo(0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
              <img className='w-16 sm:w-24' src={item.image} alt={item.speciality} />
              <p>{item.speciality}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default SpecialityMenu
