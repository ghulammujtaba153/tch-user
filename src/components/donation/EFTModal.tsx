import React from "react";

interface EFTModalProps {
  onClose: () => void;
  handleDonate: () => void;
}

const EFTModal: React.FC<EFTModalProps> = ({ onClose, handleDonate }) => {
  const getReferenceNumber = () => {
    const randomPrefix = [...Array(3)]
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join("");

    const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");

    const randomSuffix = [...Array(6)]
      .map(() => Math.random().toString(36)[2].toUpperCase())
      .join("");

    return `${randomPrefix}${timestamp}${randomSuffix}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">EFT Details</h2>

        <div className="text-gray-600 space-y-1">
          <p><span className="font-semibold">Bank Name:</span> FNB</p>
          <p><span className="font-semibold">Account Name:</span> Givetogrow NPC</p>
          <p><span className="font-semibold">Account Number:</span> 1234567899</p>
          <p><span className="font-semibold">Branch Code:</span> 143334</p>
          <p><span className="font-semibold">SWIFT Code:</span> 1231</p>
          <p>
            <span className="font-semibold">Custom Reference:</span>{" "}
            {getReferenceNumber()}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleDonate}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors"
          >
            I've Paid
          </button>
          <button
            onClick={onClose}
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
