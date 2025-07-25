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

interface PaymentSettings {
  _id: string;
  paymentType: string;
  platformFee: {
    percent?: number;
    total?: number;
  };
  transactionFee: {
    percent?: number;
    total?: number;
  };
  createdAt: string;
  updatedAt: string;
}

const DonationModal: React.FC<Props> = ({ organizationId, onClose }) => {
  const { user } = useContext(AuthContext)!;
  const [amount, setAmount] = useState<string>("150");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod>("Card");
  const [loading, setLoading] = useState(false);
  const [showEFTModal, setShowEFTModal] = useState(false);
  
  // Payment settings state
  const [cardSettings, setCardSettings] = useState<PaymentSettings | null>(null);
  const [eftSettings, setEftSettings] = useState<PaymentSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Tip state
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>("");

  const [formData, setFormData] = useState({
    donorName: user?.name || "",
    donorEmail: user?.email || "",
    referenceId: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    mobile: "",
    comment: "",
    anonymous: false,
  });

  const predefinedAmounts = ["150", "200", "300", "500"];
  const tipOptions = [
    { label: "No Tip", value: 0 },
    { label: "5%", value: 5 },
    { label: "10%", value: 10 },
    { label: "15%", value: 15 },
  ];

  // Fetch payment settings on component mount
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        setSettingsLoading(true);
        console.log("🔍 Fetching payment settings for organization donation...");
        
        const [cardResponse, eftResponse] = await Promise.all([
          axios.get(`${BASE_URL}/payment-settings?type=card`),
          axios.get(`${BASE_URL}/payment-settings?type=eft`)
        ]);

        console.log("💳 Card settings:", cardResponse.data);
        console.log("🏦 EFT settings:", eftResponse.data);

        setCardSettings(cardResponse.data);
        setEftSettings(eftResponse.data);
      } catch (error) {
        console.error("❌ Error fetching payment settings:", error);
        toast.error("Failed to load payment settings");
        // Set default settings as fallback
        const defaultCardSettings = {
          _id: "default",
          paymentType: "card",
          platformFee: { total: 10 },
          transactionFee: { percent: 7.5 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const defaultEftSettings = {
          _id: "default",
          paymentType: "eft",
          platformFee: { total: 15 },
          transactionFee: { percent: 5 },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCardSettings(defaultCardSettings);
        setEftSettings(defaultEftSettings);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchPaymentSettings();
  }, []);

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

  // Get current payment settings based on selected method
  const getCurrentPaymentSettings = (): PaymentSettings | null => {
    return selectedPaymentType === "Card" ? cardSettings : eftSettings;
  };

  // Calculate platform fee
  const calculatePlatformFee = (): number => {
    const settings = getCurrentPaymentSettings();
    if (!settings) return 0;

    console.log("🔧 Calculating platform fee with settings:", settings.platformFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (settings.platformFee.percent !== undefined) {
      const fee = (baseAmount * settings.platformFee.percent) / 100;
      console.log(`Platform fee (${settings.platformFee.percent}%): ${fee}`);
      return fee;
    } else if (settings.platformFee.total !== undefined) {
      const fee = settings.platformFee.total;
      console.log(`Platform fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate transaction fee
  const calculateTransactionFee = (): number => {
    const settings = getCurrentPaymentSettings();
    if (!settings) return 0;

    console.log("🔧 Calculating transaction fee with settings:", settings.transactionFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (settings.transactionFee.percent !== undefined) {
      const fee = (baseAmount * settings.transactionFee.percent) / 100;
      console.log(`Transaction fee (${settings.transactionFee.percent}%): ${fee}`);
      return fee;
    } else if (settings.transactionFee.total !== undefined) {
      const fee = settings.transactionFee.total;
      console.log(`Transaction fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate tip amount
  const calculateTipAmount = (): number => {
    if (customTip) {
      return parseFloat(customTip) || 0;
    }
    if (tipPercentage > 0) {
      const baseAmount = parseFloat(amount) || 0;
      return (baseAmount * tipPercentage) / 100;
    }
    return 0;
  };

  // Calculate total charge amount (what user pays)
  const calculateTotalChargeAmount = (): number => {
    const baseAmount = parseFloat(amount) || 0;
    const tipAmount = calculateTipAmount();
    return baseAmount + tipAmount;
  };

  // Calculate net donation amount (what organization receives)
  const calculateNetDonationAmount = (): number => {
    const baseAmount = parseFloat(amount) || 0;
    const platformFee = calculatePlatformFee();
    const transactionFee = calculateTransactionFee();
    return Math.max(0, baseAmount - platformFee - transactionFee);
  };

  const validateForm = () => {
    if (!formData.donorName || !formData.donorEmail || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleDonate = async () => {
    if (!validateForm()) return;
    if (settingsLoading) {
      toast.error("Please wait for payment settings to load");
      return;
    }

    try {
      setLoading(true);

      const tipAmount = calculateTipAmount();
      const platformFee = calculatePlatformFee();
      const transactionFee = calculateTransactionFee();
      const netDonationAmount = calculateNetDonationAmount();
      const totalChargeAmount = calculateTotalChargeAmount();

      console.log("💰 Organization donation fee breakdown:", {
        baseAmount: parseFloat(amount),
        tipAmount,
        platformFee,
        transactionFee,
        netDonationAmount,
        totalChargeAmount,
        paymentSettings: getCurrentPaymentSettings()
      });

      const donationData = {
        donorId: user?.userId,
        organizationId,
        amount: netDonationAmount,
        totalAmount: totalChargeAmount,
        tipAmount: tipAmount,
        platformFee: platformFee,
        transactionFee: transactionFee,
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

      // Card payment flow
      const randomRef = `ORG${Date.now()}`;
      const totalCents = Math.round(totalChargeAmount * 100);

      const { data: paymentData } = await axios.post(`${BASE_URL}/ecentric/initiate-payment`, {
        amount: totalCents.toString(),
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
          console.log("💳 Payment Success", successData);
          try {
            await axios.post(`${BASE_URL}/donations`, { 
              ...donationData, 
              status: "completed",
              transactionId: successData.transactionId || randomRef
            });
          toast.success("Donation successful!");
          onClose();
          } catch (error) {
            console.error("❌ Error recording donation:", error);
            toast.error("Payment succeeded but failed to record donation");
          }
        },
        (failData: any) => {
          console.error("❌ Payment Failed", failData);
          toast.error("Payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error("❌ Error processing donation:", error);
      toast.error("Failed to process donation");
    } finally {
      setLoading(false);
    }
  };

  const handleEFTDonate = async (reference: string) => {
    if (!validateForm()) return;

  try {
    setLoading(true);
      
      const tipAmount = calculateTipAmount();
      const platformFee = calculatePlatformFee();
      const transactionFee = calculateTransactionFee();
      const netDonationAmount = calculateNetDonationAmount();
      const totalChargeAmount = calculateTotalChargeAmount();

      console.log("🏦 EFT organization donation data:", {
        baseAmount: parseFloat(amount),
        tipAmount,
        platformFee,
        transactionFee,
        netDonationAmount,
        totalChargeAmount,
        reference,
        paymentSettings: getCurrentPaymentSettings()
      });

    await axios.post(`${BASE_URL}/donations`, {
      donorId: user?.userId,
      organizationId,
        amount: netDonationAmount,
        totalAmount: totalChargeAmount,
        tipAmount: tipAmount,
        platformFee: platformFee,
        transactionFee: transactionFee,
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
        referenceId: reference,
    });
      
      toast.success("EFT donation recorded! Complete payment using the provided bank details.");
    setShowEFTModal(false);
    onClose();
  } catch (error) {
      console.error("❌ Error recording EFT donation:", error);
    toast.error("Failed to record EFT donation");
  } finally {
    setLoading(false);
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleTipChange = (percentage: number) => {
    setTipPercentage(percentage);
    setCustomTip(""); // Clear custom tip when selecting predefined
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    setTipPercentage(0); // Clear percentage when entering custom
  };

  // Get fee display text for UI
  const getPlatformFeeDisplay = (): string => {
    const settings = getCurrentPaymentSettings();
    if (!settings) return "Loading...";
    
    if (settings.platformFee.percent !== undefined) {
      return `${settings.platformFee.percent}%`;
    } else if (settings.platformFee.total !== undefined) {
      return `R${settings.platformFee.total}`;
    }
    return "Not set";
  };

  const getTransactionFeeDisplay = (): string => {
    const settings = getCurrentPaymentSettings();
    if (!settings) return "Loading...";
    
    if (settings.transactionFee.percent !== undefined) {
      return `${settings.transactionFee.percent}%`;
    } else if (settings.transactionFee.total !== undefined) {
      return `R${settings.transactionFee.total}`;
    }
    return "Not set";
  };

  if (settingsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p>Loading payment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Donate to Organization</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-xl font-bold">✕</button>
          </div>
        </div>

        <div className="p-6">
          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Donation Amount</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {predefinedAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setAmount(amt);
                  setCustomAmount("");
                }}
                  className={`px-4 py-3 rounded-full border-2 font-medium transition-all ${
                    amount === amt 
                      ? "bg-secondary text-white border-secondary shadow-lg" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-secondary"
                  }`}
              >
                R{amt}
              </button>
            ))}
          </div>
          <input
            type="number"
              placeholder="Enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(e.target.value);
            }}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>

          {/* Tip Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Add a Tip (Optional)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {tipOptions.map((tip) => (
                <button
                  key={tip.value}
                  onClick={() => handleTipChange(tip.value)}
                  className={`px-3 py-2 rounded-full border font-medium text-sm transition-all ${
                    tipPercentage === tip.value && !customTip
                      ? "bg-secondary text-white border-secondary" 
                      : "bg-white text-gray-700 border-gray-300 hover:border-secondary"
                  }`}
                >
                  {tip.label}
                </button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom tip amount (R)"
              value={customTip}
              onChange={(e) => handleCustomTipChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-2 gap-4">
            {["Card", "EFT"].map((method) => (
                <label key={method} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value={method}
                  checked={selectedPaymentType === method}
                  onChange={() => setSelectedPaymentType(method as PaymentMethod)}
                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-medium">{method} Payment</span>
                    <div className="text-xs text-gray-500 mt-1">
                      Platform: {getPlatformFeeDisplay()} | Transaction: {getTransactionFeeDisplay()}
                    </div>
                  </div>
              </label>
            ))}
          </div>
        </div>

        {/* Donor Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Donor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="donorName" 
                value={formData.donorName} 
                onChange={handleInputChange} 
                placeholder="Full Name *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="email" 
                name="donorEmail" 
                value={formData.donorEmail} 
                onChange={handleInputChange} 
                placeholder="Email Address *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleInputChange} 
                placeholder="Mobile Number" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                placeholder="Street Address *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                placeholder="City *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="province" 
                value={formData.province} 
                onChange={handleInputChange} 
                placeholder="Province *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="postalCode" 
                value={formData.postalCode} 
                onChange={handleInputChange} 
                placeholder="Postal Code *" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
              <input 
                type="text" 
                name="comment" 
                value={formData.comment} 
                onChange={handleInputChange} 
                placeholder="Comment (Optional)" 
                className="border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
              />
            </div>
            <label className="flex items-center mt-4 p-3 bg-gray-50 rounded-lg">
              <input 
                type="checkbox" 
                name="anonymous" 
                checked={formData.anonymous} 
                onChange={handleInputChange}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded mr-3"
              />
              <span className="text-sm text-gray-700">I would like to donate anonymously</span>
            </label>
          </div>

          {/* Enhanced Fee Breakdown */}
          {/* <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Donation Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Donation Amount:</span>
                <span className="font-medium">R{parseFloat(amount || "0").toFixed(2)}</span>
              </div>
              {calculateTipAmount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip:</span>
                  <span className="font-medium text-green-600">+R{calculateTipAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee ({getPlatformFeeDisplay()}):</span>
                <span className="font-medium text-red-500">-R{calculatePlatformFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction Fee ({getTransactionFeeDisplay()}):</span>
                <span className="font-medium text-red-500">-R{calculateTransactionFee().toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total to Charge:</span>
                <span className="text-secondary">R{calculateTotalChargeAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-green-600">Net to Organization:</span>
                <span className="text-green-600">R{calculateNetDonationAmount().toFixed(2)}</span>
              </div>
            </div>
          </div> */}

          {/* Donate Button */}
          <button 
            onClick={handleDonate} 
            disabled={loading || settingsLoading} 
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              `Donate R${calculateTotalChargeAmount().toFixed(2)} Now`
            )}
          </button>
        </div>
      </div>

      {/* EFT Modal */}
      {showEFTModal && (
        <EFTModal
          onClose={() => setShowEFTModal(false)}
          setType={() => setShowEFTModal(false)}
          amount={calculateTotalChargeAmount().toString()}
          handleDonate={handleEFTDonate}
        />
      )}
    </div>
  );
};

export default DonationModal;
