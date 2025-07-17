import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import Notification from "../notification/Notification";
import ReactGA from 'react-ga4';
import { useAppConfig } from "../../context/AppConfigContext";

interface VerificationStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ data, setData, onNext, onBack }) => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { config } = useAppConfig();

  const userData = data;

  useEffect(() => {
    if (config?.name) {
      document.title = `Verification | ${config.name}`;
    }
  }, [config]);

  // ✅ Send OTP once when component mounts
  useEffect(() => {
    const generateAndSendOtp = async () => {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtp(generatedOtp);

      try {
        await axios.post(`${BASE_URL}/auth/send-otp`, {
          email: userData.email,
          otp: generatedOtp,
        });
        toast.success("OTP sent to your email");
      } catch (error) {
        toast.error("Failed to send OTP");
        console.error("Send OTP Error:", error);
      }
    };

    if (userData?.email) {
      generateAndSendOtp();
    }
  }, [userData]);

  // ✅ Handle input
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // ✅ Submit OTP and Register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
  
    if (enteredOtp !== sentOtp) {
      toast.error("Invalid OTP. Please try again.");
      setError("Invalid OTP.");
      return;
    }
  
    setIsPending(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, userData);
  
      // ✅ Store user info in signupData
      setData({
        ...userData,
        registeredUser: res.data.user, // Save the new user details
        token: res.data.token || null, // If backend sends token
      });
  
      toast.success("Registration successful!");
      onNext();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed.");
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsPending(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-xxxl shadow-lg">
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

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Verification</h1>
        <p className="text-gray-600">Enter the OTP sent to your email:</p>
        <p className="text-secondary font-semibold">{userData?.email || "example@gmail.com"}</p>
      </div>

      <form className="grid grid-cols-4 gap-3" onSubmit={handleSubmit}>
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-full h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        ))}
        <button
          type="submit"
          disabled={isPending}
          className="col-span-4 mt-6 py-3 rounded-lg shadow-md text-sm font-medium text-white bg-secondary hover:scale-105 transition-transform duration-300 disabled:bg-gray-300"
        >
          {isPending ? "Verifying..." : "Verify"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="col-span-4 mt-3 text-sm text-gray-500 underline"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default VerificationStep;
