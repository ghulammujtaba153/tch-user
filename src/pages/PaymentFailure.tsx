import React from 'react'
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">
        <FaTimesCircle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-4">
          Unfortunately, your payment could not be processed.<br />
          Please try again or contact support if the problem persists.
        </p>
        <a
          href="/"
          className="mt-2 inline-block px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default PaymentFailure
