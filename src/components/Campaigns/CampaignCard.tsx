import React, { useEffect, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BASE_URL } from "../../config/url";
import axios from "axios";
import Notification from "../notification/Notification";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import ReactGA from 'react-ga4';

dayjs.extend(relativeTime); //  This is required to enable `fromNow()`

// interface Campaign {
//     _id: string;
//     organizationId: string | null;
//     image: string;
//     title: string;
//     description: string;
//     city: string;
//     createdAt: string;
//     amount: number;
//     totalDonations: number;
//     lastDonationDate: string;
// }

const CampaignCard: React.FC<{
  campaign: any;
  admin?: boolean;
  campaigner?: boolean;
  onSuccess?: () => void;
}> = ({ campaign, admin = false, campaigner = false, onSuccess }) => {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const raised = campaign.totalDonations;
  const goal = campaign.amount;
  const progress = (raised / goal) * 100;


  useEffect(() => {
    ReactGA.event({
      category: 'Campaign',
      action: 'view_campaign',
      label: `${campaign.title} | ${campaign._id}`,
    });

  }, [campaign]);

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await axios.delete(
          `${BASE_URL}/campaigns/delete/${campaign._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setIsDeleted(true);
        onSuccess();

        // window.location.reload();
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
<div className="font-sans flex flex-col border border-primarylight bg-white p-4 gap-4 rounded-lg overflow-hidden w-full max-w-[370px] hover:shadow-lg hover:border-primarylight transition-all duration-300">
      {isDeleted && (
        <Notification
          isOpen={isDeleted}
          onClose={() => setIsDeleted(false)}
          title="Success"
          message="Campaign deleted successfully"
        />
      )}

      <div className="relative w-full h-[200px]">
        <img
          src={campaign.image}
          alt="campaign-card"
          className={`w-full h-full object-cover rounded-lg transition-all duration-500 ${
            loaded ? "blur-0 opacity-100" : "blur-md opacity-60 animate-pulse"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      </div>
      {campaign?.verified && <p className="text-sm font-bold bg-primarylight w-[70px] text-center text-white p-1 rounded-full">{campaign?.verified ? "S18A" : ""}</p>}
      <p className="text-sm font-bold">{campaign?.organization?.name}</p>


      

      {/* Campaign Title */}
      <div className="flex flex-col gap-2 h-[100px] overflow-hidden">
        <p className="text-lg font-bold font-onest line-clamp-2">
          {campaign.title}
        </p>
        <p className="text-sm text-gray-500 line-clamp-2">
          {campaign.description}
        </p>
      </div>

      {/* Campaign Details */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-[20px] h-[20px] text-secondary" />
          <p className="text-xs font-bold">{campaign.city}</p>
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon className="w-[20px] h-[20px] text-secondary" />
          <p className="text-xs font-bold">
            {dayjs(campaign.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <p className="text-xs font-bold">
        Last Donation :{" "}
        <span className="text-xs text-gray-500 font-normal">
          {campaign.lastDonationDate
            ? dayjs(campaign.lastDonationDate).fromNow()
            : "No donations yet"}
        </span>
      </p>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-bold">
          <p>Goal: R{goal.toLocaleString()}</p>
          <p>Raised: R{raised.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-end">
          <p className="text-sm font-bold text-secondary">
            {Number(progress).toFixed(2)}% Funded
          </p>
        </div>

        <progress
          value={raised}
          max={goal}
          className="w-full h-3 rounded-full overflow-hidden appearance-none
                        [&::-webkit-progress-bar]:bg-gray-300 
                        [&::-webkit-progress-value]:bg-secondary 
                        [&::-webkit-progress-value]:rounded-full 
                        [&::-moz-progress-bar]:bg-secondary"
        />
      </div>

      {!admin && !campaigner && (
        <div className="flex items-center justify-center">
          <Link
            to={`/home/campaigns/${campaign._id}`}
            className="bg-secondary text-center hover:bg-secondary/80 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-full w-full"
          >
            Donate Now
          </Link>
        </div>
      )}

      {admin && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-center text-secondary disabled:opacity-50 border border-secondary transition-colors duration-200 hover:text-black font-semibold px-4 py-2 rounded-full w-full"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <Link
            to={`/admin/campaigns/${campaign._id}`}
            className="bg-secondary text-center hover:bg-seconadry/80 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-full w-full"
          >
            Preview
          </Link>
        </div>
      )}

      {campaigner && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-center text-secondary disabled:opacity-50 border border-secondary transition-colors duration-200 hover:text-white hover:bg-secondary font-semibold px-4 py-2 rounded-full w-full"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <Link
            to={`/user/dashboard/campaigns/${campaign._id}`}
            className="bg-secondary text-center hover:bg-secondary/80 transition-colors duration-200 text-white font-semibold px-4 py-2 rounded-full w-full"
          >
            Preview
          </Link>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
