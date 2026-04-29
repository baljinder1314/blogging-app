import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URI,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (err) {
        console.log(err)
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
