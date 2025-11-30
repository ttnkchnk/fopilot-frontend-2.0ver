import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Calculator } from "lucide-react";

export function TaxesScreen() {
  const [income, setIncome] = useState("");
  const [result, setResult] = useState<{
    singleTax: number;
    esv: number;
    total: number;
  } | null>(null);

  const handleCalculate = () => {
    const incomeAmount = parseFloat(income);
    if (isNaN(incomeAmount) || incomeAmount <= 0) {
      return;
    }

    // Розрахунок для ФОП 3 група (загальна система)
    // Єдиний податок 5% від доходу
    const singleTax = incomeAmount * 0.05;
    
    // ЄСВ - мінімальний розмір (для прикладу використаємо 1474 грн на 2024)
    // В реальності це може бути 22% від мінімальної зарплати
    const minWage = 7100; // мінімальна зарплата 2024
    const esv = minWage * 0.22;
    
    const total = singleTax + esv;

    setResult({
      singleTax: Math.round(singleTax * 100) / 100,
      esv: Math.round(esv * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  };

  const handlePayment = () => {
    // Тут буде логіка оплати
    alert("Функція оплати буде доступна незабаром!");
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
              Введіть суму доходу за квартал для розрахунку
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income">Введіть суму доходу за квартал</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="income"
                  type="number"
                  placeholder="0.00"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCalculate} className="gap-2 w-full sm:w-auto">
                  <Calculator className="w-4 h-4" />
                  Розрахувати
                </Button>
              </div>
            </div>

            {result && (
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

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-blue-600 text-white rounded-lg">
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
    </div>
  );
}