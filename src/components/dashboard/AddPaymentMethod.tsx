import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/url";

interface AddPaymentModalProps {
  userId: string;
  onClose: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ userId, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Handle Stripe onboarding
  const handleStripeOnboarding = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your backend to create a Stripe Connected Account
      const response = await axios.post(`${BASE_URL}/stripe/onboard`, {
        userId,
        email, // Pass the email to the backend
      });

      console.log("Backend response:", response.data); // Debugging log

      // Redirect the user to Stripe's onboarding page
      window.location.href = response.data.onboardingUrl;
    } catch (error: any) {
      console.error("Stripe onboarding error:", error); // Debugging log
      setError("Failed to start Stripe onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Payment Method</h2>

        {/* Email Input Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BEE36E]"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Stripe Onboarding Button */}
        <div className="mb-4">
          <button
            onClick={handleStripeOnboarding}
            disabled={loading}
            className="bg-[#BEE36E] text-black px-4 py-2 rounded-md hover:bg-[#a8cc5c] disabled:opacity-50"
          >
            {loading ? "Redirecting to Stripe..." : "Connect with Stripe"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Cancel Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;