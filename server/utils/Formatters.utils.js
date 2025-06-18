//To display view count in k and M form
function formatNumber(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M ";
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "K ";
    }
    return num.toString();
}

//Converting time stamp 
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    return "just now";
}  

//Convert to ISO duration
function parseDuration(isoDuration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = isoDuration.match(regex);

  const hours = parseInt(match?.[1] || 0, 10);
  const minutes = parseInt(match?.[2] || 0, 10);
  const seconds = parseInt(match?.[3] || 0, 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export {
    formatNumber,
    parseDuration,
    timeAgo,
}