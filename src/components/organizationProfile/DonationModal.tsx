import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/userContext";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import EFTModal from "../donation/EFTModal";

interface Props {
  organizationId: string;
  onClose: () => void;
}

type PaymentMethod = "Card" | "EFT";

const DonationModal: React.FC<Props> = ({ organizationId, onClose }) => {
  const { user } = useContext(AuthContext)!;
  const [amount, setAmount] = useState<string>("150");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod>("Card");
  const [loading, setLoading] = useState(false);
  const [showEFTModal, setShowEFTModal] = useState(false);

  const [formData, setFormData] = useState({
    donorName: user?.name || "",
    donorEmail: user?.email || "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    mobile: "",
    comment: "",
    anonymous: false,
  });

  const predefinedAmounts = ["150", "200", "300", "500"];

  useEffect(() => {
    const scriptExists = document.querySelector("script[src*='ecentric']");
    if (!scriptExists) {
      const script = document.createElement("script");
      script.src = "https://secure1.ecentricpaymentgateway.co.za/HPP/API/js";
      script.async = true;
      script.onload = () => console.log("Ecentric Lightbox loaded");
      document.body.appendChild(script);
    }
  }, []);

  const validateForm = () => {
    if (!formData.donorName || !formData.donorEmail || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const calculateNetAmount = () => {
    const base = parseFloat(amount) || 0;
    return (base - 10 - (base * 7.5) / 100).toFixed(2);
  };

  const handleDonate = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const donationData = {
        donorId: user?.userId,
        organizationId,
        amount: calculateNetAmount(),
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        mobile: formData.mobile,
        comment: formData.comment,
        anonymous: formData.anonymous,
        paymentMethod: selectedPaymentType === "Card" ? "card" : "EFT",
      };

      if (selectedPaymentType === "EFT") {
        setShowEFTModal(true);
        return;
      }

      const randomRef = `REF${Date.now()}`;
      const totalCents = parseFloat(amount) * 100;

      const { data: paymentData } = await axios.post(`${BASE_URL}/ecentric/initiate-payment`, {
        amount: totalCents.toFixed(0),
        reference: randomRef,
        transactionType: "Payment",
      });

      if (!window.hpp?.payment) {
        toast.error("Payment system not ready");
        return;
      }

      window.hpp.payment(
        paymentData,
        async (successData: any) => {
          console.log("Payment Success", successData);
          await axios.post(`${BASE_URL}/donations`, { ...donationData, status: "completed" });
          toast.success("Donation successful!");
          onClose();
        },
        (failData: any) => {
          console.error("Payment Failed", failData);
          toast.error("Payment failed");
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to process donation");
    } finally {
      setLoading(false);
    }
  };

  const handleEFTDonate = async () => {
    try {
      await axios.post(`${BASE_URL}/donations`, {
        donorId: user?.userId,
        organizationId,
        amount: calculateNetAmount(),
        donorName: formData.donorName,
        donorEmail: formData.donorEmail,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        mobile: formData.mobile,
        comment: formData.comment,
        anonymous: formData.anonymous,
        paymentMethod: "EFT",
        status: "pending",
      });
      toast.success("EFT donation recorded! Complete payment manually.");
      setShowEFTModal(false);
      onClose();
    } catch (error) {
      toast.error("Failed to record EFT donation");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-black">✕</button>
        <h2 className="text-xl font-bold mb-4">Donate to Organization</h2>

        {/* Amount */}
        <div className="mb-4">
          <p className="mb-2 font-medium">Select Amount:</p>
          <div className="flex gap-2 mb-2">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount("");
                }}
                className={`px-3 py-2 rounded-full border ${amount === amt ? "bg-secondary text-white" : "bg-white"}`}
              >
                R{amt}
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom Amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(e.target.value);
            }}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <p className="mb-2">Payment Method:</p>
          <div className="flex gap-4">
            {["Card", "EFT"].map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={method}
                  checked={selectedPaymentType === method}
                  onChange={() => setSelectedPaymentType(method as PaymentMethod)}
                />
                {method}
              </label>
            ))}
          </div>
        </div>

        {/* Donor Details */}
        <h3 className="font-semibold mb-2">Donor Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input type="text" name="donorName" value={formData.donorName} onChange={handleInputChange} placeholder="Name*" className="border p-2 rounded" />
          <input type="email" name="donorEmail" value={formData.donorEmail} onChange={handleInputChange} placeholder="Email*" className="border p-2 rounded" />
          <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile" className="border p-2 rounded" />
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address*" className="border p-2 rounded" />
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City*" className="border p-2 rounded" />
          <input type="text" name="province" value={formData.province} onChange={handleInputChange} placeholder="Province*" className="border p-2 rounded" />
          <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code*" className="border p-2 rounded" />
          <input type="text" name="comment" value={formData.comment} onChange={handleInputChange} placeholder="Comment" className="border p-2 rounded" />
        </div>
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleInputChange} />
          Donate Anonymously
        </label>

        <p className="font-semibold mb-4">Net Amount After Fees: R{calculateNetAmount()}</p>

        <button onClick={handleDonate} disabled={loading} className="bg-secondary text-white px-4 py-2 rounded w-full">
          {loading ? "Processing..." : "Donate Now"}
        </button>
      </div>

      {/* EFT Modal */}
      {showEFTModal && (
        <EFTModal
          onClose={() => setShowEFTModal(false)}
          setType={() => setShowEFTModal(false)} // keep consistency
          amount={amount}
          handleDonate={handleEFTDonate}
        />
      )}
    </div>
  );
};

export default DonationModal;
