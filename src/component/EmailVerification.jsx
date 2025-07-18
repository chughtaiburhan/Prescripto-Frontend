import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerification = ({ email: propEmail, onVerificationComplete }) => {
    const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState(propEmail);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
    const location = useLocation();
    const navigate = useNavigate();

    // Get email from location state if not passed as prop
    useEffect(() => {
        if (!email && location.state?.email) {
            setEmail(location.state.email);
        }
    }, [email, location.state]);

    // Mask email for display
    const getMaskedEmail = (email) => {
        if (!email) return "";
        const [localPart, domain] = email.split('@');
        if (localPart.length <= 2) return email;
        return `${localPart.substring(0, 2)}**@${domain}`;
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return; // Only allow single character

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const verifyCode = async () => {
        const code = verificationCode.join('');
        if (code.length !== 4) {
            toast.error("Please enter the complete 4-digit verification code");
            return;
        }

        if (!email) {
            toast.error("Email not found. Please try registering again.");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending verification request:", { email, code });

            const { data } = await axios.post(`${backendUrl}/api/user/verify-email`, {
                email: email,
                code: code
            });

            console.log("Verification response:", data);

            if (data.message) {
                toast.success("Email verified successfully!");
                if (onVerificationComplete) {
                    onVerificationComplete(code);
                } else {
                    // Redirect to login if no callback provided
                    navigate("/login");
                }
            } else {
                toast.error(data.error || "Verification failed");
            }
        } catch (error) {
            console.error("Verification error:", error.response?.data || error);
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to verify code");
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        if (!email) {
            toast.error("Email not found");
            return;
        }

        try {
            await axios.post(`${backendUrl}/api/user/register`, {
                email: email,
                password: "temp", // This will be handled by backend to resend code
                name: "temp"
            });
            toast.success("Verification code resent successfully!");
        } catch (error) {
            toast.error("Failed to resend code. Please try again.");
        }
    };

    if (!email) {
        return (
            <div className="w-full space-y-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Email Not Found
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Please go back and register again.
                    </p>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                        Go to Registration
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Email Verification
                </h3>
                <p className="text-sm text-gray-600">
                    We have sent a code to your email {getMaskedEmail(email)}
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex justify-center space-x-3">
                    {verificationCode.map((digit, index) => (
                        <input
                            key={index}
                            id={`code-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            maxLength={1}
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={verifyCode}
                    disabled={isLoading || verificationCode.join('').length !== 4}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                    {isLoading ? "Verifying..." : "Verify Account"}
                </button>

                <div className="text-center">
                    <span className="text-sm text-gray-600">Didn't receive code? </span>
                    <button
                        onClick={resendCode}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Resend
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 