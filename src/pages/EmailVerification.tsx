import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/url";
import axios from "axios";
import {  useLocation } from "react-router-dom"; // Import useLocation
import { toast } from "react-toastify";
import Notification from "../components/notification/Notification";
import ReactGA from 'react-ga4';
import { useAppConfig } from "../context/AppConfigContext";

const EmailVerification = () => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [isPending, setIsPending] = useState(false);
  
  const location = useLocation(); // Use useLocation to access state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { config } = useAppConfig();


  useEffect(() => {
    if (config?.name) {
      document.title = `EmailVerification | ${config.name}`;
    }
  }, [config]);

  // Retrieve data passed from the previous page
  const { otp: sentOtp, userData } = location.state || {};

  // Handle input change & auto-focus next field
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field if the user types a digit
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combine the OTP digits into a single string
    const enteredOtp = otp.join("");

    // Check if the entered OTP matches the sent OTP
    if (enteredOtp !== sentOtp) {
      toast.error("Invalid OTP. Please try again.");
      setError("Invalid OTP. Please try again.");
      return;
    }

    setIsPending(true);

    try {

      // Register the user with the data from the previous page
      const res = await axios.post(`${BASE_URL}/auth/register`, userData);
      console.log(res.data);

      ReactGA.event({
        category: 'User',
        action: 'Created Account',
        label: 'Signup Form',
      });

      // Show success message and navigate to the home page
      toast.success("Registration successful!");
      setSuccess("Registration successful!");
      // navigate("/");
    } catch (error: any) {
      // Handle errors
      toast.error(error.response?.data?.message || "Registration failed.");
      setError(error.response?.data?.message || "Registration failed.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-onest">
      {success && (
        <Notification
          isOpen={true}
          title="Success"
          message="OTP verified successfully!"
          type="success"
          onClose={() => setSuccess("")}
          link="/signin"
        />
      )}
      {error && (
        <Notification
          isOpen={true}
          title="Error"
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      <div className="w-full max-w-md bg-white p-6 rounded-xxxl shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src="/nav-logo.png" alt="logo" className="w-[180px] h-[50px]" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-500 mt-2">Enter the verification code sent to your email:</p>
          <p className="text-secondary font-semibold">{userData?.email || "example@gmail.com"}</p>
        </div>

        {/* OTP Inputs */}
        <form className="grid grid-cols-4 gap-3 mt-5" onSubmit={handleSubmit}>
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-full h-12 text-center text-lg font-semibold border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                value
                  ? "border-secondary focus:ring-secondary"
                  : "border-gray-300 focus:ring-secondary"
              }`}
            />
          ))}

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full col-span-4 mt-6 py-3 rounded-lg shadow-md text-sm font-medium text-white outline-none bg-secondary hover:scale-105 transition-transform duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;