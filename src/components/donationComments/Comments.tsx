import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Donor {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface CommentType {
  _id: string;
  donorId: Donor;
  comment: string;
  anonymous: boolean;
  createdAt: string;
}

interface CommentsProps {
  campaignId: string;
}

const Comments: React.FC<CommentsProps> = ({ campaignId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/comments/${campaignId}`);
        const data = res.data?.data || [];
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [campaignId]);

  if (loading && comments.length === 0)
    return <div className="text-center py-4">Loading comments...</div>;

  if (error)
    return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Comments</h1>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((item) => (
            item.comment !== "" && (
            <div
              key={item._id}
              className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg shadow-sm"
            >
              {item.anonymous ? (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              ) : item.donorId?.profilePicture ? (
                <img
                  src={item.donorId.profilePicture}
                  alt={item.donorId.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400" />
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {item.anonymous ? "Anonymous Donor" : item.donorId?.name}
                </p>
                <p className="text-gray-600 mt-1">{item.comment || "No comment provided."}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
