import React, { useState, useEffect } from "react";

interface EFTModalProps {
  onClose: () => void;
  setType: (type: string) => void;
  amount: any;
  handleDonate: (reference: string) => void; // <-- accept reference number
}

const EFTModal: React.FC<EFTModalProps> = ({ setType, amount, handleDonate }) => {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);

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
    await handleDonate(referenceNumber);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">EFT Details</h2>

        <div className="text-gray-600 space-y-1">
          <p><span className="font-semibold">Bank:</span> Standard Bank</p>
          <p><span className="font-semibold">Account Name:</span> Givetogrow</p>
          <p><span className="font-semibold">Account Number:</span> 1234567899</p>
          <p><span className="font-semibold">Account Type:</span> Cheque</p>
          <p><span className="font-semibold">Branch Code:</span> 051001</p>
          <p><span className="font-semibold">SWIFT Code:</span> SBZAZAJJ</p>
          <p><span className="font-semibold">Amount:</span> R{amount}</p>
          <p>
            <span className="font-semibold">Unique Ref:</span> {referenceNumber}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors"
          >
            {loading ? "Processing..." : "I've Paid"}
          </button>
          <button
            onClick={() => setType("ecentric")}
            className="bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EFTModal;
