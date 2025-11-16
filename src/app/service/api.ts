// service/api.service.ts
import axios from "axios";
import { TokenService } from "./token.service";
const url = process.env.NEXT_PUBLIC_API_BASE_URL
const api = axios.create({
  baseURL: "https://nexlearn.noviindusdemosites.in",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = TokenService.getRefreshToken();
      if (!refreshToken) {
        TokenService.clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          "https://nexlearn.noviindusdemosites.in/auth/refresh-token",
          { refresh_token: refreshToken }
        );
        TokenService.setAccessToken(res.data.access_token);
        original.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(original);
      } catch (err) {
        TokenService.clearTokens();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
