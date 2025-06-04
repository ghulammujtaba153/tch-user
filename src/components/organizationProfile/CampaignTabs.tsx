import React, { useEffect, useState } from "react"
import { BASE_URL } from "../../config/url"
import { toast } from "react-toastify"
import axios from "axios"
import Loading from "../Loading"
import CampaignCard from "../Campaigns/CampaignCard"

interface Campaign {
  _id: string
  title: string
  description: string
  image: string
  category: string
  amount: number
  city: string
  status: string
  createdAt: string
  isFavourite: boolean
  totalDonations: number
  lastDonationDate: string
}

interface Props {
  organizationId: string
}

const CampaignTabs: React.FC<Props> = ({ organizationId }) => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active")
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/campaigns/organization/${organizationId}`)
      setCampaigns(res.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  if (loading) {
    return <Loading />
  }

  const filteredCampaigns = campaigns.filter(
    (campaign) => campaign.status === activeTab
  )

  return (
    <div>
      <div className="flex gap-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-2 border-b-2 ${
            activeTab === "active" ? "border-blue-600 font-semibold" : "border-transparent"
          }`}
        >
          Open Campaigns
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2 border-b-2 ${
            activeTab === "completed" ? "border-blue-600 font-semibold" : "border-transparent"
          }`}
        >
          Closed Campaigns
        </button>
      </div>

      {filteredCampaigns.length === 0 ? (
        <p className="text-gray-500">No {activeTab} campaigns found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CampaignTabs
