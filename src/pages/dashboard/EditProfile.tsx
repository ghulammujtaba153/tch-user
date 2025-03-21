import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { AuthContext } from "../../context/userContext";

const EditProfile = () => {
  const { user } = useContext(AuthContext)!;
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    profilePicture: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    organization: {
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        // Check if user and userId exist
        try {
          const res = await axios.get(
            `${BASE_URL}/auth/profile?id=${user.userId}`
          );
          console.log(res.data.user);
          setFormData({
            profilePicture: res.data.user.profilePicture,
            name: res.data.user.name,
            gender: res.data.user.gender,
            dateOfBirth: res.data.user.dateOfBirth,
            nationality: res.data.user.nationality,
            organization: res.data.user.organization
              ? {
                  name: res.data.user.organization.name,
                  phone: res.data.user.organization.phone,
                  email: res.data.user.organization.email,
                  address: res.data.user.organization.address,
                  city: res.data.user.organization.city,
                  country: res.data.user.organization.country,
                }
              : {},
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
          alert("Failed to fetch profile data. Please try again.");
        }
      }
    };

    fetchData();
  }, [user]);

  // Handle file upload
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form field changes
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    if (id in formData) {
      setFormData({ ...formData, [id]: value });
    } else if (id.startsWith("organization")) {
      const field = id.split(".")[1];
      setFormData({
        ...formData,
        organization: {
          ...formData.organization,
          [field]: value,
        },
      });
    }
  };

  // Handle form submission
  const handleUpdateProfile = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/update-profile/${user?.userId}`,
        formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <div className="flex flex-col items-center w-full max-w-4xl gap-4 py-6 px-4 md:px-6 border border-gray-300 shadow-md rounded-[20px] text-gray-800">
        {/* Title */}
        <h1 className="text-2xl font-semibold">Edit Profile</h1>

        {/* Personal Information Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Personal Information</h1>

          {/* Flex Container for Upload and Form Fields */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Custom File Upload Area */}
            <div className="w-full md:w-1/3 h-full">
              <label
                htmlFor="profilePicture"
                className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-[#BEE36E] transition-colors h-full"
              >
                {/* Image Preview or Upload Icon */}
                {formData.profilePicture || imagePreview ? (
                  <img
                    src={imagePreview || formData.profilePicture} // Use imagePreview if available, otherwise use formData.profilePicture
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 text-center">
                      <span className="text-[#BEE36E] font-medium">
                        Upload image
                      </span>{" "}
                      or drag and drop
                    </span>
                  </>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="text-sm text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
                />
              </div>

              {/* Gender, Date of Birth, and Nationality Fields */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Gender Field */}
                <div className="w-full md:w-1/3">
                  <label htmlFor="gender" className="text-sm text-gray-500">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 bg-white rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Date of Birth Field */}
                <div className="w-full md:w-1/3">
                  <label
                    htmlFor="dateOfBirth"
                    className="text-sm text-gray-500"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
                  />
                </div>

                {/* Nationality Field */}
                <div className="w-full md:w-1/3">
                  <label
                    htmlFor="nationality"
                    className="text-sm text-gray-500"
                  >
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Information Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Organization Information</h1>
          <div className="flex items-center flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/2">
              <label
                htmlFor="organization.name"
                className="text-sm text-gray-500"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="organization.name"
                value={formData.organization.name}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
              />
            </div>

            <div className="w-full md:w-1/2">
              <label
                htmlFor="organization.phone"
                className="text-sm text-gray-500"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="organization.phone"
                value={formData.organization.phone}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
              />
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="organization.email"
              className="text-sm text-gray-500"
            >
              Email
            </label>
            <input
              type="email"
              id="organization.email"
              value={formData.organization.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/3">
              <label
                htmlFor="organization.address"
                className="text-sm text-gray-500"
              >
                Organization Address
              </label>
              <input
                type="text"
                id="organization.address"
                value={formData.organization.address}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
              />
            </div>

            <div className="w-full md:w-1/3">
              <label
                htmlFor="organization.city"
                className="text-sm text-gray-500"
              >
                City
              </label>
              <input
                type="text"
                id="organization.city"
                value={formData.organization.city}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
              />
            </div>

            <div className="w-full md:w-1/3">
              <label
                htmlFor="organization.country"
                className="text-sm text-gray-500"
              >
                Country
              </label>
              <input
                type="text"
                id="organization.country"
                value={formData.organization.country}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-[#BEE36E]"
              />
            </div>
          </div>
        </div>

        {/* Save and Discard Buttons */}
        <div className="flex items-center w-full gap-4">
          <button
            className="bg-[#BEE36E] hover:bg-[#BEE36E]/80 transition-colors text-black px-4 py-2 rounded-full"
            onClick={handleUpdateProfile}
          >
            Save Changes
          </button>
          <button
            className="text-[#BEE36E] border border-[#BEE36E] hover:bg-[#BEE36E] hover:text-black transition-colors px-4 py-2 rounded-full"
            onClick={() => window.history.back()}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
