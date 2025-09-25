import React from 'react'
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your donation!<br />
          Your payment has been processed successfully.
        </p>
        <a
          href="/"
          className="mt-2 inline-block px-6 py-2 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default PaymentSuccess
