import React, { useContext, useEffect, useState } from 'react';
import Comment from './Comment';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { AuthContext } from '../../context/userContext';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import Notification from '../notification/Notification';

interface CommentType {
  _id: string;
  campaignId: string;
  senderId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  text: string;
  likes: string[];
  dislikes: string[];
  replies: string[];
  createdAt: string;
}

interface CommentsProps {
  campaignId: string;
}

const Comments: React.FC<CommentsProps> = ({ campaignId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {user} = useContext(AuthContext);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/comments/${campaignId}`);
        console.log(res.data)
        const data=res.data.data

        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error fetching comments:', err);
        setComments([]); // Ensure comments is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [campaignId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if(!user){
      setError('Please login to add a comment')
      return
    }

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/comments`, { 
        senderId: user?.userId,
        campaignId,
        text: newComment 
      });
      const data = res.data.data;
      
      setComments(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

 

  if (loading && comments.length === 0) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Comments</h1>

      {error && <Notification isOpen={true} onClose={() => { setError("") }} title="Error" message={error} type="error" />}
      
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex items-start space-x-3">
        {user?.profilePicture ? (
          <img 
            src={user.profilePicture} 
            alt="User" 
            className="w-10 h-10 rounded-full" 
          />
        ) : (
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
        )}

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              disabled={loading}
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary transition disabled:opacity-50"
              disabled={loading || !newComment.trim()}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
      
      <div className="space-y-4">
        {Array.isArray(comments) && comments.map((comment) => (
          <Comment 
            key={comment._id} 
            comment={comment}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;