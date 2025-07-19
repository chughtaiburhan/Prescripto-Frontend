import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctor from "./pages/Doctor";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import InteractiveSection from "./component/InteractiveSection";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"
import ScrollToTop from "./component/ScrollToTop";
import EmailVerification from "./component/EmailVerification";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ScrollToTop />
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/email-verify" element={<EmailVerification />} />
      </Routes>
      <InteractiveSection />
      <Footer />
    </div>
  );
};
export default App;
