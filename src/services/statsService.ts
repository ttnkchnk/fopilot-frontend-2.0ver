import api from "../lib/api";

export type UserStats = {
  chat_questions: number;
  calculations: number;
  days_in_system: number;
};

export async function fetchStats(): Promise<UserStats> {
  // FastAPI редиректит на слеш, поэтому сразу обращаемся к /stats/
  const { data } = await api.get<UserStats>("/stats/");
  return data;
}
