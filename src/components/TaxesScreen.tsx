import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calculator } from "lucide-react";
import { fetchIncomes } from "../services/incomeService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function TaxesScreen() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [result, setResult] = useState<{
    singleTax: number;
    esv: number;
    total: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    setLoadingData(true);
    setResult(null);

    try {
      const incomes = await fetchIncomes();
      const incomeAmount = incomes.reduce((sum, item) => sum + item.amount, 0);
      setIncomeTotal(incomeAmount);

      // Имитируем "AI" расчёт: показываем загрузку и возвращаем авто-расчёт
      setTimeout(() => {
        const singleTax = incomeAmount * 0.05; // 5% ФОП 3 група
        const minWage = 7100; // мінімальна зарплата 2024
        const esv = minWage * 0.22; // 22% ЄСВ
        const total = singleTax + esv;

        setResult({
          singleTax: Math.round(singleTax * 100) / 100,
          esv: Math.round(esv * 100) / 100,
          total: Math.round(total * 100) / 100,
        });
        setIsCalculating(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося завантажити дані для розрахунку");
      setIsCalculating(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayment = () => {
    setShowPaymentDialog(true);
  };

  const handleMonobankRedirect = () => {
    // Лінк на оплату через Monobank (можна підставити реальний deep-link/інвойс)
    window.open("https://www.monobank.ua/", "_blank", "noopener");
    setShowPaymentDialog(false);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-slate-50/50 to-blue-100/40 dark:from-gray-900 dark:via-gray-950 dark:to-orange-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-lg md:text-xl">Розрахунок податків</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Розрахуйте суму податків для ФОП третьої групи
          </p>
        </div>

        {/* Calculator Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Калькулятор податків</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Автоматичний розрахунок на основі ваших доходів. ШІ сам підставляє суму.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Дохід за квартал (авто):</Label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  readOnly
                  value={loadingData ? "Завантаження..." : incomeTotal.toLocaleString("uk-UA", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  className="flex-1 font-semibold"
                />
                <Button onClick={handleCalculate} className="gap-2 w-full sm:w-auto" variant="secondary">
                  <Calculator className="w-4 h-4" />
                  Перерахувати
                </Button>
              </div>
            </div>

            {isCalculating && (
              <div className="mt-4 p-4 rounded-lg border bg-muted/30 flex items-center gap-3 text-sm">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
                ШІ аналізує ваші дані та прораховує податки…
              </div>
            )}

            {result && !isCalculating && (
              <div className="mt-6 space-y-4 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-muted-foreground text-sm md:text-base">Єдиний податок (ЄП):</span>
                    <span className="font-medium">{result.singleTax.toLocaleString("uk-UA")} грн</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-muted-foreground text-sm md:text-base">Єдиний соціальний внесок (ЄСВ):</span>
                    <span className="font-medium">{result.esv.toLocaleString("uk-UA")} грн</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-white/5 border border-[#3be2ff33] text-white rounded-lg backdrop-blur shadow-[0_0_30px_-12px_rgba(59,226,255,0.6)]">
                    <span className="text-base md:text-lg">Всього до сплати:</span>
                    <span className="text-xl md:text-2xl font-bold">{result.total.toLocaleString("uk-UA")} грн</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePayment} 
                  className="w-full h-11 md:h-12"
                  size="lg"
                >
                  Оплатити
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <h3 className="mb-2 text-blue-900 dark:text-blue-100">Інформація</h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200" style={{ fontSize: "0.875rem" }}>
              <li>• Розрахунок виконано для ФОП третьої групи (загальна система оподаткування)</li>
              <li>• Ставка єдиного податку: 5% від доходу</li>
              <li>• ЄСВ розраховується як 22% від мінімальної заробітної плати</li>
              <li>• Податки сплачуються щоквартально</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Payment dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Оплата через Monobank</DialogTitle>
            <DialogDescription>
              Перейти на сайт monobank для оплати розрахованої суми податків.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>Ви будете перенаправлені на сторінку monobank у новій вкладці.</p>
            {result && (
              <div className="p-3 rounded-md bg-slate-100 dark:bg-slate-800 flex justify-between">
                <span className="text-muted-foreground">Сума до сплати:</span>
                <span className="font-semibold">{result.total.toLocaleString("uk-UA")} грн</span>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Скасувати
            </Button>
            <Button onClick={handleMonobankRedirect}>Оплатити через Monobank</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
