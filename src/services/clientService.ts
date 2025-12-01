import api from "../lib/api";

export type ClientPayload = {
  name: string;
  country?: string;
  email?: string;
  phone?: string;
  iban?: string;
  notes?: string;
};

export type Client = ClientPayload & {
  id: string;
};

export async function fetchClients(): Promise<Client[]> {
  const { data } = await api.get<Client[]>("/clients");
  return data;
}

export async function createClient(payload: ClientPayload): Promise<Client> {
  const { data } = await api.post<Client>("/clients", payload);
  return data;
}
