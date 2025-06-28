import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Notification from "../notification/Notification";
import { AuthContext } from "../../context/userContext";
import axios from "axios";
import { BASE_URL, SOCKET_URL } from "../../config/url";
import { io, Socket } from "socket.io-client";
import { FormControlLabel, Switch } from "@mui/material";
import ReactGA from "react-ga4";

type PaymentMethod = "Test Donation" | "Cardiant Donation" | "Office Donation";

interface FormData {
  donorId: string | undefined;
  campaignId: string;
  organizationId: any | undefined;
  amount: string;
  donorName: string;
  donorEmail: string;
  companyName: string;
  postalCode: string;
  city: string;
  houseNumber: string;
  anonymous: boolean;
}

declare global {
  interface Window {
    hpp: any
  }
}


const DonationForm: React.FC<{
  id: string;
  campaigner: string;
  organizationId: string;
  communication: string;
}> = ({ id, campaigner, organizationId, communication }) => {
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>("Test Donation");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string>("150");
  const [isDonate, setIsDonate] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState("");
  const { user } = useContext(AuthContext)!;
  const [isPending, startTransition] = useTransition();
  const socketRef = useRef<Socket | null>(null);
  console.log("donation form user", organizationId);

  const tipOptions = [5, 10, 15, 20]; // in percentages
  const [selectedTip, setSelectedTip] = useState(0);

  





  const handleTipSelect = (tip: number) => {
    setSelectedTip(tip);
  };

  const [formData, setFormData] = useState<FormData>({
    donorId: user?.userId,
    campaignId: id,
    organizationId: organizationId,
    amount: "150",
    donorName: user?.name || "",
    donorEmail: user?.email || "",
    companyName: "",
    postalCode: "",
    city: "",
    houseNumber: "",
    anonymous: false,
  });

  useEffect(() => {
    socketRef.current = io(`${SOCKET_URL}`); // Replace with your server URL

    socketRef.current.emit("join-room", campaigner);

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const predefinedAmounts = [
    { value: "150", label: "R150" },
    { value: "170", label: "R170" },
    { value: "190", label: "R190" },
    { value: "250", label: "R250" },
  ];

  ReactGA.event({
    category: "Donation",
    action: "Donate Button Clicked",
    label: selectedMethod,
    value: parseFloat(formData.amount),
  });

  const validateForm = () => {
    if (!formData.donorName.trim()) {
      setErrors("Name is required");
      return false;
    }

    if (!formData.donorEmail.trim()) {
      setErrors("Email is required");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      setErrors("Invalid email format");
      return false;
    }

    if (!formData.companyName.trim()) {
      setErrors("Company name is required");
      return false;
    }

    if (!formData.postalCode.trim()) {
      setErrors("Postcode is required");
      return false;
    }

    if (!formData.city.trim()) {
      setErrors("City is required");
      return false;
    }

    if (!formData.houseNumber.trim()) {
      setErrors("House number is required");
      return false;
    }

    if (!agreeToTerms) {
      setErrors("Please agree to the Terms of Service");
      return false;
    }

    return true;
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setFormData((prev) => ({ ...prev, amount }));
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount("");
    setFormData((prev) => ({ ...prev, amount: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors("");
  };


  useEffect(() => {
  const scriptExists = document.querySelector("script[src*='ecentric']");
  if (!scriptExists) {
    const script = document.createElement("script");
    script.src = "https://sandbox.ecentric.co.za/hpp/api/js";
    script.async = true;
    script.onload = () => console.log("Ecentric Lightbox loaded");
    script.onerror = () => console.error("Failed to load Ecentric script");
    document.body.appendChild(script);
  }
}, []);



  const handleDonate = async () => {
    if (!validateForm()) {
      return;
    }
    if (!user) {
      setErrors("Please log in to donate");
      return;
    }
    console.log(formData);
    console.log(user);
    formData.donorId = user.userId;
    startTransition(async () => {
      try {
        // const response = await axios.post(`${BASE_URL}/donations`, formData);

        // const res = await axios.post(
        //   `${BASE_URL}/notifications/create`,
        //   {
        //     userId: campaigner,
        //     title: "New Donation",
        //     message: `A new donation of R${formData.amount} has been made to your campaign.`,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("token")}`,
        //     },
        //   }
        // );

        // ReactGA.event({
        //   category: "Donation",
        //   action: "Donate Button Clicked",
        //   label: selectedMethod,
        //   value: parseFloat(formData.amount),
        // });

        // const notification = res.data;

        // socketRef.current?.emit("send-notification", {
        //   campaigner,
        //   notification,
        // });



         const reference = `DONATE${Date.now()}`; // Unique alphanumeric
    const amountCents = parseFloat(formData.amount) * 100;

    const { data: paymentData } = await axios.post(`${BASE_URL}/ecentric/initiate`, {
      amount: amountCents.toFixed(0),
      reference,
      userId: user?.userId, // optional
      transactionType: "Payment"
    });

    // Check if Lightbox is ready
    if (window.hpp?.payment) {
      window.hpp.payment(
        paymentData,
        (successData: any) => {
          console.log("Payment Success", successData);
          alert("Payment completed successfully!");
          // Redirect to success page or show notification
        },
        (failData: any) => {
          console.error("Payment Failed", failData);
          alert("Payment failed. Please try again.");
        }
      );
    } else {
      alert("Payment system not ready. Please refresh the page.");
    }



        // if (response.status === 201) {
        //   setIsDonate(true);
        //   // Reset form
        //   setFormData({
        //     donorId: user?.userId,
        //     campaignId: id,
        //     organizationId: organizationId,
        //     amount: "150",
        //     donorName: "",
        //     donorEmail: "",
        //     companyName: "",
        //     postalCode: "",
        //     city: "",
        //     houseNumber: "",
        //     anonymous: false,
        //   });
        //   setSelectedAmount("150");
        //   setCustomAmount("");
        //   setAgreeToTerms(false);
        // }
      } catch (error) {
        setErrors("Failed to process donation. Please try again.");
        console.error("Donation error:", error);
        alert("Failed to process donation. Please try again.");
      }
    });
  };

  return (
    <div className="w-full mx-auto p-1">
      {isDonate && (
        <Notification
          isOpen={isDonate}
          onClose={() => setIsDonate(false)}
          title="Donation successful"
          message={communication}
          link="/home/campaigns"
        />
      )}
      {errors && (
        <Notification
          isOpen={true}
          onClose={() => {
            setErrors("");
          }}
          title="Error"
          message={errors}
          type="error"
        />
      )}

      {/* Payment Method Selection */}
      <div className="font-onest w-full rounded-lg border border-gray-300 p-4 shadow-sm mb-8 flex md:flex-row flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
          <div className="md:col-span-1">
            <input
              type="number"
              name="amount"
              placeholder="Enter Your Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="w-full px-4 bg-transparent py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex md:flex-row gap-4 mb-6">
            {["Test Donation", "Cardiant Donation", "Office Donation"].map(
              (method) => (
                <label
                  key={method}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={selectedMethod === method}
                    onChange={(e) =>
                      setSelectedMethod(e.target.value as PaymentMethod)
                    }
                    className="form-radio bg-transparent h-4 w-4 accent-secondary border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{method}</span>
                </label>
              )
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {predefinedAmounts.map((amount) => (
              <button
                key={amount.value}
                onClick={() => handleAmountSelect(amount.value)}
                className={`px-4 text-sm w-[80px] py-2 rounded-full transition-colors duration-200 ${
                  selectedAmount === amount.value
                    ? "bg-secondary text-white"
                    : "bg-transparent border border-secondary text-black hover:bg-secondary/10"
                }`}
              >
                {amount.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="font-onest w-full rounded-lg border border-gray-300 p-4 shadow-sm mb-8 flex flex-col items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Select a Tip</h2>

        <div className="flex gap-3 mb-4">
          {tipOptions.map((tip) => (
            <button
              key={tip}
              onClick={() => handleTipSelect(tip)}
              className={`px-4 py-2 rounded-full border ${
                selectedTip === tip
                  ? "bg-secondary text-white"
                  : "bg-white text-black"
              }`}
            >
              {tip}%
            </button>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-secondary h-4 rounded-full transition-all duration-300"
            style={{ width: `${selectedTip}%` }}
          ></div>
        </div>

        <p className="text-center mt-2 text-sm text-gray-600">
          You selected a {selectedTip}% tip ({parseInt(formData.amount)/100 * selectedTip})
        </p>
      </div>

      {/* Details Form */}
      <h2 className="text-xl font-semibold mb-4">Details</h2>

      <div className=" rounded-lg p-4 border border-gray-300 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              name="donorName"
              placeholder="Alex Jordan*"
              value={formData.donorName}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300} rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
          <div>
            <input
              type="email"
              name="donorEmail"
              placeholder="Name@Example.Com*"
              value={formData.donorEmail}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name*"
            value={formData.companyName}
            onChange={handleChange}
            className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
          />
        </div>
      </div>

      {/* Address Form */}
      <h2 className="text-xl font-semibold mb-4 mt-8">Address</h2>

      <div className="rounded-lg p-4 border border-gray-300 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              name="postalCode"
              placeholder="Postcode*"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
          <div>
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={formData.city}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            name="houseNumber"
            placeholder="House No*"
            value={formData.houseNumber}
            onChange={handleChange}
            className={`w-full px-4 bg-transparent py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
          />
        </div>

        <FormControlLabel
          label="Anonymously: "
          labelPlacement="start"
          control={
            <Switch
              checked={formData.anonymous}
              onChange={(e) =>
                setFormData({ ...formData, anonymous: e.target.checked })
              }
              name="anonymous"
              color="primary"
            />
          }
          sx={{
            color: "gray", // label text color
            ".MuiFormControlLabel-label": {
              color: "gray", // ensures the label text is gray
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-8 mb-4">
        <input
          type="checkbox"
          id="terms"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="w-4 h-4 accent-secondary text-white cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer">
          I agree to the Terms of Service
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={isPending}
          onClick={handleDonate}
          className="bg-secondary text-white py-3 px-6 mt-4 rounded-full font-xs hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Donating..." : "DONATE NOW"}
        </button>

        <div className="text-black py-3 px-6 mt-4 rounded-full font-medium border border-gray-300">
          Total Amount: R{formData.amount}
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
