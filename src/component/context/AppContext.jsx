import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.info(`This is backend URL ${backendUrl}`);

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(false);

  // 👇 Load token from localStorage on first load
 useEffect(() => {
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    setToken(savedToken);  // Set the token in the context
  }
}, []);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/doctors/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const userProfileData = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/user/get-profile`, {
      headers: { Authorization: `Bearer ${token}` },  // Use Bearer token format
    });

    if (data.success) {
      setUserData(data.userData);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || error.message);
  }
};


  useEffect(() => {
    getDoctorsData();
  }, []); // ✅ Prevent infinite calls

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
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
