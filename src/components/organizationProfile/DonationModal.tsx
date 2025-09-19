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
    { label: "3.5%", value: 3.5 },
    { label: "7.5%", value: 7.5 },
    { label: "11%", value: 11 },
  ];

  // Fetch payment settings on component mount
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        setSettingsLoading(true);
        console.log("🔍 Fetching payment settings for organisation donation...");
        
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

  // Calculate platform fee for Card payments
  const calculateCardPlatformFee = (): number => {
    if (!cardSettings) return 0;

    console.log("💳 Calculating card platform fee with settings:", cardSettings.platformFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (cardSettings.platformFee.percent !== undefined) {
      const fee = (baseAmount * cardSettings.platformFee.percent) / 100;
      console.log(`Card platform fee (${cardSettings.platformFee.percent}%): ${fee}`);
      return fee;
    } else if (cardSettings.platformFee.total !== undefined) {
      const fee = cardSettings.platformFee.total;
      console.log(`Card platform fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate transaction fee for Card payments
  const calculateCardTransactionFee = (): number => {
    if (!cardSettings) return 0;

    console.log("💳 Calculating card transaction fee with settings:", cardSettings.transactionFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (cardSettings.transactionFee.percent !== undefined) {
      const fee = (baseAmount * cardSettings.transactionFee.percent) / 100;
      console.log(`Card transaction fee (${cardSettings.transactionFee.percent}%): ${fee}`);
      return fee;
    } else if (cardSettings.transactionFee.total !== undefined) {
      const fee = cardSettings.transactionFee.total;
      console.log(`Card transaction fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate platform fee for EFT payments
  const calculateEFTPlatformFee = (): number => {
    if (!eftSettings) return 0;

    console.log("🏦 Calculating EFT platform fee with settings:", eftSettings.platformFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (eftSettings.platformFee.percent !== undefined) {
      const fee = (baseAmount * eftSettings.platformFee.percent) / 100;
      console.log(`EFT platform fee (${eftSettings.platformFee.percent}%): ${fee}`);
      return fee;
    } else if (eftSettings.platformFee.total !== undefined) {
      const fee = eftSettings.platformFee.total;
      console.log(`EFT platform fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate transaction fee for EFT payments
  const calculateEFTTransactionFee = (): number => {
    if (!eftSettings) return 0;

    console.log("🏦 Calculating EFT transaction fee with settings:", eftSettings.transactionFee);

    const baseAmount = parseFloat(amount) || 0;
    
    if (eftSettings.transactionFee.percent !== undefined) {
      const fee = (baseAmount * eftSettings.transactionFee.percent) / 100;
      console.log(`EFT transaction fee (${eftSettings.transactionFee.percent}%): ${fee}`);
      return fee;
    } else if (eftSettings.transactionFee.total !== undefined) {
      const fee = eftSettings.transactionFee.total;
      console.log(`EFT transaction fee (fixed): ${fee}`);
      return fee;
    }
    
    return 0;
  };

  // Calculate platform fee based on selected payment method
  const calculatePlatformFee = (): number => {
    return selectedPaymentType === "Card" ? calculateCardPlatformFee() : calculateEFTPlatformFee();
  };

  // Calculate transaction fee based on selected payment method
  const calculateTransactionFee = (): number => {
    return selectedPaymentType === "Card" ? calculateCardTransactionFee() : calculateEFTTransactionFee();
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

    if (selectedPaymentType === "Card") {
      await handleCardPayment();
    } else if (selectedPaymentType === "EFT") {
      setShowEFTModal(true);
    }
  };

  const handleCardPayment = async () => {
    try {
      setLoading(true);

      // Use Card-specific fee calculations
      const tipAmount = calculateTipAmount();
      const platformFee = calculateCardPlatformFee();
      const transactionFee = calculateCardTransactionFee();
      const netDonationAmount = calculateNetDonationAmount();
      const totalChargeAmount = calculateTotalChargeAmount();

      console.log("💳 CARD payment fee breakdown:", {
        paymentMethod: "CARD",
        baseAmount: parseFloat(amount),
        tipAmount,
        platformFee,
        transactionFee,
        netDonationAmount,
        totalChargeAmount,
        cardSettings: cardSettings
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
        paymentMethod: "card",
      };

      // Card payment flow
      const randomPrefix: string = [...Array(3)]
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("");
      const randomSuffix: string = [...Array(3)]
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("");
      const timestamp = Date.now();
      const randomRef = `${randomPrefix}${timestamp}${randomSuffix}`;
      const totalCents = Math.round(totalChargeAmount * 100);

      console.log("💳 Initiating card payment:", { reference: randomRef, amount: totalCents });

      const { data: paymentData } = await axios.post(`${BASE_URL}/ecentric/initiate-payment`, {
        amount: totalCents.toString(),
        reference: randomRef,
        transactionType: "Payment",
      });

      if (!window.hpp?.payment) {
        toast.error("Card payment system not ready");
        return;
      }

      window.hpp.payment(
        paymentData,
        async (successData: any) => {
          console.log("💳 Card Payment Success", successData);
          try {
            await axios.post(`${BASE_URL}/donations`, { 
              ...donationData, 
              status: "completed",
              transactionId: successData.transactionId || randomRef
            });
            toast.success("Card donation successful!");
            onClose();
          } catch (error) {
            console.error("❌ Error recording card donation:", error);
            toast.error("Payment succeeded but failed to record donation");
          }
        },
        (failData: any) => {
          console.error("❌ Card Payment Failed", failData);
          toast.error("Card payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error("❌ Error processing card donation:", error);
      toast.error("Failed to process card donation");
    } finally {
      setLoading(false);
    }
  };

  const handleEFTDonate = async (reference: string) => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Use EFT-specific fee calculations
      const tipAmount = calculateTipAmount();
      const platformFee = calculateEFTPlatformFee();
      const transactionFee = calculateEFTTransactionFee();
      const netDonationAmount = calculateNetDonationAmount();
      const totalChargeAmount = calculateTotalChargeAmount();

      console.log("🏦 EFT payment fee breakdown:", {
        paymentMethod: "EFT",
        baseAmount: parseFloat(amount),
        tipAmount,
        platformFee,
        transactionFee,
        netDonationAmount,
        totalChargeAmount,
        reference,
        eftSettings: eftSettings
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

  // Get fee display text for UI - Card specific
  const getCardFeeDisplay = (feeType: 'platform' | 'transaction'): string => {
    if (!cardSettings) return "Loading...";
    
    const fee = feeType === 'platform' ? cardSettings.platformFee : cardSettings.transactionFee;
    
    if (fee.percent !== undefined) {
      return `${fee.percent}%`;
    } else if (fee.total !== undefined) {
      return `R${fee.total}`;
    }
    return "Not set";
  };

  // Get fee display text for UI - EFT specific
  const getEFTFeeDisplay = (feeType: 'platform' | 'transaction'): string => {
    if (!eftSettings) return "Loading...";
    
    const fee = feeType === 'platform' ? eftSettings.platformFee : eftSettings.transactionFee;
    
    if (fee.percent !== undefined) {
      return `${fee.percent}%`;
    } else if (fee.total !== undefined) {
      return `R${fee.total}`;
    }
    return "Not set";
  };

  // Get fee display based on payment method
  const getFeeDisplay = (method: PaymentMethod, feeType: 'platform' | 'transaction'): string => {
    return method === 'Card' ? getCardFeeDisplay(feeType) : getEFTFeeDisplay(feeType);
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
            <h2 className="text-2xl font-bold">Donate to Organisation</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Fee Contribution (Optional)</label>
            <p className="block text-sm font-medium text-gray-400 mb-3">You can help us to maximise your selected base donation by contributing towards our fees.</p>

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
                      Platform: {getFeeDisplay(method as PaymentMethod, 'platform')} | Transaction: {getFeeDisplay(method as PaymentMethod, 'transaction')}
                    </div>
                  </div>
              </label>
            ))}
          </div>
        </div>

        {/* Fee Breakdown */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {selectedPaymentType} Payment Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Donation Amount:</span>
                <span className="font-medium">R{parseFloat(amount).toFixed(2)}</span>
              </div>
              {calculateTipAmount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip:</span>
                  <span className="font-medium">R{calculateTipAmount().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Fee Contribution:</span>
                <span className="font-medium">
  R{(calculatePlatformFee() + calculateTransactionFee()).toFixed(2)}
</span>

              </div>

              {/* <div className="flex justify-between text-red-600">
                <span>Platform Fee ({selectedPaymentType}):</span>
                <span>-R{calculatePlatformFee().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Transaction Fee ({selectedPaymentType}):</span>
                <span>-R{calculateTransactionFee().toFixed(2)}</span>
              </div> */}
              <div className="border-t border-gray-300 pt-2 mt-2"></div>
              <div className="flex justify-between font-semibold">
                <span>You Pay:</span>
                <span className="text-secondary">R{calculateTotalChargeAmount().toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between font-semibold text-green-600">
                <span>Organisation Receives:</span>
                <span>R{calculateNetDonationAmount().toFixed(2)}</span>
              </div> */}
            </div>
          </div>
        )}

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

          

          {/* Donate Button */}
          <button 
            onClick={handleDonate} 
            disabled={loading || settingsLoading} 
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing {selectedPaymentType} Payment...
              </>
            ) : (
              `Donate R${calculateTotalChargeAmount().toFixed(2)} via ${selectedPaymentType}`
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
