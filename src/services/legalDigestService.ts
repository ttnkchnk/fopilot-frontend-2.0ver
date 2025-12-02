import api from "../lib/api";

export type PeriodMode = "month" | "quarter" | "year";

export type LegalDigestItem = {
  id: string;
  title: string;
  summary: string;
  summary_short?: string | null;
  law_date?: string | null;
  source?: string | null;
  source_url?: string | null;
  tags?: string[];
  impact_level?: "low" | "medium" | "high" | string | null;
};

export type LegalDigestResponse = {
  period: string;
  scope: string;
  generated_at: string;
  items: LegalDigestItem[];
};

export async function fetchLegalDigest(params: {
  period: PeriodMode;
  year: number;
  month?: number;
  quarter?: number;
  importance?: "high" | "medium" | "low";
  topic?: string;
}): Promise<LegalDigestResponse> {
  const { data } = await api.get<LegalDigestResponse>("/legal/digests", {
    params,
  });
  return data;
}
