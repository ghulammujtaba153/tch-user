import React from 'react';
import { Link } from 'react-router-dom';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  link?: string | null;
}

const Notification: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  link = null,
  type = 'success'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center font-onest z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          {type === 'success' && (
            <div className="w-20 h-20 rounded-full bg-[#BEE36E] flex items-center justify-center mb-6">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
          {type === 'error' && (
            <div className="w-20 h-20 rounded-full bg-[#BEE36E] flex items-center justify-center mb-6">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold mb-2 font-onest">
            {title}
          </h2>

          {/* Message */}
          <p className=" mb-8 font-sans">
            {message}
          </p>

          {link && (
            <Link to={link} className="w-full bg-[#BEE36E] text-black py-3 rounded-lg font-medium hover:bg-[#a8cc5c] transition-colors duration-200">Continue</Link>
          )}

          {/* Continue Button */}
          {!link && (
            <button
              onClick={onClose}
              className="w-full bg-[#BEE36E] text-black py-3 rounded-lg font-medium hover:bg-[#a8cc5c] transition-colors duration-200"
            >
              ok
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;