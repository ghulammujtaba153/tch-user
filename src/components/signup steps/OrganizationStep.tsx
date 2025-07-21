import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import { toast } from "react-toastify";
import Select from "react-select";

interface OrganizationStepProps {
  data: any;
  setData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const OrganizationStep: React.FC<OrganizationStepProps> = ({
  data,
  setData,
  onNext,
  onBack
}) => {
  const [wantsOrganization, setWantsOrganization] = useState(
    data.wantsOrganization ?? false
  );
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<any>(
    data.selectedOption || null
  );
  const [customOrganization, setCustomOrganization] = useState(
    data.customOrganization || ""
  );

  // Fetch organizations
  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/organization`);
      setOrganizations(res.data);
    } catch (error) {
      toast.error("Something went wrong while fetching organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Options for react-select
  const options = [
    ...organizations.map((org) => ({ value: org.name, label: org.name })),
    { value: "custom", label: "+ Add New Organization" },
  ];

  const handleToggle = (value: boolean) => {
    setWantsOrganization(value);
    setData({ ...data, wantsOrganization: value });
  };

  const handleChange = (option: any) => {
    setSelectedOption(option);
    if (option?.value === "custom") {
      setCustomOrganization("");
      setData({
        ...data,
        selectedOption: option,
        isCustomOrganization: true,
        organizationName: "",
      });
    } else {
      setData({
        ...data,
        selectedOption: option,
        isCustomOrganization: false,
        organizationName: option?.value,
      });
    }
  };

  const handleCustomOrganizationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomOrganization(value);
    setData({
      ...data,
      customOrganization: value,
      organizationName: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wantsOrganization) {
      if (selectedOption?.value === "custom" && !customOrganization.trim()) {
        toast.error("Please enter an organization name");
        return;
      }
      if (!selectedOption && !customOrganization) {
        toast.error("Please select or enter an organization");
        return;
      }
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold mb-4">Organization Registration</h2>

      {/* Toggle Organization */}
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

      {/* Organization Selection */}
      {wantsOrganization && (
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Select Organization or Enter New Name
          </label>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={options}
            isLoading={loading}
            placeholder="Select or add organization..."
            className="mb-3"
          />

          {/* Custom Organization Input */}
          {selectedOption?.value === "custom" && (
            <div className="mt-3">
              <input
                type="text"
                value={customOrganization}
                onChange={handleCustomOrganizationChange}
                placeholder="Enter organization name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the name of your new organization
              </p>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform"
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
