import * as jose from "jose";
import api from "@/api/api";
import { useAuthStore } from "@/stores/authStore";

type LoginResponseData = {
  sessionToken: string;
  tokenExpirationTime: number;
}

export function useAuthService() {
  const authStore = useAuthStore();

  function login(user: Partial<User>): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await api.post<LoginResponseData>("/api/login", JSON.stringify(user));
        const { sessionToken } = response.data;

        authStore.loggedInUser = { ...user, sessionToken };
        authStore.sessionExpiresAt = jose.decodeJwt(sessionToken).exp || null;

        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  function logout(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await api.post("/api/logout");

        authStore.loggedInUser = null;
        authStore.sessionExpiresAt = null;

        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }


  return { login, logout }
}
