import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, TrendingUp, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { createIncome, deleteIncome, fetchIncomes, type Income } from "../services/incomeService";

export function IncomeScreen() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchIncomes();
        // Firestore дати можуть приходити як строки — приводим к ISO
        setIncomes(
          data.map((income) => ({
            ...income,
            date: typeof income.date === "string" ? income.date : new Date(income.date as unknown as string).toISOString(),
          }))
        );
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити доходи");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalQuarter = incomes.reduce((sum, income) => sum + income.amount, 0);

  const handleDeleteIncome = async (id: string) => {
    try {
      await deleteIncome(id);
      setIncomes((prev) => prev.filter((income) => income.id !== id));
      toast.success("Дохід видалено");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося видалити дохід");
    }
  };

  const handleSaveIncome = async (payload: { amount: number; date: string; description: string; client?: string | null }) => {
    try {
      const created = await createIncome({
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
      });
      setIncomes((prev) => [created, ...prev]);
      toast.success("Дохід успішно додано");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося зберегти дохід");
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-sky-50/70 via-blue-50/50 to-indigo-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-green-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-lg md:text-xl">Облік доходів</h1>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                Відстежуйте свої доходи та ведіть облік
              </p>
            </div>
            <Button 
              onClick={() => setShowTransactionDialog(true)} 
              size="lg"
              className="w-full sm:w-auto shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Нова транзакція
            </Button>
          </div>
        </div>

        {/* Income Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Історія доходів</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Перегляд всіх зареєстрованих доходів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Опис</TableHead>
                    <TableHead className="text-right">Сума</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Завантаження...
                      </TableCell>
                    </TableRow>
                  ) : incomes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Немає доданих доходів
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomes.map((income) => (
                      <TableRow key={income.id}>
                        <TableCell>
                          {new Date(income.date).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>{income.description}</TableCell>
                        <TableCell className="text-right">
                          {income.amount.toLocaleString("uk-UA", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          грн
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteIncome(income.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="text-muted-foreground">Всього за квартал:</span>
              <span className="text-xl md:text-2xl text-blue-600 dark:text-blue-400">
                {totalQuarter.toLocaleString("uk-UA", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                грн
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog 
        open={showTransactionDialog} 
        onOpenChange={setShowTransactionDialog} 
        mode="income"
        onSave={handleSaveIncome}
      />
    </div>
  );
}
