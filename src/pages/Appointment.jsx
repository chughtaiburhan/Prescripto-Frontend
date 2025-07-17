import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../component/context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../component/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData } =
    useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.info("Doctor Info:", docInfo);
    console.info("Doctor Available:", docInfo?.available);
    console.info("Doctor Fees:", docInfo?.fees);
  };
  const bookAppointment = async () => {
    // Check if user is logged in
    if (!token) {
      toast.warn("Please register or login to book an appointment.");
      navigate("/login");
      return;
    }

    if (!docSlot[slotIndex] || docSlot[slotIndex].length === 0) {
      toast.error("No slot available for selected date.");
      return;
    }

    if (!slotTime) {
      toast.error("Please select a time slot.");
      return;
    }

    try {
      const date = docSlot[slotIndex][0]?.datetime;

      if (!date || !(date instanceof Date)) {
        toast.error("Invalid date slot selected.");
        return;
      }

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      // Determine the correct API endpoint based on user role
      const userRole = userData?.role || localStorage.getItem("userRole");
      const apiEndpoint = userRole === "doctor" ? "doctor/book-appointment" : "user/book-appointment";

      console.log("Booking appointment with:", {
        docId,
        slotDate,
        slotTime,
        userRole,
        apiEndpoint
      });

      const { data } = await axios.post(
        `${backendUrl}/${apiEndpoint}`,
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointment");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong while booking.");
      }
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  const getAvailableSlot = async () => {
    setDocSlot([]);
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlot = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        const isSlotAvailable =
          docInfo.slot_booked &&
            docInfo.slot_booked[slotDate] &&
            docInfo.slot_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlot.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlot);
    }

    setDocSlot(allSlots);
  };

  useEffect(() => {
    if (docInfo) {
      getAvailableSlot();
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/* Doctor Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg object-cover"
              src={docInfo.image}
              alt="doc-image"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(docInfo.name)}&background=5f6FFF&color=fff&size=300&rounded=true&bold=true`;
              }}
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt="verified_icon"
              />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[500px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees || 100}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-3 h-3 rounded-full ${docInfo.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${docInfo.available ? 'text-green-600' : 'text-red-600'}`}>
                {docInfo.available ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          {!docInfo.available ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Doctor Not Available</p>
              <p className="text-red-600 text-sm">This doctor is currently not available for appointments.</p>
            </div>
          ) : (
            <>
              <p>Booking slots</p>
              <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                {docSlot.length > 0 &&
                  docSlot.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSlotIndex(index)}
                      className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${index === slotIndex
                        ? "bg-[#5f6FFF] text-white"
                        : "bg-gray-100"
                        }`}
                    >
                      <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p>{item[0] && item[0].datetime.getDate()}</p>
                    </div>
                  ))}
              </div>
              <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                {docSlot.length > 0 &&
                  docSlot[slotIndex] &&
                  docSlot[slotIndex].map((item, index) => (
                    <p
                      key={index}
                      onClick={() => setSlotTime(item.time)}
                      className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime
                        ? "bg-[#5f6FFF] text-white"
                        : "text-gray-400 border border-gray-300"
                        }`}
                    >
                      {item.time.toLowerCase()}
                    </p>
                  ))}
              </div>
              {!token ? (
                <div className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium mb-2">Login Required</p>
                  <p className="text-blue-600 text-sm mb-3">Please login or register to book an appointment.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="bg-[#5f6FFF] cursor-pointer text-white text-sm font-light px-6 py-2 rounded-full"
                    >
                      Login
                    </button> 
                  </div>
                </div>
              ) : (
                <button
                  onClick={bookAppointment}
                  className="bg-[#5f6FFF] cursor-pointer text-white text-sm font-light px-14 py-3 rounded-full my-6"
                >
                  Book appointment
                </button>
              )}
            </>
          )}
        </div>
        {/* Listening related doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
