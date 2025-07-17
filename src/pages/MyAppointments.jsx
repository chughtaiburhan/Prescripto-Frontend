import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../component/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch user appointments
  const getUserAppointment = async () => {
    try {
      if (!token) {
        toast.warn("Please log in to view appointments.");
        return;
      }

      const { data } = await axios.get(`${backendUrl}/user/appointment`, {
        headers: { Authorization: `Bearer ${token}` }, // Use Bearer token format
      });

      if (data.success) {
        setAppointment(data.appointment.reverse()); // Reverse appointments to show latest first
      } else {
        toast.error("Could not fetch appointments.");
      }
    } catch (error) {
      console.error("Fetch appointment error:", error);
      if (error.response?.status === 401) {
        toast.warn("Session expired. Please log in again.");
        // Optional: Clear token and redirect to login page
        // localStorage.removeItem("token");
        // navigate("/login");
      } else {
        toast.error("Something went wrong while fetching appointments.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      if (!token) {
        toast.warn("Please log in to cancel appointments.");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } } // Use Bearer token format
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointment();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Cancel appointment error:", error);
      toast.error("Something went wrong while cancelling appointment.");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  if (loading) return <p className="mt-10 text-gray-600">Loading appointments...</p>;

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

      {appointment.length === 0 ? (
        <p className="mt-6 text-gray-500 text-sm">No appointments found.</p>
      ) : (
        <div>
          {appointment.map((item, index) => {
            const doc = item?.docId || {}; // Handle null docId gracefully
            const address = doc?.address || {}; // Handle missing address gracefully
            return (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b items-center"
                key={index}
              >
                {/* Doctor Image */}
                <div>
                  <img
                    className="w-32 h-32 object-cover rounded-md bg-indigo-50"
                    src={doc?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc?.name || "Doctor")}&background=5f6FFF&color=fff&size=128&rounded=true&bold=true`}
                    alt={`${doc?.name || "Doctor"}-img`}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc?.name || "Doctor")}&background=5f6FFF&color=fff&size=128&rounded=true&bold=true`;
                    }}
                  />
                </div>

                {/* Appointment Details */}
                <div className="flex-1 text-sm text-zinc-600">
                  <p className="text-neutral-800 font-semibold">
                    {doc?.name || "Unknown Doctor"}
                  </p>
                  <p>{item?.speciality || "Speciality not provided"}</p>

                  <p className="text-zinc-700 font-medium mt-1">Address:</p>
                  <p className="text-xs">{address?.line1 || "N/A"}</p>
                  <p className="text-xs">{address?.line2 || ""}</p>

                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                    {item?.slotDate || "N/A"} | {item?.slotTime || "N/A"}
                  </p>
                  {/* Status Label */}
                  <p className={`mt-2 text-xs font-bold ${item?.cancelled ? 'text-red-500' : 'text-green-600'}`}>
                    Status: {item?.cancelled ? 'Cancelled' : 'Booked'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 justify-end">
                  {!item?.cancelled && (
                    <>
                      <button
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-[#5f6FFF] hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-[#5f6FFF] hover:text-white transition-all duration-300"
                      >
                        Cancel Appointment
                      </button>
                    </>
                  )}
                  {item?.cancelled && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 ">
                      Appointment Cancelled
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
