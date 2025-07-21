import React, { useState, useEffect } from "react";
import { useAppConfig } from "../../context/AppConfigContext";
import Notification from "../notification/Notification";
import GoogleLoginButton from "../home/GoogleButton";
import MicrosoftLoginButton from "../home/MicrosoftButton";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

interface Props {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
}

const PersonalInfoStep: React.FC<Props> = ({ data, setData, onNext }) => {
  const [hide, setHide] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [error, setError] = useState("");
  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = `Signup | ${config.name}`;
    }
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.firstName || !data.lastName || !data.email || !data.phoneNumber || !data.password || !data.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate phone number (should be at least 10 digits including country code)
    if (data.phoneNumber && data.phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    // ✅ Combine first and last name before sending to API
    setData({ ...data, name: `${data.firstName} ${data.lastName}` });

    setError("");
    onNext();
  };

  return (
    <div className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <style>{`
        .phone-input-container {
          width: 100% !important;
        }
        .phone-input-container .form-control {
          width: 100% !important;
          height: 42px !important;
          border-radius: 8px !important;
          border: 1px solid #d1d5db !important;
          background-color: #f9fafb !important;
          padding-left: 50px !important;
          font-size: 14px !important;
        }
        .phone-input-container .form-control:focus {
          outline: none !important;
          // border-color: #B42318 !important;
          box-shadow: 0 0 0 2px rgba(180, 35, 24, 0.2) !important;
        }
        .phone-input-button {
          background-color: #f9fafb !important;
          border: 1px solid #d1d5db !important;
          border-right: none !important;
          border-radius: 8px 0 0 8px !important;
        }
        .phone-input-dropdown {
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        .phone-input-search {
          border-radius: 6px !important;
          border: 1px solid #d1d5db !important;
          padding: 8px !important;
        }
      `}</style>
      <div className="flex items-center justify-center">
        <img src={config?.logo} alt="logo" className="h-[70px] w-[190px]" />
      </div>
      <h1 className="font-bold text-center text-2xl">REGISTER</h1>
      {error && (
        <Notification
          isOpen={true}
          title="Error"
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      <form className="mt-8 space-y-6 font-sans" onSubmit={handleNext}>
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={data.firstName || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={data.lastName || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter your last name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={data.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <PhoneInput
              country={'za'}
              value={data.phoneNumber || ""}
              onChange={(phone) => setData({ ...data, phoneNumber: phone })}
              enableSearch={true}
              inputClass="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              containerClass="phone-input-container"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              searchClass="phone-input-search"
              placeholder="Enter your phone number"
            />
          </div>
          

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type={hide ? "password" : "text"}
              required
              value={data.password || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent pr-10"
              placeholder="••••••••"
            />
            <img
              src={hide ? "/hide.png" : "/view.png"}
              onClick={() => setHide(!hide)}
              alt="toggle"
              className="absolute right-3 top-8 w-6 h-6 cursor-pointer"
            />
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={hideConfirm ? "password" : "text"}
              required
              value={data.confirmPassword || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="••••••••"
            />
            <img
              src={hideConfirm ? "/hide.png" : "/view.png"}
              onClick={() => setHideConfirm(!hideConfirm)}
              alt="toggle"
              className="absolute right-3 top-8 w-6 h-6 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          Next
        </button>

        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account? <a href="/signin" className="font-medium text-secondary hover:text-gray-900">Login</a>
        </p>

        <div className="flex items-center justify-center space-x-4">
          <GoogleLoginButton />
        </div>
        <div className="flex items-center justify-center space-x-4">
          <MicrosoftLoginButton />
        </div>
        <p className="mt-6 text-sm text-center">Version 1.2.0</p>
      </form>
    </div>
  );
};

export default PersonalInfoStep;
