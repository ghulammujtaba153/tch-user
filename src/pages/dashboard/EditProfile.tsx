import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { AuthContext } from "../../context/userContext";
import upload from "../../utils/upload";
import { useAppConfig } from "../../context/AppConfigContext";

const EditProfile = () => {
  const { user } = useContext(AuthContext)!;
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    profilePicture: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    addressLine1: "",
    addressLine2: "",
    phoneNumber: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    consentChannels: {
      email: false,
      sms: false,
      whatsapp: false,
      telegram: false,
    },
  });

  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = `Profile | ${config.name}`;
    }
  }, [config]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.userId) {
        try {
          const res = await axios.get(
            `${BASE_URL}/auth/profile?id=${user.userId}`
          );
          console.log(res.data.user);
          const u = res.data.user;
          setFormData({
            profilePicture: u.profilePicture,
            name: u.name,
            gender: u.gender,
            dateOfBirth: u.dateOfBirth,
            nationality: u.nationality,
            phoneNumber: u.phoneNumber || "",
            addressLine1: u.addressLine1 || "",
            addressLine2: u.addressLine2 || "",
            city: u.city || "",
            state: u.state || "",
            postalCode: u.postalCode || "",
            country: u.country || "",
            consentChannels: u.consentChannels || {
              email: false,
              sms: false,
              whatsapp: false,
              telegram: false,
            },
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
    setFile(file);
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
    }
  };

  // Handle consent toggle
  const handleConsentChange = (channel: string) => {
    setFormData({
      ...formData,
      consentChannels: {
        ...formData.consentChannels,
        [channel]: !formData.consentChannels[channel],
      },
    });
  };

  // Handle form submission
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const url = file ? await upload(file) : formData.profilePicture;
      formData.profilePicture = url;

      const res = await axios.post(
        `${BASE_URL}/auth/update-profile/${user?.userId}`,
        formData,
        {
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
    } finally {
      setLoading(false);
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

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Image Upload */}
            <div className="w-full md:w-1/3 h-full">
              <label
                htmlFor="profilePicture"
                className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-secondary transition-colors h-full"
              >
                {formData.profilePicture || imagePreview ? (
                  <img
                    src={imagePreview || formData.profilePicture}
                    alt="Profile Preview"
                    className="bg-transparent w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 text-center">
                      <span className="text-secondary font-medium">
                        Upload image
                      </span>{" "}
                      or drag and drop
                    </span>
                  </>
                )}
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
              <div>
                <label htmlFor="name" className="text-sm text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <label htmlFor="gender" className="text-sm text-gray-500">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="w-full md:w-1/3">
                  <label htmlFor="dateOfBirth" className="text-sm text-gray-500">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="w-full md:w-1/3">
                  <label htmlFor="nationality" className="text-sm text-gray-500">
                    Nationality
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="text-sm text-gray-500">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Address Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              id="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Address Line 1"
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              id="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Address Line 2"
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="border border-gray-300 p-2 rounded-md"
            />
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
        </div>

        {/* Consent Notification Channels */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Notification Preferences</h1>
          <div className="flex flex-col md:flex-row gap-4">
            {["email", "sms", "whatsapp", "telegram"].map((channel) => (
              <label key={channel} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.consentChannels[channel]}
                  onChange={() => handleConsentChange(channel)}
                  className="w-4 h-4"
                />
                {channel.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Save & Discard */}
        <div className="flex items-center w-full gap-4 mt-4">
          <button
            disabled={loading}
            type="submit"
            className="bg-secondary hover:bg-secondary/80 transition-colors text-white px-4 py-2 rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleUpdateProfile}
          >
            Save Changes
          </button>
          <button
            className="text-secondary border border-secondary hover:bg-secondary hover:text-white transition-colors px-4 py-2 rounded-full"
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
