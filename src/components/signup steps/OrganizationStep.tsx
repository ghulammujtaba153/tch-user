import React, { useState } from "react";

interface OrganizationStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const OrganizationStep: React.FC<OrganizationStepProps> = ({ data, setData, onNext, onBack }) => {
  const [wantsOrganization, setWantsOrganization] = useState(data.wantsOrganization ?? false);

  console.log("data", data)

  const handleToggle = (value: boolean) => {
    setWantsOrganization(value);
    setData({ ...data, wantsOrganization: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold mb-4">Organization Registration</h2>

      <div className="mb-6">
        <label className="block font-medium mb-2">
          Do you want to register an organization?
        </label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="registerOrg"
              value="true"
              checked={wantsOrganization === true}
              onChange={() => handleToggle(true)}
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="registerOrg"
              value="false"
              checked={wantsOrganization === false}
              onChange={() => handleToggle(false)}
            />
            No
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 underline"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
        >
          Next
        </button>
      </div>
      <p className="col-span-4 mt-6 text-sm text-center">Version 1.2.0</p>

    </form>
  );
};

export default OrganizationStep;
