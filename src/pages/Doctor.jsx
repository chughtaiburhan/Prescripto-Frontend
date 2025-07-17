import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../component/context/AppContext";

const Doctor = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  useEffect(() => {
    setLoading(true);
    if (speciality) {
      // Filter doctors by speciality (case-insensitive)
      const filtered = doctors.filter((doc) =>
        doc.speciality && doc.speciality.toLowerCase() === speciality.toLowerCase()
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
    // Simulate loading time
    setTimeout(() => setLoading(false), 1000);
  }, [doctors, speciality]);

  const handleFilterClick = (item) => {
    if (speciality === item) {
      // If same speciality is clicked, go to all doctors
      navigate("/doctors");
    } else {
      // Navigate to specific speciality
      navigate(`/doctors/${item}`);
    }
    setShowFilter(false); // auto close list on item click
  };


  // Skeleton component for doctor card
  const DoctorSkeleton = () => (
    <div className="border border-blue-200 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-gray-200 w-full h-48"></div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
        </div>
        <div className="w-32 h-2 bg-gray-200 rounded mb-2"></div>
        <div className="w-24 h-2 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>

      <button
        className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-[#5f6FFF] text-white" : ""}`}
        onClick={() => setShowFilter((prev) => !prev)}
      >
        Filters
      </button>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
          {/* All Doctors option */}
          <p
            onClick={() => handleFilterClick("")}
            className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer 
              ${!speciality ? "bg-indigo-100 text-black" : ""}`}
          >
            All Doctors
          </p>

          {specialities.map((item, index) => (
            <p
              key={index}
              onClick={() => handleFilterClick(item)}
              className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer 
                ${speciality === item ? "bg-indigo-100 text-black" : ""}`}
            >
              {item}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {loading ? (
            // Show skeletons based on the number of doctors that will be displayed
            Array.from({ length: speciality ? Math.min(doctors.length, 8) : Math.min(doctors.length, 12) }).map((_, index) => (
              <DoctorSkeleton key={index} />
            ))
          ) : filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              >
                <img
                  className="bg-blue-50 w-full h-48 object-cover"
                  src={item.image}
                  alt="doctor"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
                  }}
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">
                {speciality ? `No doctors found for ${speciality}` : "No doctors available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctor;
