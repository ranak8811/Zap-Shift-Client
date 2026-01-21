import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://zap-shift-server-pi-amber.vercel.app",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
