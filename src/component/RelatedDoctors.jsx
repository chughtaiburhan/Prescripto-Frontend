import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Heading, Paragraph, Button } from './common';

const RelatedDoctors = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className='flex flex-col items-center gap-4 sm:gap-5 m-0 text-gray-600 px-4 sm:px-6 md:px-10'>
      <div className='text-center max-w-4xl mx-auto'>
        <Heading
          text="Top Related Doctors to Book"
          size="4"
          color="gray-800"
          weight="medium"
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3"
        />
        <Paragraph
          text="Simply browse through our extensive list of trusted doctors."
          size="sm"
          color="gray-600"
          width="full"
          className="text-sm sm:text-base px-2 sm:px-4 md:px-8"
        />
      </div>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 pt-5 gap-y-6 px-2 sm:px-4 md:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-lg min-h-[280px] sm:min-h-[300px] md:min-h-[320px]'
          >
            <img
              className='bg-blue-50 w-full h-40 sm:h-44 md:h-48 object-cover object-top'
              src={item.image}
              alt={`${item.name}-profile`}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
              }}
            />
            <div className='p-3 sm:p-4'>
              <div className='flex items-center gap-2 text-xs sm:text-sm text-green-500 mb-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-sm sm:text-base md:text-lg font-medium mb-1'>{item.name}</p>
              <p className='text-gray-600 text-xs sm:text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        text="more"
        variant="secondary"
        size="lg"
        onClick={() => {
          navigate('/doctors');
          window.scrollTo(0, 0);
        }}
        className="mt-6 sm:mt-8 md:mt-10"
      />
    </div>
  );
};

export default RelatedDoctors;
