import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calculator,
  Plus,
  LayoutDashboard,
  ArrowRight,
  DollarSign,
  Receipt,
  TrendingDown,
} from "lucide-react";
import { fetchIncomes } from "../services/incomeService";
import { fetchExpenses } from "../services/expenseService";
import { toast } from "sonner";

type DashboardScreenProps = {
  userName?: string;
};

export function DashboardScreen({ userName }: DashboardScreenProps) {
  const navigate = useNavigate();
  const [quarterIncome, setQuarterIncome] = useState(0);
  const [quarterExpenses, setQuarterExpenses] = useState(0);
  const [singleTax, setSingleTax] = useState(0);
  const [socialTax, setSocialTax] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [incomes, expenses] = await Promise.all([fetchIncomes(), fetchExpenses()]);

        const incomeTotal = incomes.reduce((sum, income) => sum + income.amount, 0);
        const expensesTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        setQuarterIncome(incomeTotal);
        setQuarterExpenses(expensesTotal);

        setSingleTax(incomeTotal * 0.05);
        setSocialTax(1474 * 3); // ЄСВ за квартал (3 місяці)
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити фіндані");
      }
    };

    load();
  }, []);

  const totalTax = singleTax + socialTax;

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/60 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-lg md:text-xl">
              Привіт{userName ? `, ${userName}` : ""}!
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Огляд вашої фінансової діяльності
          </p>
        </div>

        {/* Quick Action */}
        <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg text-blue-900 dark:text-blue-100">
                    Швидкі дії
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Додайте новий дохід до системи
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate("/income")}
                size="lg"
                className="gap-2 w-full sm:w-auto"
              >
                Швидко додати дохід
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Income Widget */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/income")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Доходи за квартал</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Загальна сума доходів
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl text-green-600 dark:text-green-400">
                    {quarterIncome.toLocaleString("uk-UA", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-muted-foreground">грн</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/income");
                  }}
                >
                  Детальніше
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Widget */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/expenses")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Витрати за квартал</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Загальна сума витрат
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl text-red-600 dark:text-red-400">
                    {quarterExpenses.toLocaleString("uk-UA", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-muted-foreground">грн</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-between text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/expenses");
                  }}
                >
                  Детальніше
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tax Widget */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/taxes")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Податки за квартал</CardTitle>
                </div>
              </div>
              <CardDescription className="text-sm">
                Сума до сплати
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Єдиний податок (5%):</span>
                    <span>
                      {singleTax.toLocaleString("uk-UA", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      грн
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ЄСВ (за 3 міс):</span>
                    <span>
                      {socialTax.toLocaleString("uk-UA", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      грн
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <span className="text-muted-foreground">Всього:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl text-orange-600 dark:text-orange-400">
                        {totalTax.toLocaleString("uk-UA", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-muted-foreground">грн</span>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/taxes");
                    }}
                  >
                    Розрахувати податки
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-900/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Середній дохід</p>
                  <p className="text-xl text-blue-900 dark:text-blue-100">
                    {(quarterIncome / 3).toLocaleString("uk-UA", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    грн/міс
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-900/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Податкове навантаження</p>
                  <p className="text-xl text-purple-900 dark:text-purple-100">
                    {quarterIncome > 0 
                      ? ((totalTax / quarterIncome) * 100).toFixed(1)
                      : "0.0"}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-900/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Чистий дохід</p>
                  <p className="text-xl text-emerald-900 dark:text-emerald-100">
                    {(quarterIncome - totalTax).toLocaleString("uk-UA", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{" "}
                    грн
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
