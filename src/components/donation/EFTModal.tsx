import React, { useState, useEffect } from "react";
import { FaCopy, FaCheckCircle, FaUniversity, FaCreditCard, FaHashtag, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

interface EFTModalProps {
  onClose: () => void;
  setType: (type: string) => void;
  amount: any;
  handleDonate: (reference: string) => void; // <-- accept reference number
}

const EFTModal: React.FC<EFTModalProps> = ({ setType, amount, handleDonate }) => {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateReferenceNumber = () => {
    const randomPrefix = [...Array(3)]
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join("");
    const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = [...Array(6)]
      .map(() => Math.random().toString(36)[2].toUpperCase())
      .join("");
    return `${randomPrefix}${timestamp}${randomSuffix}`;
  };

  useEffect(() => {
    setReferenceNumber(generateReferenceNumber());
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
    await handleDonate(referenceNumber);
    } finally {
    setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const bankDetails = [
    { 
      label: "Bank Name", 
      value: "Standard Bank", 
      icon: FaUniversity,
      copyable: false
    },
    { 
      label: "Account Name", 
      value: "Givetogrow", 
      icon: FaCreditCard,
      copyable: true
    },
    { 
      label: "Account Number", 
      value: "1234567899", 
      icon: FaHashtag,
      copyable: true
    },
    { 
      label: "Account Type", 
      value: "Cheque", 
      icon: FaCreditCard,
      copyable: false
    },
    { 
      label: "Branch Code", 
      value: "051001", 
      icon: FaMapMarkerAlt,
      copyable: true
    },
    { 
      label: "SWIFT Code", 
      value: "SBZAZAJJ", 
      icon: FaUniversity,
      copyable: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl p-4 sm:p-6 flex-shrink-0">
          <button
            onClick={() => setType("ecentric")}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <FaUniversity className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">EFT Payment Details</h2>
            <p className="text-green-100 text-xs sm:text-sm">Use these details to make your payment</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Amount Section */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-green-600 font-medium mb-1">Amount to Pay</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-700">R{parseFloat(amount).toFixed(2)}</p>
            </div>

            {/* Bank Details */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Banking Details</h3>
              
              {bankDetails.map((detail, index) => {
                const IconComponent = detail.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium">{detail.label}</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{detail.value}</p>
                      </div>
                    </div>
                    
                    {detail.copyable && (
                      <button
                        onClick={() => copyToClipboard(detail.value, detail.label)}
                        className="p-1.5 sm:p-2 hover:bg-white rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
                        title={`Copy ${detail.label}`}
                      >
                        {copiedField === detail.label ? (
                          <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                        ) : (
                          <FaCopy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reference Number */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs sm:text-sm text-yellow-700 font-medium mb-1">Payment Reference</p>
                  <p className="text-sm sm:text-lg font-bold text-yellow-800 font-mono break-all">{referenceNumber}</p>
                  <p className="text-xs text-yellow-600 mt-1">⚠️ Use this exact reference</p>
                </div>
                <button
                  onClick={() => copyToClipboard(referenceNumber, "Reference")}
                  className="p-1.5 sm:p-2 hover:bg-yellow-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                  title="Copy Reference Number"
                >
                  {copiedField === "Reference" ? (
                    <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  ) : (
                    <FaCopy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 hover:text-yellow-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-2">Payment Instructions:</h4>
              <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                <li>Use your banking app or visit your bank</li>
                <li>Make a payment using the details above</li>
                <li>Use the reference number exactly as shown</li>
                <li>Click "I've Paid" once payment is complete</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white rounded-b-2xl p-4 sm:p-6">
          <div className="flex flex-col space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Processing...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-4 h-4" />
                  <span className="text-sm sm:text-base">I've Paid</span>
                </>
              )}
          </button>
            
          <button
            onClick={() => setType("ecentric")}
              disabled={loading}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
              <span className="text-sm sm:text-base">Cancel</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EFTModal;
