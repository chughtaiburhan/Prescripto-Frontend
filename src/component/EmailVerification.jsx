import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerification = ({ email: propEmail, onVerificationComplete }) => {
    const [verificationCode, setVerificationCode] = useState("");
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

    // Call verify-email API on mount (to trigger resend or check status)
    useEffect(() => {
        if (!email) return;
        const sendVerification = async () => {
            try {
                await axios.post(`${backendUrl}/api/user/verify-email`, { email });
                toast.success("Verification code sent to your email.");
            } catch (error) {
                toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to send verification code");
            }
        };
        sendVerification();
        // Only run on mount or when email changes
    }, [email, backendUrl]);

    const verifyCode = async () => {
        if (!verificationCode) {
            toast.error("Please enter the verification code");
            return;
        }

        if (!email) {
            toast.error("Email not found. Please try registering again.");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending verification request:", { email, code: verificationCode });

            const { data } = await axios.post(`${backendUrl}/api/user/verify-email`, {
                email: email,
                code: verificationCode
            });

            console.log("Verification response:", data);

            if (data.message) {
                toast.success("Email verified successfully!");
                if (onVerificationComplete) {
                    onVerificationComplete(verificationCode);
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
        <div className="w-full space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Email Verification Required
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    We need to verify your email address: <strong>{email}</strong>
                </p>
            </div>
            <div className="space-y-3">
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-center text-lg font-mono focus:outline-none focus:border-blue-500"
                        maxLength={6}
                    />
                </div>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={verifyCode}
                        disabled={isLoading || verificationCode.length !== 6}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md transition-colors"
                    >
                        {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 