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
    <div className='flex flex-col items-center gap-5 m-0 text-gray-600 md:mx-10'>
      <Heading
        text="Top Related Doctors to Book"
        size="4"
        color="gray-800"
        weight="medium"
      />
      <Paragraph
        text="Simply browse through our extensive list of trusted doctors."
        size="sm"
        color="gray-600"
        width="1/3"
      />
      <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              window.scrollTo(0, 0);
            }}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
          >
            <img
              className='bg-blue-50 w-full h-48 object-cover'
              src={item.image}
              alt={`${item.name}-profile`}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
              }}
            />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-green-500'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
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
        className="mt-10"
      />
    </div>
  );
};

export default RelatedDoctors;
