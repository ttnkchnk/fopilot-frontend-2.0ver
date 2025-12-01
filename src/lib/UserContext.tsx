import { createContext, useContext } from "react";
import type { UserProfile } from "../services/userService";

type UserContextState = {
  profile: UserProfile | null;
  refreshProfile: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
};

export const UserContext = createContext<UserContextState | undefined>(undefined);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserContext.Provider");
  }
  return ctx;
}
