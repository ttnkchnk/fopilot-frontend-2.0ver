import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, TrendingDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createExpense, deleteExpense, fetchExpenses, type Expense } from "../services/expenseService";
import { AddTransactionDialog } from "./AddTransactionDialog";

export function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchExpenses();
        setExpenses(
          data.map((expense) => ({
            ...expense,
            date: typeof expense.date === "string" ? expense.date : new Date(expense.date as unknown as string).toISOString(),
          }))
        );
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити витрати");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Витрату видалено");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося видалити витрату");
    }
  };

  const handleSaveExpense = async (payload: { amount: number; date: string; description: string; category?: string; client?: string | null }) => {
    try {
      const created = await createExpense({
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
        category: payload.category || "Загальна",
      });
      setExpenses((prev) => [created, ...prev]);
      toast.success("Витрату успішно додано");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося зберегти витрату");
    }
  };

  const totalQuarter = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50/70 via-gray-50/50 to-blue-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-red-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl">Облік витрат</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Відстежуйте свої витрати та контролюйте бюджет
              </p>
            </div>
          </div>
          <div className="flex justify-start">
            <Button 
              onClick={() => setShowDialog(true)} 
              size="lg"
              className="w-full sm:w-auto shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Нова транзакція
            </Button>
          </div>
        </div>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Історія витрат</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Перегляд всіх зареєстрованих витрат
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile / tablet cards */}
            <div className="lg:hidden space-y-3">
              {loading ? (
                <div className="p-4 rounded-lg border text-center text-muted-foreground">Завантаження...</div>
              ) : expenses.length === 0 ? (
                <div className="p-4 rounded-lg border text-center text-muted-foreground">Немає доданих витрат</div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="p-4 rounded-lg border space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Дата</span>
                      <span className="font-medium text-foreground">
                        {new Date(expense.date).toLocaleDateString("uk-UA", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Категорія</span>
                      <span className="font-medium text-foreground text-right">{expense.category}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Опис:</span>{" "}
                      <span className="font-medium break-words">{expense.description}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Сума</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {expense.amount.toLocaleString("uk-UA", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        грн
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block rounded-md border overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead className="w-[160px]">Категорія</TableHead>
                    <TableHead className="w-[260px]">Опис</TableHead>
                    <TableHead className="text-right">Сума</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Завантаження...
                      </TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Немає доданих витрат
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="whitespace-normal break-words">{expense.category}</TableCell>
                        <TableCell className="whitespace-normal break-words">{expense.description}</TableCell>
                        <TableCell className="text-right">
                          {expense.amount.toLocaleString("uk-UA", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          грн
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
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
              <span className="text-xl md:text-2xl text-red-600 dark:text-red-400">
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
      <AddTransactionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode="expense"
        onSave={handleSaveExpense}
      />
    </div>
  );
}
