import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://zap-shift-server-pi-amber.vercel.app",
});

const useAxiosSecure = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      // console.log("Inside res interceptor", error.status);
      const status = error.status;
      if (status === 403) {
        return navigate("/forbidden");
      } else if (status === 401) {
        logout()
          .then(() => {
            navigate("/login");
          })
          .catch((err) => console.log(err));
      }
      return Promise.reject(error);
    },
  );
  return axiosSecure;
};

export default useAxiosSecure;
