import api from "../lib/api";

export interface LegalDigestItem {
  id: string;
  date: string;
  title: string;
  topic: string | null;
  importance: "high" | "medium" | "low";
  summary: string;
  source: string;
  url: string;
}

export interface MonthlyDigestResponse {
  year: number;
  month: number;
  count: number;
  items: LegalDigestItem[];
}

export async function fetchMonthlyDigest(year?: number, month?: number): Promise<MonthlyDigestResponse> {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;

  const { data } = await api.get<MonthlyDigestResponse>("/legal/monthly-digest", {
    params,
  });
  return data;
}
