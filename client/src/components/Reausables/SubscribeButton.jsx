import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../../config';
import { useNavigate } from "react-router-dom";

const SubscribeButton = ({ channelId }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {  

    const checkSubscriptionStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/subscribe/check/${channelId}`,
          { withCredentials: true }
        );
        setSubscribed(res.data.subscribed);
      } catch (error) { 
          console.error("Failed to check subscription:", error); 
      }
    };

    checkSubscriptionStatus();
  }, [channelId]);
 
  const handleClick = async () => {
    setLoading(true);

    try {
      if (subscribed) { 
        await axios.delete(`${API_URL}/subscribe/${channelId}`, {
          withCredentials: true,
        });
        setSubscribed(false);
      } else { 
        await axios.post(`${API_URL}/subscribe/${channelId}`, {}, {
          withCredentials: true,
        });
        setSubscribed(true);
      }
    } catch (error) {
      if(error?.response?.status === 401){
        navigate('/login');
      } else {
        console.error("Subscription action failed:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-5 py-3 rounded-full font-semibold transition ${
        subscribed ? "bg-gray-600 text-white" : "bg-gray-200 text-black hover:bg-gray-400"
      }`}
    >
      {loading
        ? "Processing..."
        : subscribed
        ? "Subscribed"
        : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
