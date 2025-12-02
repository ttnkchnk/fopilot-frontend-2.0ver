import { useEffect, useState } from "react";
import api from "../lib/api";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  deadline: string;
  daysLeft: number;
}

export function useNotifications() {
  const [next, setNext] = useState<NotificationItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const year = now.getFullYear();
        const { data } = await api.get("/calendar", { params: { year } });

        const today = new Date();
        const list: NotificationItem[] = [];

        const add = (raw: any, label: string) => {
          const deadline = new Date(raw.deadline);
          const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) return;
          list.push({
            id: `${label}-${raw.deadline}`,
            title: label,
            message: `Через ${diffDays} дн. строк: ${label}`,
            deadline: raw.deadline,
            daysLeft: diffDays,
          });
        };

        data.ep?.forEach((item: any) => add(item, `ЄП за ${item.period}`));
        data.esv?.forEach((item: any) => add(item, `ЄСВ за ${item.quarter}-й квартал`));
        data.declaration?.forEach((item: any) => add(item, `Декларація за ${item.quarter}-й квартал`));

        list.sort((a, b) => a.daysLeft - b.daysLeft);
        setNext(list[0] || null);
      } catch (error) {
        console.error("Не вдалося отримати календар", error);
        setNext(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { next, loading };
}
