import React from 'react';

interface Props {
  onClose: () => void;
  setType: (type: 'card' | 'eft' | 'other') => void;
  handleDonate: () => void;
}

const PaymentTypeModal: React.FC<Props> = ({ onClose, setType, handleDonate }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-center">Select a payment method</h2>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => {
              setType('card');
              handleDonate(); // Call donation for card
              onClose();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
          >
            Pay with Debit/Credit Card
          </button>

          <button
            onClick={() => {
              setType('eft'); // Show EFT modal
              onClose();
            }}
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors"
          >
            Pay with EFT
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

export default PaymentTypeModal;
