import api from "../lib/api";

export type Rates = {
  USD: number;
  EUR: number;
  UAH: number;
};

export async function fetchRates(): Promise<Rates> {
  const { data } = await api.get<Rates>("/currency/rates");
  return data;
}
