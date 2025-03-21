import axios from "axios";
import  { useState, useTransition } from "react";

import { toast } from "react-toastify";
import { BASE_URL } from "../config/url";
import Notification from "../components/notification/Notification";

const ForgetPassword = () => {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  const handleChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // ✅ Fix: Call the function correctly

    if (!email) {
      toast.error("❌ Please enter your email.");
      return;
    }

    startTransition(async () => {
      try {
        const res=await axios.post (`${BASE_URL}/auth/forget-password`, {email: email})

        const result = res.data
        if (res.data.otp) {
          toast.success("✅ OTP sent to your email!");
          // navigate(`/verification/${res.data.id}`);
          setSuccess(res.data.id);
        } else {
          toast.error(`❌ ${result.message || "Something went wrong!"}`);
          setError(result.message || "Something went wrong!");
        }
      } catch (error) {
        toast.error("❌ Failed to send OTP. Try again later.");
        setError("❌ Failed to send OTP. Try again later.");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-15 px-4 sm:px-6 lg:px-8 font-sans">
      {success && <Notification isOpen={true} title="Success" message="OTP sent successfully" type="success" onClose={() => setSuccess('')} link={`/verification/${success}`}/>}
      {error && <Notification isOpen={true} title="Error" message={error} type="error" onClose={() => setError('')} />}
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-center">
          <img src="/nav-logo.png" alt="logo" className="w-[150px] h-[40px]" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-700 text-sm">Enter your email address</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEE36E] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-[#BEE36E] hover:bg-[#a8cc5c] disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
