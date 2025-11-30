import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { AddTransactionDialog } from "./AddTransactionDialog";

interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export function IncomeScreen() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);

  useEffect(() => {
    // Load incomes from localStorage
    const storedIncomes = localStorage.getItem("fopilot-incomes");
    if (storedIncomes) {
      setIncomes(JSON.parse(storedIncomes));
    } else {
      // Default sample data
      const defaultIncomes = [
        {
          id: "1",
          date: "2024-11-01",
          description: "Консультація з податкового обліку",
          amount: 5000,
        },
        {
          id: "2",
          date: "2024-11-05",
          description: "Розробка веб-сайту",
          amount: 15000,
        },
        {
          id: "3",
          date: "2024-11-10",
          description: "Послуги дизайну",
          amount: 8000,
        },
      ];
      setIncomes(defaultIncomes);
      localStorage.setItem("fopilot-incomes", JSON.stringify(defaultIncomes));
    }
  }, []);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleAddIncome = () => {
    if (!amount || !description || !date) {
      toast.error("Заповніть всі поля");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Введіть коректну суму");
      return;
    }

    const newIncome: Income = {
      id: Date.now().toString(),
      date,
      description,
      amount: numAmount,
    };

    const updatedIncomes = [newIncome, ...incomes];
    setIncomes(updatedIncomes);
    localStorage.setItem("fopilot-incomes", JSON.stringify(updatedIncomes));
    setAmount("");
    setDescription("");
    setDate("");
    toast.success("Дохід успішно додано");
  };

  const totalQuarter = incomes.reduce((sum, income) => sum + income.amount, 0);

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

        {/* Add Income Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Додати дохід</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Заповніть форму для додавання нового доходу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="description">Опис</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="Назва послуги або товару"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddIncome} className="w-full md:w-auto gap-2">
                <Plus className="w-4 h-4" />
                Додати дохід
              </Button>
            </div>
          </CardContent>
        </Card>

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.length === 0 ? (
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
      />
    </div>
  );
}