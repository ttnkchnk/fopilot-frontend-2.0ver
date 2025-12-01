import api from "../lib/api";

export type IncomePayload = {
  amount: number;
  description: string;
  date: string; // ISO date (yyyy-mm-dd)
};

export type Income = IncomePayload & {
  id: string;
  user_uid: string;
};

export async function fetchIncomes(): Promise<Income[]> {
  const { data } = await api.get<Income[]>("/income");
  return data;
}

export async function createIncome(payload: IncomePayload): Promise<Income> {
  const { data } = await api.post<Income>("/income", payload);
  return data;
}

export async function deleteIncome(id: string): Promise<void> {
  await api.delete(`/income/${id}`);
}
