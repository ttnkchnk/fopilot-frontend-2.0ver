import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../services/authToken";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1",
});

// Интерсептор: перед каждым запросом подставляем Authorization, если есть токен
api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshIdToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    const token = await auth.currentUser.getIdToken(true);
    setAccessToken(token);
    return token;
  } catch (err) {
    console.error("Не вдалося оновити Firebase ID token", err);
    clearAccessToken();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config || {};

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      refreshPromise = refreshPromise ?? refreshIdToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
