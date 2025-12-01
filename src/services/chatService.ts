import api from "../lib/api";

export type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
};

export async function fetchChatHistory(): Promise<ChatMessage[]> {
  const { data } = await api.get<ChatMessage[]>("/chat/history");
  return data;
}

export async function sendChatMessage(message: string): Promise<{ reply: string }> {
  const { data } = await api.post<{ reply: string }>("/chat", { message });
  return data;
}
