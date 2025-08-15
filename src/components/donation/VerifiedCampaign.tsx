import React, { useState } from 'react';
import { XMarkIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface VerifiedCampaignProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (s18aData?: { wantS18A: boolean; idNumber?: string; taxNumber?: string }) => void;
  campaignTitle: string;
}

const VerifiedCampaign: React.FC<VerifiedCampaignProps> = ({
  isOpen,
  onClose,
  onProceed,
  campaignTitle
}) => {
  const [wantS18A, setWantS18A] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [errors, setErrors] = useState<{ idNumber?: string; taxNumber?: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateForm()) {
      const s18aData = wantS18A 
        ? { 
            wantS18A: true, 
            idNumber: idNumber.replace(/\s/g, ''), 
            taxNumber: taxNumber.trim() 
          }
        : { wantS18A: false };
      
      onProceed(s18aData);
    }
  };

  const formatIdNumber = (value: string) => {
    // Remove all non-digits and limit to 13 characters
    const digits = value.replace(/\D/g, '').slice(0, 13);
    // Format as XXX XXX XXXX XXX
    return digits.replace(/(\d{6})(\d{4})(\d{3})/, '$1 $2 $3').trim();
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIdNumber(e.target.value);
    setIdNumber(formatted);
    if (errors.idNumber) {
      setErrors(prev => ({ ...prev, idNumber: undefined }));
    }
  };

  const handleTaxNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxNumber(e.target.value);
    if (errors.taxNumber) {
      setErrors(prev => ({ ...prev, taxNumber: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verified Campaign</h2>
              <p className="text-sm text-gray-600">This campaign is verified</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Verification Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Campaign Verified</span>
            </div>
            <p className="text-sm text-green-700">
              "{campaignTitle}" has been verified by our team and is eligible for S18A tax certificates.
            </p>
          </div>

          {/* S18A Certificate Option */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              S18A Tax Certificate
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Would you like to receive an S18A certificate for tax deduction purposes? This certificate allows you to claim tax deductions on your donation.
            </p>

            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="s18a"
                  checked={!wantS18A}
                  onChange={() => setWantS18A(false)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
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
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Yes, I want S18A certificate</span>
                  <p className="text-sm text-gray-600">Required for tax deduction claims</p>
                </div>
              </label>
            </div>
          </div>

          {/* S18A Details Form */}
          {wantS18A && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">S18A Certificate Details</h4>
              
              <div className="space-y-4">
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
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.idNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.idNumber && (
                    <p className="text-red-600 text-xs mt-1">{errors.idNumber}</p>
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
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.taxNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.taxNumber && (
                    <p className="text-red-600 text-xs mt-1">{errors.taxNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Continue to Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedCampaign;