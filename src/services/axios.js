import axios from "axios";

const api = axios.create({
  baseURL:
    `${import.meta.env.VITE_API_URL}/api/auth` ||
    `https://blogging-plateform.onrender.com/api/auth` ||
    "http://localhost:3000/api/auth",
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
          `${import.meta.env.VITE_API_URL}/api/auth/refresh-token` ||
            `https://blogging-plateform.onrender.com/api/auth/refresh-token` ||
            "http://localhost:3000/api/auth",
          {},
          { withCredentials: true },
        );

        return api(originalRequest);
      } catch (err) {
        console.log(err);
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
