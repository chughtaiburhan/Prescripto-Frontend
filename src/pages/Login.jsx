import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../component/context/AppContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import EmailVerification from "../component/EmailVerification";

const Login = () => {
  const { userLogin, token, backendUrl } = useContext(AppContext);
  const location = useLocation();
  const [state, setState] = useState(location.pathname === "/signup" ? "Sign Up" : "Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({ line1: "", line2: "" });
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  // Removed unused pendingEmail state
  const navigate = useNavigate();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasLowercase: false,
    hasNumber: false,
    hasUppercase: false
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      hasMinLength: password.length >= 6,
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password)
    });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  // Update state when route changes
  useEffect(() => {
    setState(location.pathname === "/signup" ? "Sign Up" : "Login");
  }, [location.pathname]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        // Call registration API to create user and send verification code
        const registrationData = {
          name,
          email,
          password,
          role,
          phone,
          address: {
            line: address.line1,
            line2: address.line2
          },
          gender,
          dob: birthday,
          image: profilePicture,
        };

        const response = await axios.post(`${backendUrl}/api/user/register`, registrationData);

        if (response.data.success) {
          toast.success("Registration successful! Please check your email for verification code.");

          // Redirect to EmailVerification component & pass data
          navigate("/email-verify", {
            state: {
              email,
              registrationData, // form fields
            },
          });
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      } else {
        const result = await userLogin(email, password);
        if (result.success) {
          localStorage.setItem("token", result.token);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(result.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/user/verify-email`,
        { email: email, code: verifyCode }
      );
      if (res.data.message) {
        toast.success("Email verified! You can now login.");
        setShowVerifyModal(false);
        setState("Login");
        navigate("/login");
        setEmail(email);
        setPassword("");
      } else {
        toast.error(res.data.error || "Invalid code. Please try again.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Invalid code. Please try again.");
    }
  };

  // Forgot Password Step 1: Request reset code
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/user/forgot-password`, { email: forgotEmail });
      if (res.data.message) {
        toast.success("Reset code sent to your email.");
        setShowForgotModal(false);
        setShowResetModal(true);
      } else {
        toast.error(res.data.error || "Could not send reset code.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Could not send reset code.");
    }
  };

  // Forgot Password Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/user/reset-password`, {
        email: forgotEmail,
        code: resetCode,
        newPassword: resetNewPassword,
      });
      if (res.data.message) {
        toast.success("Password reset successfully! You can now login.");
        setShowResetModal(false);
        setState("Login");
        navigate("/login");
        setEmail(forgotEmail);
        setPassword("");
      } else {
        toast.error(res.data.error || "Could not reset password.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.response?.data?.message || "Could not reset password.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [token, navigate]);

  const switchMode = (newState) => {
    setState(newState);
    setName("");
    setEmail("");
    setPassword("");
    setRole("patient");
    setPhone("");
    setAddress({ line1: "", line2: "" });
    setGender("");
    setBirthday("");
    setProfilePicture(null);

    // Navigate to appropriate route
    if (newState === "Sign Up") {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold">
            {state === "Sign Up" ? "Create Account" : "Login"}
          </p>
          <p>
            Please {state === "Sign Up" ? "Sign up" : "Login"} to {state === "Sign Up" ? "join" : "access"} Prescripto
          </p>

          {state === "Sign Up" && (
            <>
              {/* Role Selector - Full width */}
              <div className="w-full">
                <p className="font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Select Role *
                </p>
                <select
                  className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF] bg-white"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  required
                >
                  <option value="patient">👤 Patient - Book appointments</option>
                  <option value="doctor">👨‍⚕️ Doctor - Access admin panel</option>
                </select>

                {role === "doctor" && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700 font-medium">
                      Note: Doctors can access both the website and admin panel
                    </p>
                  </div>
                )}

                {role === "patient" && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-700 font-medium">
                      Patients can book appointments and access the website
                    </p>
                  </div>
                )}
              </div>

              {/* Name - Full width */}
              <div className="w-full">
                <p className="font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Full Name *
                </p>
                <input
                  className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email and Password - 2 columns */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    Email *
                  </p>
                  <input
                    className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <p className="font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    Password *
                  </p>
                  <input
                    className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                    type="password"
                    onChange={handlePasswordChange}
                    value={password}
                    placeholder="Enter your password"
                    required
                    autoComplete="new-password"
                  />
                  {/* Password Strength Indicator */}
                  {state === "Sign Up" && (
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                        <svg className={`w-4 h-4 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          {passwordStrength.hasMinLength ? (
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          ) : (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          )}
                        </svg>
                        <span>At least 6 characters</span>
                      </div>

                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <svg className={`w-4 h-4 ${passwordStrength.hasLowercase ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          {passwordStrength.hasLowercase ? (
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          ) : (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          )}
                        </svg>
                        <span>Lowercase letter (a-z)</span>
                      </div>

                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        <svg className={`w-4 h-4 ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          {passwordStrength.hasNumber ? (
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          ) : (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          )}
                        </svg>
                        <span>Number (0-9)</span>
                      </div>

                      <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <svg className={`w-4 h-4 ${passwordStrength.hasUppercase ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          {passwordStrength.hasUppercase ? (
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          ) : (
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          )}
                        </svg>
                        <span>Uppercase letter (A-Z)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Show additional fields only for patients - 2 columns layout */}
              {role === "patient" && (
                <>
                  {/* Phone and Gender - 2 columns */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        Phone Number *
                      </p>
                      <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                        type="tel"
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Gender *
                      </p>
                      <select
                        className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF] bg-white"
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Birthday and Profile Picture - 2 columns */}
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        Date of Birth *
                      </p>
                      <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                        type="date"
                        onChange={(e) => setBirthday(e.target.value)}
                        value={birthday}
                        required
                      />
                    </div>

                    <div>
                      <p className="font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Profile Picture
                      </p>
                      <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Address fields - Full width */}
                  <div className="w-full">
                    <p className="font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Address Line 1 *
                    </p>
                    <input
                      className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                      type="text"
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      value={address.line1}
                      placeholder="Enter your address"
                      required
                    />
                  </div>

                  <div className="w-full">
                    <p className="font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Address Line 2
                    </p>
                    <input
                      className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                      type="text"
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      value={address.line2}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                </>
              )}



              {state === "Login" && (
                <button
                  type="button"
                  className="text-blue-500 underline text-xs mt-1 mb-2 self-end"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </button>
              )}

              {state === "Sign Up" ? (
                <>
                </>
              ) : (
                <p className="text-center w-full">
                  Create a new account?{" "}
                  <span
                    onClick={() => switchMode("Sign Up")}
                    className="text-[#5f6FFF] underline cursor-pointer hover:text-[#4a5aee]"
                  >
                    Click here
                  </span>
                </p>
              )}
            </>
          )}

          {/* Login form - Email and Password in 2 columns */}
          {state === "Login" && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  Email *
                </p>
                <input
                  className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <p className="font-medium flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5f6FFF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                  Password *
                </p>
                <input
                  className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6FFF]"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-[#5f6FFF] hover:bg-[#4a5aee] cursor-pointer text-white w-full py-3 rounded-md text-base font-medium transition-colors"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>

          {state === "Login" && (
            <button
              type="button"
              className="text-blue-500 underline text-xs mt-1 mb-2 self-end"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </button>
          )}

          {state === "Sign Up" ? (
            <p className="text-center w-full">
              Already have an account?{" "}
              <span
                onClick={() => switchMode("Login")}
                className="text-[#5f6FFF] underline cursor-pointer hover:text-[#4a5aee]"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-center w-full">
              Create a new account?{" "}
              <span
                onClick={() => switchMode("Sign Up")}
                className="text-[#5f6FFF] underline cursor-pointer hover:text-[#4a5aee]"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="bg-white border border-zinc-200 p-8 rounded-xl shadow-2xl min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2 text-[#5f6FFF]">Email Verification</h2>
            <p className="mb-4 text-gray-600 text-sm">Enter the verification code sent to your email.</p>
            <form onSubmit={handleVerify} className="flex flex-col gap-3 w-full">
              <input
                type="text"
                className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-[#5f6FFF] text-center"
                placeholder="Enter code"
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#5f6FFF] hover:bg-[#4a5aee] text-white py-2 rounded font-medium"
              >
                Verify Email
              </button>
              <button
                type="button"
                className="text-gray-500 mt-2 underline"
                onClick={() => setShowVerifyModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Forgot Password</h2>
            <p className="mb-4 text-gray-600 text-sm">Enter your email to receive a reset code.</p>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3 w-full">
              <input
                type="email"
                className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-[#5f6FFF] text-center"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#5f6FFF] hover:bg-[#4a5aee] text-white py-2 rounded font-medium"
              >
                Send Reset Code
              </button>
              <button
                type="button"
                className="text-gray-500 mt-2 underline"
                onClick={() => setShowForgotModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
            <p className="mb-4 text-gray-600 text-sm">Enter the code sent to your email and your new password.</p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-3 w-full">
              <input
                type="text"
                className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-[#5f6FFF] text-center"
                placeholder="Enter reset code"
                value={resetCode}
                onChange={e => setResetCode(e.target.value)}
                required
              />
              <input
                type="password"
                className="border border-zinc-300 rounded p-2 focus:outline-none focus:border-[#5f6FFF] text-center"
                placeholder="Enter new password"
                value={resetNewPassword}
                onChange={e => setResetNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#5f6FFF] hover:bg-[#4a5aee] text-white py-2 rounded font-medium"
              >
                Reset Password
              </button>
              <button
                type="button"
                className="text-gray-500 mt-2 underline"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
