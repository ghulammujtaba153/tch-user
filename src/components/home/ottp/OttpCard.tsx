import React, { useState } from "react";
import { BASE_URL } from "../../../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import Notification from "../../notification/Notification";

interface OtpCardProps {
  id: string;
}

const OtpCard: React.FC<OtpCardProps> = ({ id }) => {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [isPending, setIsPending] = useState(false);
  // const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    const otpString = otp.join("");

    if (otpString.length < 4) {
      toast.error("Please enter a valid 4-digit OTP.");
      return;
    }

    setIsPending(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/verify-password-reset-otp`, {
        id,
        otp: otpString,
      });
      console.log(res.data);

      
        toast.success("OTP verified successfully! Redirecting...");
        // navigate(`/newpassword/${id}`);
        setSuccess("OTP verified successfully!");
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to verify OTP.");
      setError(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 font-onest">
      {success && <Notification isOpen={true} title="Success" message="OTP verified successfully!" type="success" onClose={() => setSuccess('')} link={`/newpassword/${id}`}/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}
      <div className="w-full max-w-md bg-white p-6 rounded-xxxl shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src="/nav-logo.png" alt="logo" className="w-[180px] h-[50px]" />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
          <p className="text-gray-500 mt-2">Enter the verification code sent to your email:</p>
          <p className="text-secondary font-semibold">example@gmail.com</p>
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
            className="w-full col-span-4 mt-6 py-3 rounded-lg shadow-md text-sm font-medium text-white outline-none bg-secondary hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpCard;
