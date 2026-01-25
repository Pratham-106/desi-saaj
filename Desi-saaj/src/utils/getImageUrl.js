const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const BASE_URL = API.replace("/api", "");

export const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";

  return `${BASE_URL}${path}`;
};
