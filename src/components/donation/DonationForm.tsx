import React, { useState, useEffect, useContext, useTransition } from "react";
import { AuthContext } from "../../context/userContext";
import { BASE_URL, SOCKET_URL } from "../../config/url";
import axios from "axios";
import { toast } from "react-toastify";
import EFTModal from "./EFTModal";
import ReactGA from "react-ga4";
import io from "socket.io-client";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { Link } from "react-router-dom";

// Extend Window interface for Ecentric payment gateway
declare global {
  interface Window {
    hpp?: {
      payment: (
        paymentData: any,
        successCallback: (data: any) => void,
        failCallback: (data: any) => void
      ) => void;
    };
  }
}

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




interface Props {
  campaignId: string;
  organizationId: string;
  campaignTitle: string;
  campaignAmount: number;
  currentAmount: number;
  isVerified?: boolean;
}

type PaymentMethod = "Card" | "EFT";

const DonationForm: React.FC<Props> = ({
  campaignId,
  organizationId,
  campaignTitle,
  campaignAmount,
  currentAmount,
  isVerified = false,
}) => {
  const { user } = useContext(AuthContext)!;
  const [amount, setAmount] = useState<string>("150");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod>("Card");
  const [loading, setLoading] = useState(false);
  const [showEFTModal, setShowEFTModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Payment settings state
  const [cardSettings, setCardSettings] = useState<PaymentSettings | null>(null);
  const [eftSettings, setEftSettings] = useState<PaymentSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Tip state
  const [tipPercentage, setTipPercentage] = useState<number>(0);
  const [customTip, setCustomTip] = useState<string>("");

  // S18A Certificate state
  const [wantS18A, setWantS18A] = useState(false);
  const [idNumber, setIdNumber] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [s18aErrors, setS18aErrors] = useState<{ idNumber?: string; taxNumber?: string }>({});
  const [s18aFor, setS18aFor] = useState<"self" | "individual" | "business" | "">("self");

  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    referenceId: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    mobile: "",
    comment: "",
    anonymous: false,
    terms: false,
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
        console.log("🔍 Fetching payment settings for campaign donation...");

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
    const settings = selectedPaymentType === "Card" ? cardSettings : eftSettings;
    console.log(`📊 Current payment settings for ${selectedPaymentType}:`, settings);
    return settings;
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

  // Calculate net donation amount (what campaign receives)
  const calculateNetDonationAmount = (): number => {
    const baseAmount = parseFloat(amount) || 0;
    const platformFee = calculatePlatformFee();
    const transactionFee = calculateTransactionFee();
    return Math.max(0, baseAmount - platformFee - transactionFee);
  };

  const validateS18A = () => {
    const newErrors: { idNumber?: string; taxNumber?: string } = {};
    
    if (wantS18A) {
      if (!idNumber.trim()) {
        newErrors.idNumber = 'ID Number is required for S18A certificate';
      } else if (!/^\d{13}$/.test(idNumber.replace(/\s/g, ''))) {
        newErrors.idNumber = 'Please enter a valid 13-digit ID number';
      }
      
      if (!taxNumber.trim()) {
        newErrors.taxNumber = 'Tax Number is required for S18A certificate';
      }
    }
    
    setS18aErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    if (!formData.donorName || !formData.donorEmail || !formData.address || !formData.city || !formData.postalCode) {
      toast.error("Please fill all required fields");
      return false;
    }
    
    if (isVerified && !validateS18A()) {
      toast.error("Please complete S18A certificate fields correctly");
      return false;
    }
    
    return true;
  };

  // Send socket notification
  const sendSocketNotification = (donationData: any) => {
    try {
      const socket = io(SOCKET_URL);
      socket.emit("donation_received", {
        campaignId,
        organizationId,
        donorName: donationData.donorName,
        amount: donationData.totalAmount,
        anonymous: donationData.anonymous,
        campaignTitle,
      });
      socket.disconnect();
    } catch (error) {
      console.error("Socket notification error:", error);
    }
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

      console.log("💳 CARD campaign donation fee breakdown:", {
        paymentMethod: "CARD",
        baseAmount: parseFloat(amount),
        tipAmount,
        platformFee,
        transactionFee,
        netDonationAmount,
        totalChargeAmount,
        cardSettings: cardSettings
      });

      // Track donation attempt
      ReactGA.event({
        category: "Donation",
        action: "card_attempt",
        label: campaignTitle,
        value: Math.round(totalChargeAmount),
      });

      const donationData = {
        donorId: user?.userId,
        campaignId,
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
        ...(wantS18A && {
          IDNumber: idNumber.replace(/\s/g, ''),
          taxNumber: taxNumber.trim(),
        }),
      };

      // Card payment flow
      const randomRef = `CARD_CAM_${Date.now()}`;
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
            const response = await axios.post(`${BASE_URL}/donations`, {
              ...donationData,
              status: "completed",
              transactionId: successData.transactionId || randomRef
            });

            // Send socket notification
            sendSocketNotification({ ...donationData, anonymous: formData.anonymous });

            // Track successful donation
            ReactGA.event({
              category: "Donation",
              action: "card_success",
              label: campaignTitle,
              value: Math.round(totalChargeAmount),
            });

            toast.success("Card donation successful! Thank you for your contribution.");
          } catch (error) {
            console.error("❌ Error recording card donation:", error);
            toast.error("Payment succeeded but failed to record donation");
          }
        },
        (failData: any) => {
          console.error("❌ Card Payment Failed", failData);
          toast.error("Card payment failed. Please try again.");

          // Track failed donation
          ReactGA.event({
            category: "Donation",
            action: "card_failed",
            label: campaignTitle,
            value: Math.round(totalChargeAmount),
          });
        }
      );
    } catch (error) {
      console.error("❌ Error processing card donation:", error);
      toast.error("Failed to process card donation");
    } finally {
      setLoading(false);
    }
  };

  const handleEftDonate = async (reference: string) => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Use EFT-specific fee calculations
      const tipAmount = calculateTipAmount();
      const platformFee = calculateEFTPlatformFee();
      const transactionFee = calculateEFTTransactionFee();
      const netDonationAmount = calculateNetDonationAmount();
      const totalChargeAmount = calculateTotalChargeAmount();

      console.log("🏦 EFT campaign donation fee breakdown:", {
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

      const donationData = {
        donorId: user?.userId,
        campaignId,
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
        ...(wantS18A && {
          IDNumber: idNumber.replace(/\s/g, ''),
          taxNumber: taxNumber.trim(),
        }),
      };

      await axios.post(`${BASE_URL}/donations`, donationData);

      // Send socket notification
      sendSocketNotification({ ...donationData, anonymous: formData.anonymous });

      // Track EFT donation
      ReactGA.event({
        category: "Donation",
        action: "eft_initiated",
        label: campaignTitle,
        value: Math.round(totalChargeAmount),
      });

      toast.success("EFT donation recorded! Complete payment using the provided bank details.");
      setShowEFTModal(false);
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

  // S18A Certificate handlers
  const formatIdNumber = (value: string) => {
    // Remove all non-digits and limit to 13 characters
    const digits = value.replace(/\D/g, '').slice(0, 13);
    // Format as XXX XXX XXXX XXX
    return digits.replace(/(\d{6})(\d{4})(\d{3})/, '$1 $2 $3').trim();
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIdNumber(e.target.value);
    setIdNumber(formatted);
    if (s18aErrors.idNumber) {
      setS18aErrors(prev => ({ ...prev, idNumber: undefined }));
    }
  };

  const handleTaxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxNumber(e.target.value);
    if (s18aErrors.taxNumber) {
      setS18aErrors(prev => ({ ...prev, taxNumber: undefined }));
    }
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

  // Autofill name/email if "For you" is selected for S18A
  useEffect(() => {
    if (wantS18A && s18aFor === "self" && user) {
      setFormData((prev) => ({
        ...prev,
        donorName: user.name || "",
        donorEmail: user.email || "",
      }));
    }else {
      setFormData((prev) => ({
        ...prev,
        donorName: "",
        donorEmail: "",
      }));
    }

  }, [wantS18A, s18aFor, user]);

  if (settingsLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mr-3"></div>
          <span className="text-gray-600">Loading payment settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h2>
      


      {/* Amount Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Amount</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {predefinedAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setAmount(amt);
                setCustomAmount("");
              }}
              className={`px-4 py-3 rounded-full border-2 font-medium transition-all ${amount === amt
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
        <label className="block text-sm font-medium text-gray-700">Fee Contribution (Optional)</label>
        <p className="block text-sm font-medium text-gray-400 mb-3">You can help us to maximise your selected base donation by contributing towards our fees.</p>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {tipOptions.map((tip) => (
            <button
              key={tip.value}
              onClick={() => handleTipChange(tip.value)}
              className={`px-3 py-2 rounded-full border font-medium text-sm transition-all ${tipPercentage === tip.value && !customTip
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
          placeholder="Custom amount (R)"
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

      {/* S18A Certificate Section - Only for verified campaigns */}
      {isVerified && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-green-800">Verified Campaign</span>
            </div>
            <p className="text-sm text-green-700">
              This campaign is verified and eligible for S18A tax certificates.
            </p>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-3">S18A Tax Certificate</label>
          <p className="text-sm text-gray-600 mb-4">
            Would you like to receive an S18A certificate for tax deduction purposes?
          </p>

          <div className="space-y-3 mb-4">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="s18a"
                checked={!wantS18A}
                onChange={() => setWantS18A(false)}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">No, thank you</span>
                <p className="text-sm text-gray-600">Continue without S18A certificate</p>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="s18a"
                checked={wantS18A}
                onChange={() => setWantS18A(true)}
                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
              />
              <div className="ml-3">
                <span className="font-medium text-gray-900">Yes, I want S18A certificate</span>
                <p className="text-sm text-gray-600">Required for tax deduction claims</p>
              </div>
            </label>
          </div>

          {/* S18A Details Form */}
          {wantS18A && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">S18A Certificate Details</h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who is the S18A certificate for?
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="s18aFor"
                      value="self"
                      checked={s18aFor === "self"}
                      onChange={() => setS18aFor("self")}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <span className="ml-2 text-gray-800">For you</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="s18aFor"
                      value="individual"
                      checked={s18aFor === "individual"}
                      onChange={() => setS18aFor("individual")}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <span className="ml-2 text-gray-800">For another Individual</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="s18aFor"
                      value="business"
                      checked={s18aFor === "business"}
                      onChange={() => setS18aFor("business")}
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                    />
                    <span className="ml-2 text-gray-800">For a Business</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    South African ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    value={idNumber}
                    onChange={handleIdNumberChange}
                    placeholder="000 000 0000 000"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      s18aErrors.idNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {s18aErrors.idNumber && (
                    <p className="text-red-600 text-xs mt-1">{s18aErrors.idNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Number *
                  </label>
                  <input
                    type="text"
                    id="taxNumber"
                    value={taxNumber}
                    onChange={handleTaxNumberChange}
                    placeholder="Enter your tax number"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      s18aErrors.taxNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {s18aErrors.taxNumber && (
                    <p className="text-red-600 text-xs mt-1">{s18aErrors.taxNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fee Breakdown */}
      {amount && parseFloat(amount) > 0 && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            {selectedPaymentType} Payment Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Donation:</span>
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
              <span>Total Donation You Pay:</span>
              <span className="text-secondary">R{calculateTotalChargeAmount().toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between font-semibold text-green-600">
              <span>Campaign Receives:</span>
              <span>R{calculateNetDonationAmount().toFixed(2)}</span>
            </div> */}
          </div>
        </div>
      )}

      {/* Donor Details */}
      <div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">Donor Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Full Name */}
    <div>
      <label htmlFor="donorName" className="block text-sm mb-2 font-medium text-gray-700">Full Name *</label>
      <input
        type="text"
        id="donorName"
        name="donorName"
        value={formData.donorName}
        onChange={handleInputChange}
        placeholder="Enter your full name"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
        disabled={wantS18A && s18aFor === "self"}
      />
    </div>

    {/* Email Address */}
    <div>
      <label htmlFor="donorEmail" className="block text-sm mb-2 font-medium text-gray-700">Email Address *</label>
      <input
        type="email"
        id="donorEmail"
        name="donorEmail"
        value={formData.donorEmail}
        onChange={handleInputChange}
        placeholder="Enter your email address"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
        disabled={wantS18A && s18aFor === "self"}
      />
    </div>

    {/* Phone Number */}
    <div>
      <label htmlFor="mobile" className="block text-sm mb-2 font-medium text-gray-700">Mobile Number *</label>
      <PhoneInput
        country={'za'}
        value={formData.mobile || ""}
        onChange={(phone) => setFormData({ ...formData, mobile: phone })}
        enableSearch={true}
        inputClass="!w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
        containerClass="!w-full"
        buttonClass="!border-none"
        dropdownClass="phone-input-dropdown"
        searchClass="phone-input-search"
        placeholder="Enter your phone number"
      />
    </div>

    {/* Street Address */}
    <div>
      <label htmlFor="address" className="block text-sm mb-2 font-medium text-gray-700">Street Address *</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Enter your street address"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>

    {/* City */}
    <div>
      <label htmlFor="city" className="block text-sm mb-2 font-medium text-gray-700">City *</label>
      <input
        type="text"
        id="city"
        name="city"
        value={formData.city}
        onChange={handleInputChange}
        placeholder="Enter your city"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>

    {/* Province */}
    <div>
      <label htmlFor="province" className="block text-sm mb-2 font-medium text-gray-700">Province *</label>
      <input
        type="text"
        id="province"
        name="province"
        value={formData.province}
        onChange={handleInputChange}
        placeholder="Enter your province"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>

    {/* Postal Code */}
    <div>
      <label htmlFor="postalCode" className="block text-sm mb-2 font-medium text-gray-700">Postal Code *</label>
      <input
        type="text"
        id="postalCode"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleInputChange}
        placeholder="Enter your postal code"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>

    {/* Comment */}
    <div className="md:col-span-2">
      <label htmlFor="comment" className="block text-sm mb-2 font-medium text-gray-700">Comment </label>
      <input
        type="text"
        id="comment"
        name="comment"
        value={formData.comment}
        onChange={handleInputChange}
        placeholder="Add a comment..."
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
      />
    </div>
  </div>

  {/* Checkboxes */}
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

  <label className="flex items-center mt-4 p-3 bg-gray-50 rounded-lg">
    <input
      type="checkbox"
      name="terms"
      checked={formData.terms}
      onChange={handleInputChange}
      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded mr-3"
    />
    <span className="text-sm text-gray-700">
      I agree to the <a href="/terms" target="_blank" className="text-secondary hover:underline">Terms and Conditions</a>
    </span>
  </label>
</div>


      

      {/* Donate Button */}
      {user ? (
        
        <button
        onClick={handleDonate}
        disabled={loading || isPending || settingsLoading}
        className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading || isPending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing {selectedPaymentType} Payment...
          </>
        ) : (
          `DONATE R${calculateTotalChargeAmount().toFixed(2)} via ${selectedPaymentType}`
        )}
      </button>
      ) : (
        <Link
          to="/login"
          className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          Log in to Donate
        </Link>
      )}

      {/* EFT Modal */}
      {showEFTModal && (
        <EFTModal
          onClose={() => setShowEFTModal(false)}
          setType={() => setShowEFTModal(false)}
          amount={calculateTotalChargeAmount().toString()}
          handleDonate={handleEftDonate}
        />
      )}
    </div>
  );
};

export default DonationForm;