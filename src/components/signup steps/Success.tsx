import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate("/user/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-4 text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
      <p className="text-gray-700 mb-6">Your account has been created successfully.</p>
      <button
        onClick={handleDone}
        className="bg-secondary text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300"
      >
        Done
      </button>
    </div>
  );
};

export default Success;
