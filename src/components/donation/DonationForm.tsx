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
import PaymentTypeModal from "./PaymentTypeModal";
import EFTModal from "./EFTModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type PaymentMethod = "Test Donation" | "Cardiant Donation" | "Office Donation";

interface FormData {
  donorId: string | undefined;
  campaignId: string;
  organizationId: any | undefined;
  amount: string;
  donorName: string;
  donorEmail: string;
  mobile: string;
  comment: string;
  province: string;
  address: string;
  companyName: string;
  postalCode: string;
  city: string;
  anonymous: boolean;
}

declare global {
  interface Window {
    hpp: any;
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
  const [paymentModal, setPaymentModal] = useState(false);
  const [type, setType] = useState("ecentric");
  console.log("type", type);

  const handlePaymentModal = () => {
    setPaymentModal(!paymentModal);
  };

  const tipOptions = [0, 5, 10, 15, 20]; // in percentages
  const [selectedTip, setSelectedTip] = useState(0);

  const handleTipSelect = (tip: number) => {
    setSelectedTip(tip);
  };

  // Calculate tip amount and total amount
  const calculateTipAmount = () => {
    const baseAmount = parseFloat(formData.amount) || 0;
    return (baseAmount * selectedTip) / 100;
  };

  const calculateTotalAmount = () => {
    const baseAmount = parseFloat(formData.amount) || 0;
    const tipAmount = calculateTipAmount();
    return baseAmount + tipAmount;
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
    mobile: "",
    comment: "",
    province: "",
    address: "",
    city: "",
    
    anonymous: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    value: calculateTotalAmount(),
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
      script.src = "https://sandbox.ecentric.co.za/HPP/API/js";
      script.async = true;
      script.onload = () => console.log("Ecentric Lightbox loaded");
      script.onerror = () => console.error("Failed to load Ecentric script");
      document.body.appendChild(script);
    }
  }, []);

  const handleEftDonate = async () => {
    console.log("Form Data:", formData);
    const totalAmount = calculateTotalAmount();

    const donationData = {
      ...formData,
      tipAmount: (calculateTipAmount() - parseFloat(formData.amount) ).toFixed(2).toString(),
      amount: (parseFloat(formData.amount) - 10 - (parseFloat(formData.amount) * 7.5 / 100)).toString(), 
      paymentMethod: "EFT"
    };

    try {
      await axios.post(`${BASE_URL}/donations`, donationData);
      setType("ecentric")
      toast.success("request send")
    } catch (error) {
      toast.error("error")
    }

    


  };

  const handleDonate = async () => {
    if (!validateForm()) return;

    if (!user) {
      setErrors("Please log in to donate");
      return;
    }

    try {
      console.log("Form Data:", formData);
      console.log("User:", user);

      const randomPrefix = [...Array(3)]
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("");

      const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");

      const randomSuffix = [...Array(6)]
        .map(() => Math.random().toString(36)[2].toUpperCase())
        .join("");

      const reference = `${randomPrefix}${timestamp}${randomSuffix}`;

      // Use total amount (base amount + tip) for payment
      const totalAmount = calculateTotalAmount();
      const amountCents = totalAmount * 100;

      // Add user info to form data
      formData.donorId = user.userId;

      // Request payment initiation with total amount
      const { data: paymentData } = await axios.post(
        `${BASE_URL}/ecentric/initiate-payment`,
        {
          amount: amountCents.toFixed(0),
          reference,
          userId: user.userId, // optional
          transactionType: "Payment",
        }
      );

      // Check Lightbox availability
      if (!window.hpp?.payment) {
        alert(
          "Payment system not ready. Please refresh the page or try later."
        );
        return;
      }

      // Launch payment Lightbox
      window.hpp.payment(
        paymentData,
        async (successData) => {
          console.log("✅ Payment Success", successData);
          // alert("Payment completed successfully!");

          // Save donation with total amount (including tip)
          const donationData = {
            ...formData,
            tipAmount: (calculateTipAmount() - parseFloat(formData.amount) ).toFixed(2).toString(),
            amount: (parseFloat(formData.amount) - 10 - (parseFloat(formData.amount) * 7.5 / 100)).toString(), 
            paymentMethod: "card",
            status: "completed"
          };

          await axios.post(`${BASE_URL}/donations`, donationData);

          // Send notification to campaigner with total amount
          await axios.post(`${BASE_URL}/notifications/create`, {
            userId: campaigner,
            title: "New Donation",
            message: `A new donation of R${totalAmount.toFixed(2)} has been made to your campaign.`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          // Emit socket event
          socketRef.current?.emit("send-notification", {
            campaigner,
            notification: `A new donation of R${totalAmount.toFixed(2)} has been made to your campaign.`
          }
        );

          // Reset form (optional)
          setIsDonate(true);
          setFormData({
            donorId: user.userId,
            campaignId: id,
            organizationId: organizationId,
            amount: "150",
            donorName: "",
            donorEmail: "",
            companyName: "",
            mobile: "",
            comment: "",
            province: "",
            address: "",
            postalCode: "",
            city: "",
            
            anonymous: false,
          });
          setSelectedAmount("150");
          setCustomAmount("");
          setAgreeToTerms(false);
          setSelectedTip(0); // Reset tip selection
        },
        (failData) => {
          console.error("❌ Payment Failed", failData);
          alert("Payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error("Donation error:", error);
      setErrors("Failed to process donation. Please try again.");
      alert("Failed to process donation. Please try again.");
    }
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

      {paymentModal && (
        <PaymentTypeModal
          onClose={handlePaymentModal}
          setType={(type) => {
            setType(type);
            if (type === "card") {
              handleDonate();
            }
          }}
          handleDonate={handleDonate}
        />
      )}

      {type === "eft" && (

        <EFTModal onClose={handlePaymentModal} setType={()=>setType("ecentric")} amount={parseFloat(formData.amount) + calculateTipAmount()} handleDonate={handleEftDonate} />
      )}

      {/* Payment Method Selection */}
      <div className="font-onest w-full rounded-lg border border-gray-300 p-4 shadow-sm mb-8 flex md:flex-row flex-col items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold mb-4">Enter Your Amount </h2>
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
          {/* <div className="flex md:flex-row gap-4 mb-6">
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
          </div> */}

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
        <h2 className="text-xl font-semibold mb-4">Contribute to our Fees</h2>

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

        <div className="text-center mt-4 space-y-1">
          <p className="text-sm text-gray-600">
            You selected a {selectedTip}% tip (R{calculateTipAmount().toFixed(2)})
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Base Amount: R{formData.amount} + Tip: R{calculateTipAmount().toFixed(2)} = Total: R{calculateTotalAmount().toFixed(2)}
          </p>
        </div>
      </div>

      {/* Details Form */}
      <h2 className="text-xl font-semibold mb-4">Donor Information</h2>

      <div className=" rounded-lg p-4 border border-gray-300 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="mobile*"
              value={formData.mobile}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300} rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donor Comment
          </label>
          <input
            type="text"
            name="comment"
            placeholder="comment*"
            value={formData.comment}
            onChange={handleChange}
            className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
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

      {/* Address Form */}
      <div className="flex flex-col mb-4 leading-[.99]">
        <h2 className="text-xl font-semibold mt-8">Donors Address</h2>
        <p className="text-sm text-black/50">
          We use these details for record purposes and will not be made public.
        </p>
      </div>

      <div className="rounded-lg p-4 border border-gray-300 shadow-sm">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="Address*"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-4 bg-transparent py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City/Town
            </label>
            <input
              type="text"
              name="city"
              placeholder="City*"
              value={formData.city}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <input
              type="text"
              name="province"
              placeholder="province*"
              value={formData.province}
              onChange={handleChange}
              className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            placeholder="Postcode*"
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full bg-transparent px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent`}
          />
        </div>
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
          I agree to the{" "}
          <Link to="/terms" className="underline">
            Terms
          </Link>{" "}
          of Service
        </label>
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={isPending}
          onClick={() => {
            if (!validateForm()) return;
            setPaymentModal(true);
          }}
          className="bg-secondary text-white py-3 px-6 mt-4 rounded-full font-xs hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Donating..." : "DONATE NOW"}
        </button>

        <div className="text-black py-3 px-6 mt-4 rounded-full font-medium border border-gray-300">
          Total Amount: R{calculateTotalAmount().toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default DonationForm;