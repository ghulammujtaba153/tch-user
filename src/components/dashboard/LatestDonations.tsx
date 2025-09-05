import axios from "axios";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { BASE_URL, SOCKET_URL } from "../../config/url";
import { toast } from "react-toastify";

const LatestDonations: React.FC<{ latestDonations: any }> = ({
  latestDonations,
}) => {
  const handlePrint = async (donation: any) => {
    const toastId = toast.loading("Generating S18A Certificate...");

    try {
      const res = await axios.post(`${BASE_URL}/s18/document`, donation);

      toast.update(toastId, {
        render: "Certificate generated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Get the outputPath and convert to browser-accessible URL
      const outputPath = res.data.outputPath;
      if (outputPath) {
        const fileName =
          outputPath.split("certificates\\").pop() ||
          outputPath.split("certificates/").pop();
        const fileUrl = `${SOCKET_URL}/certificates/${fileName}`;
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to generate S18A Certificate",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error("Error generating S18A Certificate: ", error);
    }
  };


  
  return (
    <div className="flex flex-col gap-4 rounded-lg p-2 sm:p-6 bg-white shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Recent Donations</h1>
        
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {/* Header row */}
            <div className="grid grid-cols-4 gap-4 px-2 py-2 text-sm font-semibold text-gray-600 border-b">
              <div>Donor</div>
              <div>Donation to</div>
              <div className="text-right">Amount</div>
              <div className="text-center">Actions</div>
            </div>

            {/* Donation rows */}
            {latestDonations?.map((item: any) => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-4 items-center px-2 py-3 hover:bg-gray-50 rounded-lg transition"
              >
                {/* Donor column */}
                <div className="flex items-center gap-2">
                  <img
                    src={
                      item.anonymous
                        ? "/user.png"
                        : item.user.profilePicture || "/user.png"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full border"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium truncate">
                      {item.anonymous ? "Anonymous" : item.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(item.date).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>

                {/* Campaign column */}
                <p className="text-sm truncate">{item.campaignName? item.campaignName : "Organization Fund"}</p>

                {/* Amount column */}
                <p className="text-sm text-right font-semibold text-green-600">
                  R{item.amount}
                </p>

                {/* Actions column */}
                <div className="flex justify-center">
                  { item?.s18aRecord?.length > 0 &&
                    <button
                    onClick={() => handlePrint(item.s18aRecord[0])}
                    className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Print
                  </button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestDonations;
