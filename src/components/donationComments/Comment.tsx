import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { 
  ChatBubbleOvalLeftIcon, 
  HandThumbDownIcon, 
  HeartIcon, 
  ShareIcon, 
  UserCircleIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { AuthContext } from '../../context/userContext';
import Notification from '../notification/Notification';

dayjs.extend(relativeTime);





const Comment = ({ comment }) => {
  const { user } = useContext(AuthContext);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [dislikeCount, setDisLikeCount] = useState(comment.dislikeCount);
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.likes.includes(user?.userId));
  const [isDisliked, setIsDisliked] = useState(comment.dislikes.includes(user?.userId));
  const [error, setError] = useState(null);


  console.log("comment", comment)
  console.log("comment likes count", comment.likes.includes(user?.userId))

  const handleLike = async () => {
    if(!user){
      setError("Please login to like the comment");
      return;
    }
    try {
      const res = await axios.put(`${BASE_URL}/comments/${comment._id}/like`, {
        userId: user?.userId
      });
  
      const data = res.data.data;
  
      setLikeCount(data.likeCount);
      setDisLikeCount(data.dislikeCount);
      setIsLiked(data.isLiked);
      setIsDisliked(data.isDisliked);
      
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };
  

  const handleDislike = async () => {
    if(!user){
      setError("Please login");
      return;
    }
    try {
      
      const res = await axios.put(`${BASE_URL}/comments/${comment._id}/dislike`, {
        userId: user?.userId
      });
  
      const data = res.data.data;
  
      setLikeCount(data.likeCount);
      setDisLikeCount(data.dislikeCount);
      setIsLiked(data.isLiked);
      setIsDisliked(data.isDisliked);
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };
  

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if(!user){
      setError("Please login");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/comments/${comment._id}/replies`, {
        text: replyText,
        userId: user?.userId
      });
      const data = res.data.data;

      console.log('Reply posted:', data);
      console.log('Comment replies:', replies);
      setReplies(prev => [data, ...prev]);
      setReplyText('');
      setIsReplying(false);

      // setReplies(prev => [...prev, data]);
      
      
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  useEffect(() => {
    const fetchReplies = async ()=>{
      try {
        const res = await axios.get(`${BASE_URL}/comments/${comment._id}/replies`);
        const data = res.data.data;
        console.log("replies", data)
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    }

    fetchReplies()
  }, [comment._id])

  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      setLoadingReplies(true);
      try {
        const { data } = await axios.get(`${BASE_URL}/comments/${comment._id}/replies`);
        setReplies(data);
      } catch (error) {
        console.error('Error fetching replies:', error);
      } finally {
        setLoadingReplies(false);
      }
    }
    setShowReplies(!showReplies);
  };

  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      
      {error && <Notification isOpen={true} onClose={() => { setError("") }} title="Error" message={error} type="error" />}

      <div className="flex space-x-3">
        {comment.senderId?.profilePicture ? (
          <img 
            src={comment.senderId.profilePicture? comment.senderId.profilePicture : <UserCircleIcon className="w-10 h-10 text-gray-400" />} 
            alt={comment.senderId.name} 
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
        )}
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-800">{comment.senderId.name}</h3>
            <span className="text-xs text-gray-500">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>
          
          <p className="mt-1 text-gray-700">{comment.text}</p>
          
          <div className="mt-2 flex items-center space-x-4 text-gray-500">
            <button onClick={handleLike} className={`flex items-center space-x-1 ${isLiked ? 'text-blue-600' : 'hover:text-blue-600'} hover:text-blue-600`}>
              <HeartIcon className="h-5 w-5" />
              <span>{likeCount}</span>
              
            </button>
            
            <button onClick={handleDislike} className={`flex items-center space-x-1 ${isDisliked ? 'text-red-600' : 'hover:text-red-600'} hover:text-red-600`}>
              <HandThumbDownIcon className="h-5 w-5" />
              <span>{dislikeCount}</span>
            </button>
            
            <button 
              onClick={toggleReplies}
              className="flex items-center space-x-1 hover:text-gray-600"
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span>Reply ({replies.length})</span>
            </button>
            
            {/* <button className="flex items-center space-x-1 hover:text-gray-600">
              <ShareIcon className="h-5 w-5" />
              <span>Share</span>
            </button> */}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3 flex items-start space-x-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button 
                type="submit"
                className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary transition"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          )}

          {/* Toggle reply form button */}
          {!isReplying && (
            <button 
              onClick={() => setIsReplying(true)}
              className="mt-2 text-sm text-secondary hover:text-secondary"
            >
              + Add Reply
            </button>
          )}

          {/* Replies Section */}
          {showReplies && (
            <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
              {loadingReplies ? (
                <div className="text-center py-2">Loading replies...</div>
              ) : replies.length > 0 ? (
                replies.map((reply) => (
                  <Comment 
                    key={reply._id} 
                    comment={reply} 
                    
                  />
                ))
              ) : (
                <div className="text-gray-500 text-sm">No replies yet</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;