import React, { useContext, useEffect, useState } from "react";
import {
  UserCircleIcon,
  LockClosedIcon,
  BanknotesIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Withdrawal from "./Withdrawal";
import Security from "./Security";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/userContext";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import dayjs from "dayjs";
import Organization from "./Organization";
import Loading from "../../components/Loading";
import AddMember from "../../components/dashboard/AddMember";
import { useAppConfig } from "../../context/AppConfigContext";



const Profile = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const { user } = useContext(AuthContext) || {};
  const [data, setData] = useState<any>({
    profilePicture: "",
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    idNumber: "",
    passportNumber: "",
    nationality: "",
    profession: "",
    addressLine1: "",
    addressLine2: "",
    suburb: "",
    city: "",
    province: "",
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
  const [loading, setLoading] = useState<boolean>(true);
  const { config } = useAppConfig();

  useEffect(() => {
    if (config?.name) {
      document.title = `Profile | ${config.name}`;
    }
  }, [config]);

  let tabs = [
    { name: "Personal Details", key: "profile", icon: UserCircleIcon },
    // { name: "Organization Setup", key: "organization", icon: PencilIcon },
    { name: "Security Settings", key: "security", icon: LockClosedIcon },
    // { name: "Withdrawal", key: "withdraw", icon: BanknotesIcon },
  ];

  // if (user?.organization?.role == "owner") {
  //   tabs.splice(2, 0, {
  //     name: "Team Members",
  //     key: "members",
  //     icon: PencilIcon,
  //   });
  // }

  useEffect(() => {
    if (!user?.userId) return;
    const fetch = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/auth/profile?id=${user?.userId}`
        );
        console.log("fetching user ", res.data.user);
        setData({
          ...data,
          ...res.data.user,
          consentChannels: res.data.user.consentChannels || {
            email: false,
            sms: false,
            whatsapp: false,
            telegram: false,
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex lg:flex-row flex-col items-center justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-[210px] flex items-center justify-center gap-2 px-4 py-2 md:text-sm text-xs rounded-full transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-secondary text-white"
                : "outline outline-secondary outline-1 text-secondary"
            }`}
          >
            {tab.name} <tab.icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="p-4 mt-4">
        {activeTab === "security" && <Security />}
        {activeTab === "withdraw" && <Withdrawal />}
        {activeTab === "organization" && <Organization />}
        {activeTab === "members" && <AddMember />}

        {activeTab === "profile" && (
          <div className="p-4 flex flex-col gap-6">
            {/* Header */}
            <div className="flex sm:flex-row flex-col items-center justify-between">
              <h1 className="text-2xl font-bold text-secondary">
                Personal Details
              </h1>
              {data.isGoogleUse !== true && data.isMicrosoftUse !== true && (
                <Link
                  to="/user/dashboard/profile/edit"
                  className="bg-secondary flex items-center gap-2 text-white text-sm px-4 py-2 rounded-full"
                >
                  Edit Profile <PencilIcon className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Profile Info */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              {/* Left: Profile Picture */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="max-w-[400px] h-full md:max-h-[250px]">
                  {data?.profilePicture ? (
                    <img
                      src={data.profilePicture}
                      alt="Profile"
                      className="w-full h-full rounded-lg object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No Profile Picture</p>
                        <p className="text-xs text-gray-400">Upload one in edit mode</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-[100px]">
                  <DetailItem 
                    label="Full Name" 
                    value={data?.firstName && data?.lastName 
                      ? `${data.firstName} ${data.lastName}` 
                      : data?.name || "N/A"
                    } 
                  />
                  <DetailItem label="Email Address" value={data?.email} />
                  <DetailItem label="Mobile Number" value={data?.phoneNumber || "N/A"} />
                  <DetailItem
                    label="Date of Birth"
                    value={
                      data?.dateOfBirth
                        ? dayjs(data?.dateOfBirth).format("DD/MM/YYYY")
                        : "N/A"
                    }
                  />
                  <DetailItem
                    label="Gender"
                    value={data?.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : "N/A"}
                  />
                  <DetailItem label="ID Number" value={data?.idNumber} />
                  <DetailItem label="Passport Number" value={data?.passportNumber} />
                  <DetailItem label="Nationality" value={data?.nationality} />
                  <DetailItem label="Profession" value={data?.profession} />
                </div>
              </div>
            </div>

            {/* Identity Information */}
            {/* <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-secondary mb-4">
                Identity Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <DetailItem label="ID Number" value={data?.idNumber} />
                <DetailItem label="Passport Number" value={data?.passportNumber} />
                <DetailItem label="Nationality" value={data?.nationality} />
                <DetailItem label="Profession" value={data?.profession} />
              </div>
            </div> */}

            {/* Address Info */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-secondary mb-4">
                Address Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <DetailItem label="Address Line 1" value={data?.addressLine1} />
                <DetailItem label="Address Line 2" value={data?.addressLine2} />
                <DetailItem label="Suburb" value={data?.suburb} />
                <DetailItem label="City" value={data?.city} />
                <DetailItem label="Province/State" value={data?.province || data?.state} />
                <DetailItem label="Postal Code" value={data?.postalCode} />
                <DetailItem label="Country" value={data?.country} />
              </div>
            </div>

            {/* Consent Channels */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-secondary mb-4">
                Communication Preferences
              </h2>
              
              {/* Disclaimer Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>📢 Communication Notice:</strong><br />
                  By activating the communication preferences below, you are accepting communications by 
                  GivetoGrow. We do not sell your information, nor do we intend to spam you!
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["email", "sms", "whatsapp", "telegram"].map((channel) => (
                  <div
                    key={channel}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <span className="font-medium capitalize">{channel}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full font-medium ${
                        data.consentChannels[channel]
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {data.consentChannels[channel] ? "✓ Enabled" : "✗ Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Reusable Detail Item Component
const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col gap-1">
    <h1 className="text-sm font-bold">{label}</h1>
    <p className="text-sm text-gray-500">{value || "N/A"}</p>
  </div>
);

export default Profile;
