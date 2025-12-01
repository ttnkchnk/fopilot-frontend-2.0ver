import api from "../lib/api";

export interface User {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone?: string | null;
  fop_group?: number;
  tax_rate?: number;
  onboarding_completed?: boolean;
  onboarding_data?: Record<string, unknown> | null;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function updateCurrentUser(payload: {
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  phone?: string | null;
}): Promise<User> {
  const { data } = await api.put("/auth/me", payload);
  return data;
}

export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  middleName?: string;
  taxId: string;
  email: string;
  phone: string;
  taxGroup: string;
  paysESV: boolean;
  selectedKveds: string[];
}

export async function completeOnboarding(payload: OnboardingPayload): Promise<User> {
  const { data } = await api.post("/auth/onboarding", payload);
  return data;
}
