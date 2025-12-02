import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE ;
console.log(API_BASE);

export const ingestVideo = async (youtubeUrl) => {
  return axios.post(`${API_BASE}/ingest`, { youtube_url: youtubeUrl });
};

export const sendChatMessage = async (videoId, message, history) => {
  return axios.post(`${API_BASE}/chat`, {
    video_id: videoId,
    message,
    history,
  });
};
