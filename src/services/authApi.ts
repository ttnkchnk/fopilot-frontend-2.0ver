import { signInWithEmailAndPassword } from "firebase/auth";
import api from "../lib/api";
import { auth } from "../lib/firebase";
import { setAccessToken, clearAccessToken, getAccessToken } from "./authToken";
import { fetchCurrentUser, type User } from "./userService";

export type AuthResponse = {
  token: string;
  user: User;
};

/**
 * Регистрация на бэке (создаёт пользователя в Firebase Admin + Firestore)
 * После успешной регистрации сразу логинимся через Firebase client, получаем idToken и профиль.
 */
export async function registerWithEmail(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
}): Promise<AuthResponse> {
  await api.post("/auth/register", payload);

  // логинимся на клиенте, чтобы получить Firebase ID token
  const credentials = await signInWithEmailAndPassword(auth, payload.email, payload.password);
  const token = await credentials.user.getIdToken();
  setAccessToken(token);

  const user = await fetchCurrentUser();
  return { token, user };
}

/**
 * Логин через Firebase email/password. Бэку отправляемся только после получения idToken.
 */
export async function loginWithEmail(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const credentials = await signInWithEmailAndPassword(auth, payload.email, payload.password);
  const token = await credentials.user.getIdToken();
  setAccessToken(token);

  const user = await fetchCurrentUser();
  return { token, user };
}

/**
 * Логин через Google: фронт делает Firebase popup, передаём профиль на бэк для upsert,
 * сохраняем idToken и возвращаем профиль.
 */
export async function loginWithGoogleBackend(payload: {
  id_token: string;
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
}): Promise<AuthResponse> {
  // Создаём/обновляем профиль на бэке
  await api.post("/auth/google", {
    uid: payload.uid,
    email: payload.email,
    first_name: payload.first_name,
    last_name: payload.last_name,
    phone: payload.phone,
  });

  setAccessToken(payload.id_token);

  const user = await fetchCurrentUser();
  return { token: payload.id_token, user };
}

export function logoutBackend() {
  clearAccessToken();
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
