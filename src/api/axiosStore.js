import axios from "axios";

const STORE_API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const storeApi = axios.create({
  baseURL: STORE_API_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// No auth token needed — store APIs are public
storeApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("Store API error:", err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default storeApi;
