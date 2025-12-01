import api from "../lib/api";

export type ExpensePayload = {
  amount: number;
  description: string;
  date: string; // ISO date (yyyy-mm-dd)
  category: string;
};

export type Expense = ExpensePayload & {
  id: string;
  user_uid: string;
};

export async function fetchExpenses(): Promise<Expense[]> {
  const { data } = await api.get<Expense[]>("/expenses");
  return data;
}

export async function createExpense(payload: ExpensePayload): Promise<Expense> {
  const { data } = await api.post<Expense>("/expenses", payload);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
