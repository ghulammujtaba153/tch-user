import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import { AuthContext } from "../../context/userContext";
import upload from "../../utils/upload";
import { useAppConfig } from "../../context/AppConfigContext";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countries from 'world-countries';

const EditProfile = () => {
  const { user } = useContext(AuthContext)!;
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    profilePicture: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    idNumber: "",
    passportNumber: "",
    nationality: "",
    profession: "",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
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



  // Prepare country options for dropdown
  const countryOptions = countries.map(country => ({
    value: country.name.common,
    label: country.name.common,
    flag: country.flag
  })).sort((a, b) => a.label.localeCompare(b.label));

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
            firstName: u.firstName || u.name?.split(' ')[0] || "",
            lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || "",
            email: u.email || "",
            phoneNumber: u.phoneNumber || "",
            dateOfBirth: u.dateOfBirth,
            gender: u.gender,
            idNumber: u.idNumber || "",
            passportNumber: u.passportNumber || "",
            nationality: u.nationality,
            profession: u.profession || "",
            addressLine1: u.addressLine1 || "",
            addressLine2: u.addressLine2 || "",
            suburb: u.suburb || "",
            city: u.city || "",
            state: u.state || u.state || "",
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

  // Handle nationality dropdown change
  const handleNationalityChange = (selectedOption: any) => {
    setFormData({ ...formData, nationality: selectedOption?.value || "" });
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
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center">
                      <span className="text-secondary font-medium">
                        Upload profile picture
                      </span>{" "}
                      or drag and drop
                    </span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
                  </div>
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
              {/* First Name and Last Name */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="firstName" className="text-sm text-gray-500">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="lastName" className="text-sm text-gray-500">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-sm text-gray-500">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="text-sm text-gray-500">
                  Mobile Number *
                </label>
                <PhoneInput
                  value={formData.phoneNumber}
                  onChange={(e: any) => handleChange({target: {id: "phoneNumber", value: e}})}
                  placeholder="Enter your mobile number"
                  containerClass="w-full"
                  inputClass="w-full !border-gray-300 focus:!border-secondary focus:!ring-2 focus:!ring-secondary"
                />
              </div>

              {/* Date of Birth and Gender */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="dateOfBirth" className="text-sm text-gray-500">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="gender" className="text-sm text-gray-500">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* ID Number and Passport Number */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="idNumber" className="text-sm text-gray-500">
                    ID Number
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="Enter your ID number"
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="passportNumber" className="text-sm text-gray-500">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    placeholder="Enter your passport number"
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Nationality and Profession */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <label htmlFor="nationality" className="text-sm text-gray-500">
                    Nationality *
                  </label>
                  <Select
                    value={countryOptions.find(option => option.value === formData.nationality)}
                    onChange={handleNationalityChange}
                    options={countryOptions}
                    placeholder="Select your nationality"
                    isClearable
                    isSearchable
                    formatOptionLabel={(option: any) => (
                      <div className="flex items-center gap-2">
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                    )}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '2px',
                        '&:hover': {
                          borderColor: '#d1d5db'
                        },
                        '&:focus-within': {
                          borderColor: 'var(--secondary-color)',
                          boxShadow: '0 0 0 2px rgba(var(--secondary-color-rgb), 0.2)'
                        }
                      })
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="profession" className="text-sm text-gray-500">
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Enter your profession"
                    className="bg-transparent w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Address Information</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="addressLine1" className="text-sm text-gray-500 block mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                id="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Enter address line 1"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="addressLine2" className="text-sm text-gray-500 block mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                id="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Enter address line 2 (optional)"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="suburb" className="text-sm text-gray-500 block mb-1">
                Suburb
              </label>
              <input
                type="text"
                id="suburb"
                value={formData.suburb}
                onChange={handleChange}
                placeholder="Enter suburb"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="city" className="text-sm text-gray-500 block mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="province" className="text-sm text-gray-500 block mb-1">
                Province/State
              </label>
              <input
                type="text"
                id="province"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter province or state"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="text-sm text-gray-500 block mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label htmlFor="country" className="text-sm text-gray-500 block mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>
        </div>

        {/* Consent Notification Channels */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Communication Preferences</h1>
          
          {/* Disclaimer Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>📢 Communication Notice:</strong><br />
              By activating the communication preferences below, you are accepting communications by 
              GivetoGrow. We do not sell your information, nor do we intend to spam you!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["email", "sms", "whatsapp", "telegram"].map((channel) => (
              <label key={channel} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.consentChannels[channel]}
                  onChange={() => handleConsentChange(channel)}
                  className="w-4 h-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                />
                <span className="text-sm font-medium capitalize">{channel}</span>
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
