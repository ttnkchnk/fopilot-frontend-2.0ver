import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, TrendingDown, Trash2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem("fopilot-expenses");
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      // Default sample data
      const defaultExpenses = [
        {
          id: "1",
          date: "2024-11-03",
          description: "Оренда офісу",
          amount: 3000,
          category: "Оренда",
        },
        {
          id: "2",
          date: "2024-11-07",
          description: "Канцтовари",
          amount: 500,
          category: "Матеріали",
        },
        {
          id: "3",
          date: "2024-11-12",
          description: "Інтернет",
          amount: 300,
          category: "Комунальні послуги",
        },
      ];
      setExpenses(defaultExpenses);
      localStorage.setItem("fopilot-expenses", JSON.stringify(defaultExpenses));
    }
  }, []);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const handleAddExpense = () => {
    if (!amount || !description || !date || !category) {
      toast.error("Заповніть всі поля");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Введіть коректну суму");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      date,
      description,
      amount: numAmount,
      category,
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem("fopilot-expenses", JSON.stringify(updatedExpenses));
    setAmount("");
    setDescription("");
    setDate("");
    setCategory("");
    toast.success("Витрату успішно додано");
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem("fopilot-expenses", JSON.stringify(updatedExpenses));
    toast.success("Витрату видалено");
  };

  const totalQuarter = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-50/70 via-gray-50/50 to-blue-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-red-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-lg md:text-xl">Облік витрат</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Відстежуйте свої витрати та контролюйте бюджет
          </p>
        </div>

        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Додати витрату</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Заповніть форму для додавання нової витрати
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Сума (грн)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Дата</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категорія</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Оренда, Матеріали, Послуги..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Опис</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Деталі витрати"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddExpense} className="w-full md:w-auto gap-2">
                <Plus className="w-4 h-4" />
                Додати витрату
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Історія витрат</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Перегляд всіх зареєстрованих витрат
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Категорія</TableHead>
                    <TableHead>Опис</TableHead>
                    <TableHead className="text-right">Сума</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
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
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>{expense.description}</TableCell>
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
    </div>
  );
}