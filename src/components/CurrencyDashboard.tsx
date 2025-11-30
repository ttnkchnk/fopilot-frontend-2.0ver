import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Euro, ArrowUpRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ExchangeRate {
  currency: string;
  rate: number;
  change: number;
  trend: number[];
}

interface SaleRecord {
  id: string;
  date: string;
  amountUSD: number;
  rate: number;
  amountUAH: number;
  client: string;
}

const exchangeRates: ExchangeRate[] = [
  {
    currency: "USD",
    rate: 41.25,
    change: 2.5,
    trend: [39.8, 40.1, 40.3, 40.6, 40.9, 41.1, 41.25]
  },
  {
    currency: "EUR",
    rate: 44.80,
    change: 1.8,
    trend: [43.2, 43.6, 44.0, 44.2, 44.5, 44.7, 44.80]
  }
];

const salesHistory: SaleRecord[] = [
  {
    id: "1",
    date: "2025-11-28",
    amountUSD: 2500,
    rate: 41.25,
    amountUAH: 103125,
    client: "TechCorp Inc."
  },
  {
    id: "2",
    date: "2025-11-25",
    amountUSD: 1800,
    rate: 41.10,
    amountUAH: 73980,
    client: "DesignStudio LLC"
  },
  {
    id: "3",
    date: "2025-11-22",
    amountUSD: 3200,
    rate: 40.95,
    amountUAH: 131040,
    client: "StartupHub"
  },
  {
    id: "4",
    date: "2025-11-18",
    amountUSD: 1500,
    rate: 40.80,
    amountUAH: 61200,
    client: "WebAgency"
  },
  {
    id: "5",
    date: "2025-11-15",
    amountUSD: 2100,
    rate: 40.65,
    amountUAH: 85365,
    client: "CloudServices"
  }
];

// Mock chart data for the last 30 days
const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  usd: 39.5 + Math.random() * 2,
  eur: 43.0 + Math.random() * 2
}));

export function CurrencyDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR">("USD");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdate(new Date());
  };

  const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-cyan-50/70 via-blue-50/50 to-sky-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-card rounded-lg border p-4 md:p-6">
          <div>
            <h1 className="mb-2 text-2xl sm:text-3xl">Валютний дашборд</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Актуальні курси та історія продажів валюти
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Оновлено</p>
              <p className="text-sm">
                {lastUpdate.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Exchange Rate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exchangeRates.map((rate) => {
            const isPositive = rate.change >= 0;
            return (
              <Card
                key={rate.currency}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => setSelectedCurrency(rate.currency as "USD" | "EUR")}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        {rate.currency === "USD" ? (
                          <DollarSign className="w-6 h-6 text-white" />
                        ) : (
                          <Euro className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-white text-base">{rate.currency}/UAH</CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                          Офіційний курс НБУ
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`gap-1 ${
                        isPositive
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isPositive ? "+" : ""}{rate.change}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-white">
                        {rate.rate.toFixed(2)}
                      </span>
                      <span className="text-slate-400 mb-2">₴</span>
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-2">
                      <Sparkline data={rate.trend} color={isPositive ? "#10b981" : "#ef4444"} />
                    </div>
                    <p className="text-xs text-slate-500">Тренд за останні 7 днів</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Chart */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl">Історія курсу</CardTitle>
                <CardDescription className="text-slate-400">
                  Динаміка за останні 30 днів
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedCurrency === "USD" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCurrency("USD")}
                  className={
                    selectedCurrency === "USD"
                      ? ""
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  }
                >
                  USD/UAH
                </Button>
                <Button
                  variant={selectedCurrency === "EUR" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCurrency("EUR")}
                  className={
                    selectedCurrency === "EUR"
                      ? ""
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  }
                >
                  EUR/UAH
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64 bg-slate-900 rounded-lg p-4 flex items-end gap-1">
              {chartData.map((data, index) => {
                const value = selectedCurrency === "USD" ? data.usd : data.eur;
                const maxValue = Math.max(
                  ...chartData.map((d) => (selectedCurrency === "USD" ? d.usd : d.eur))
                );
                const height = (value / maxValue) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-sm hover:opacity-80 transition-opacity cursor-pointer relative group"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-950 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {value.toFixed(2)} ₴
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>30 днів тому</span>
              <span>Сьогодні</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl">Останні продажі валюти</CardTitle>
                <CardDescription className="text-slate-400">
                  Історія конвертації доходів в гривні
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 w-full sm:w-auto">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Переглянути все
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-700/50">
                    <TableHead className="text-slate-400">Дата</TableHead>
                    <TableHead className="text-slate-400">Клієнт</TableHead>
                    <TableHead className="text-slate-400 text-right">USD</TableHead>
                    <TableHead className="text-slate-400 text-right">Курс</TableHead>
                    <TableHead className="text-slate-400 text-right">UAH</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesHistory.map((sale) => (
                    <TableRow
                      key={sale.id}
                      className="border-slate-700 hover:bg-slate-700/50 cursor-pointer"
                    >
                      <TableCell className="text-slate-300 text-sm">
                        {new Date(sale.date).toLocaleDateString('uk-UA')}
                      </TableCell>
                      <TableCell className="text-white text-sm">{sale.client}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-400 font-medium">
                          ${sale.amountUSD.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-slate-300 text-sm">
                        {sale.rate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-white font-medium">
                          {sale.amountUAH.toLocaleString()} ₴
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Всього продано</p>
                <p className="text-lg sm:text-xl text-white font-medium">
                  ${salesHistory.reduce((sum, s) => sum + s.amountUSD, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Отримано UAH</p>
                <p className="text-lg sm:text-xl text-green-400 font-medium">
                  {salesHistory.reduce((sum, s) => sum + s.amountUAH, 0).toLocaleString()} ₴
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs text-slate-400 mb-1">Середній курс</p>
                <p className="text-lg sm:text-xl text-white font-medium">
                  {(
                    salesHistory.reduce((sum, s) => sum + s.rate, 0) / salesHistory.length
                  ).toFixed(2)} ₴
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}