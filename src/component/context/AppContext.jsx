import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = "https://prescripto-backend-beta-nine.vercel.app";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load token from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserData = localStorage.getItem("userData");

    if (savedToken) {
      setToken(savedToken);
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }
  }, []);

  // User Registration
  const userRegister = async (userData) => {
    setLoading(true);
    try {
      console.log("Sending registration data:", userData);

      // Use user registration API
      const { data } = await axios.post(`${backendUrl}/api/user/register`, userData);

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userData", JSON.stringify(data.userData));
        setToken(data.token);
        setUserData(data.userData);

        return { success: true, token: data.token, userData: data.userData };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // User Login
  const userLogin = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });
      if (data.success) {
        // Store token and user data
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.userData.role);
        localStorage.setItem("userData", JSON.stringify(data.userData));
        setUserData(data.userData);

        return { success: true, token: data.token, userData: data.userData };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // User Logout
  const userLogout = () => {
    setToken("");
    setUserData(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    toast.success("Logged out successfully!");
  };

  // Get Doctors List
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctors/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Get User Profile Data
  const userProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Book Appointment
  const bookAppointment = async (appointmentData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Appointment booked successfully!");
        return { success: true, data: data.appointment };
      } else {
        toast.error(data.message || "Failed to book appointment");
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Get User Appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        return { success: true, appointments: data.appointments };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, message: errorMessage };
    }
  };

  // Cancel Appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.success) {
        toast.success("Appointment cancelled successfully!");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to cancel appointment");
        return { success: false, message: data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      userProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    userProfileData,
    userRegister,
    userLogin,
    userLogout,
    bookAppointment,
    getUserAppointments,
    cancelAppointment,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
