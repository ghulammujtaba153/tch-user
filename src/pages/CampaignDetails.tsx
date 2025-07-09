import { useEffect, useState, useTransition } from "react";
import { useLocation, useParams } from "react-router-dom";
import DonationForm from "../components/donation/DonationForm";
import DonorCard from "../components/donation/DonorCard";
import { BASE_URL, SOCKET_URL } from "../config/url";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  ClockIcon,
  LinkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Comments from "../components/donationComments/Comments";
import Loading from "../components/Loading";
import { BsFacebook, BsLinkedin, BsTwitter, BsWhatsapp } from "react-icons/bs";
import ReactGA from "react-ga4";
import ScrollToTop from "../utils/ScrollToTop";


const getFullUrl = (filePath: string) =>
  filePath?.startsWith('http') ? filePath : `${SOCKET_URL}/${filePath}`;

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [raised, setRaised] = useState(0);
  const [goal, setGoal] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"Hot" | "All">("Hot");
  const [admin, setAdmin] = useState(false);
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const [campaigner, setCampaigner] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    const pathArray = path.split("/");
    if (pathArray.includes("admin")) {
      setAdmin(true);
    } else if (pathArray.includes("user")) {
      setCampaigner(true);
    }
  }, [location]);

  const handleAction = (action: string) => {
    console.log(action);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await axios.put(
          `${BASE_URL}/campaigns/updateStatus/${id}`,
          { status: action },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        ReactGA.event({
          category: "Campaign",
          action: "Status Updated",
          label: action,
        })
        console.log(res);
        setStatus(action);
        toast.success("Campaign status updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update campaign status");
      }
    });
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await axios.get(`${BASE_URL}/campaigns/get/${id}`);
      setCampaign(response.data);
      setRaised(response.data.totalDonations);
      setGoal(response.data.amount);
      const progress =
        (response.data.totalDonations / response.data.amount) * 100;
      setProgress(progress);
      console.log(response.data);

      console.log(response.data.totalDonations);
      setStatus(response.data.status);
    };
    fetchCampaign();
  }, [id]);

  const shareUrl = `${window.location.origin}${location.pathname}`;

  if (!campaign)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-5 justify-between pt-[100px] overflow-x-hidden font-sans">
      <ScrollToTop />
      {/* upper section */}
      <div className="flex justify-between md:flex-row flex-col gap-2 w-full">
        <div className="flex flex-col md:w-[65%]">
          {/* image section */}
          <div className="relative flex items-center border border-b-gray-400 mb-4 gap-2 rounded-xl overflow-hidden">
            <img
              src={campaign?.image}
              alt="arrow-left"
              className="w-full max-h-[500px] object-cover rounded-lg"
            />

            {/* gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-bg to-transparent flex items-end p-4">
              {/* Progress Bar */}
              <div className="w-full pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-[25px] h-[25px] text-secondary" />
                    <p className="text-normal font-bold text-black">
                      {campaign?.city}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-black text-right mb-1">
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
            </div>
          </div>

          {/* basic details section */}
          <div className="flex md:flex-row flex-col md:items-center justify-between gap-2">
            {/* avatar and location section */}

            <div className="flex items-center gap-2 h-[40px]">
              {/* <img
                src={
                  campaign?.userDetails[0].profilePicture
                    ? 
                        campaign?.userDetails[0].profilePicture
                    : "/user.png"
                }
                alt="A"
                className="w-[40px] h-full rounded-md"
              /> */}

              <img
                src={campaign?.userDetails[0]?.profilePicture || "/user.png"}
                alt="User"
                className="w-[40px] h-full rounded-md object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/user.png";
                }}
              />

              <div className="flex flex-col h-full justify-between">
                <p className="text-normal font-bold text-black font-onest">
                  {campaign?.userDetails[0]?.name}
                </p>

                <div className="flex items-center gap-2">
                  <ClockIcon className="w-[15px] h-[15px] text-gray-600" />
                  <p className="text-xs font-bold text-gray-600 font-onest">
                    {dayjs(campaign?.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>

            {/* funds required section */}
            <div className="flex flex-col md:items-center ">
              <p className=" font-bold text-black text-sm font-onest">
                Required Funds
              </p>
              <p className="text-secondary font-bold text-2xl font-onest">
                R{campaign?.amount}
              </p>
            </div>

            {campaign?.organization[0] && (
              <Link
                to={`/home/organization/${campaign?.organization[0]?._id}`}
                className="flex flex-col items-center "
              >
                <img
                  src={getFullUrl(campaign.organization[0].logo)}
                  alt="/"
                  className="w-[25px] h-[25px]"
                />
                <p className="text-xs">{campaign.organization[0].name}</p>
              </Link>
            )}

            {/* donate btn */}

            <button className="bg-secondary flex items-center justify-center text-white px-4 py-1 md:py-2 rounded-full text-sm font-bold h-[50px] shadow-md hover:bg-secondary/80 transition-all duration-300">
              Donate Now
              <ArrowRightIcon className="w-[20px] h-[20px] ml-2" />
            </button>
          </div>

          {/* links section */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-600 font-onest">links: </p>
            <a
              href={campaign?.media}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-secondary hover:bg-secondary hover:text-white p-2 rounded-lg font-bold"
            >
              <LinkIcon className="w-4 h-4" />
            </a>

            <a
              href={campaign?.video}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-secondary hover:bg-secondary hover:text-white p-2 rounded-lg font-bold"
            >
              <LinkIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-gray-600 font-onest">Share: </p>

            {/* WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=Check%20out%20this%20campaign:%20${encodeURIComponent(
                `${campaign?.title} - ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700"
            >
              <BsWhatsapp className="w-6 h-6" />
            </a>

            {/* Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${campaign?.title} - ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <BsFacebook className="w-6 h-6" />
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${campaign?.title} - ${shareUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600"
            >
              <BsTwitter size={20} />
            </a>
          </div>

          {/* campaign details section */}

          <div className="flex flex-col gap-2 py-6">
            {/* title & story section */}
            <div className="flex flex-col">
              <p className="text-sm font-bold text-black py-2 font-onest">
                {campaign?.title}
              </p>
              <p className="text-xs text-gray-600 leading-6">
                {campaign?.story}
              </p>
            </div>

            {/* goal section */}
            <div className="flex flex-col">
              <p className="text-sm font-bold text-black py-2 font-onest">
                Our Challenge & Goal
              </p>
              <p className="text-xs text-gray-600 leading-6">
                {campaign?.goal}
              </p>
            </div>
          </div>
          {admin && (
            <>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Start Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.startDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  End Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.endDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Posted on:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("DD-MM-YYYY")}
                </p>
                <p className="text-sm font-bold text-black py-2 font-onest">
                  at
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("HH:mm")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Status:
                </p>
                <p
                  className={`text-sm font-bold font-onest rounded-full px-2 py-1 ${
                    status === "active"
                      ? "bg-green-500 text-green-950"
                      : status === "cancelled"
                      ? "bg-red-500 text-red-800"
                      : status === "pending"
                      ? "bg-yellow-500 text-yellow-700"
                      : "bg-gray-300 text-gray-800"
                  }`}
                >
                  {status}
                </p>
              </div>
            </>
          )}

          {campaigner && (
            <>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Start Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.startDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  End Date:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.endDate).format("DD-MM-YYYY")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Posted on:
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("DD-MM-YYYY")}
                </p>
                <p className="text-sm font-bold text-black py-2 font-onest">
                  at
                </p>
                <p className="text-sm text-black py-2 font-onest">
                  {dayjs(campaign?.createdAt).format("HH:mm")}
                </p>
              </div>
              <div className="flex gap-2">
                <p className="text-sm font-bold text-black py-2 font-onest">
                  Status:
                </p>
                <p
                  className={`text-sm w-[100px] flex item-center justify-center font-bold py-2 font-onest rounded-full px-2 ${
                    status === "active"
                      ? "bg-green-500 text-green-950"
                      : status === "cancelled"
                      ? "bg-red-500 text-red-800"
                      : status === "pending"
                      ? "bg-yellow-500 text-yellow-700"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  {status}
                </p>
              </div>
            </>
          )}

          {admin && (
            <div className="w-full p-4">
              <p className="text-sm font-bold text-black py-2 font-onest">
                Admin Actions:
              </p>

              <div className="flex  items-center justify-between gap-3">
                {/* Dropdown */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="action"
                    className="text-sm font-medium text-gray-700"
                  >
                    Select Action
                  </label>

                  <select
                    id="action"
                    name="action"
                    onChange={(e) => handleAction(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                  >
                    <option value="">Select Action</option>
                    <option value="active">Approve</option>
                    <option value="cancelled">Reject</option>
                    <option value="inactive">Pause</option>
                  </select>
                </div>

                {/* Edit Button */}
                <Link
                  to={`/admin/campaigns/${id}/edit`}
                  className="bg-secondary text-black px-4 py-2 rounded-full text-sm font-bold h-[40px] shadow-md hover:bg-secondary/80 transition-all duration-300"
                >
                  Edit
                </Link>
              </div>
            </div>
          )}

          {!admin && !campaigner && (
            <DonationForm
              id={id as string}
              campaigner={campaign?.userDetails[0]?._id}
              organizationId={campaign?.organization[0]._id}
              communication={campaign?.donorCommunication}
            />
          )}

          {campaigner && (
            <div className="flex justify-end w-full">
              <Link
                to={`/user/dashboard/campaigns/${id}/edit`}
                className="bg-secondary w-[100px] text-white w-[100px] flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold h-[40px] shadow-md hover:bg-secondary/80 transition-all duration-300"
              >
                Edit
              </Link>
            </div>
          )}




        </div>
                  {/* donors section */}
      <div className="flex flex-col md:w-[35%] w-full">
        <p className="text-sm font-bold text-black py-2 font-onest">
          Donations
        </p>

        <div className="flex flex-col bg-white gap-2 overflow-y-auto max-h-[500px] scrollbar-hide border border-gray-300 rounded-lg p-4">
          {/* filter section */}
          <div className="flex items-center justify-center gap-2 p-2">
            {["Hot", "All"].map((tab) => (
              <p
                key={tab}
                className={`text-sm font-bold w-[100px] flex items-center justify-center cursor-pointer px-4 py-1 rounded-full transition-all duration-300 
        ${
          activeTab === tab
            ? "bg-secondary text-white"
            : "bg-white border border-gray-300 text-gray-600"
        }`}
                onClick={() => setActiveTab(tab as "Hot" | "All")}
              >
                {tab}
              </p>
            ))}
          </div>

          

          {/* donor cards */}
          {(activeTab === "Hot"
            ? [...campaign?.donations]
                .sort((a, b) => b.amount - a.amount) // sort by highest amount
                .slice(0, 6) // top 6
            : campaign?.donations
          ) // all
            .map((donor: any) => (
              <DonorCard key={donor._id} donor={donor} />
            ))}
        </div>
      </div>
      </div>

      

      {/* comments section */}
      {/* <Comments campaignId={id} /> */}

    </div>
  );
};

export default CampaignDetails;
