import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from '../../../config';

const SubscribeButton = ({ channelId }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👇 Check if the user is already subscribed
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

  // 👇 Handle subscribe/unsubscribe toggle
  const handleClick = async () => {
    setLoading(true);

    try {
      if (subscribed) { 
        await axios.delete(`${API_URL}/subscribe/${channelId}`, {
          withCredentials: true,
        });
        setSubscribed(false);
      } else {
        // ✅ Subscribe (POST)
        await axios.post(`${API_URL}/subscribe/${channelId}`, {}, {
          withCredentials: true,
        });
        setSubscribed(true);
      }
    } catch (error) {
      console.error("Subscription action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded font-semibold text-white transition ${
        subscribed ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"
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
