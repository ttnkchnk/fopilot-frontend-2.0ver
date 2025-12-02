import { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Euro, ArrowUpRight, RefreshCw, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { fetchRates, type Rates } from "../services/currencyService";
import { toast } from "sonner";

type RatePoint = { day: number; rate: number; date: string };

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

const buildHistory = (current: number, days: number, seedShift = 0): RatePoint[] => {
  const out: RatePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const drift = Math.sin((i + seedShift) / 6) * 0.35;
    const noise = (Math.random() - 0.5) * 0.18;
    const rate = +(current * (1 + drift / 100) + noise).toFixed(3);
    const dayNum = days - i;
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ day: dayNum, rate, date: d.toISOString().slice(0, 10) });
  }
  return out;
};

export function CurrencyDashboard() {
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR">("USD");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [rates, setRates] = useState<Rates | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [history, setHistory] = useState<{ USD: RatePoint[]; EUR: RatePoint[] }>({
    USD: buildHistory(41.25, 90),
    EUR: buildHistory(44.8, 90, 3),
  });
  const [hoverPoint, setHoverPoint] = useState<RatePoint | null>(null);

  const exchangeRates: ExchangeRate[] = [
    {
      currency: "USD",
      rate: rates?.USD ?? history.USD.at(-1)?.rate ?? 41.25,
      change: (() => {
        const series = history.USD.slice(-7).map((p) => p.rate);
        const start = series.at(0) ?? 1;
        const end = series.at(-1) ?? start;
        return +(((end - start) / start) * 100).toFixed(2);
      })(),
      trend: history.USD.slice(-7).map((p) => p.rate),
    },
    {
      currency: "EUR",
      rate: rates?.EUR ?? history.EUR.at(-1)?.rate ?? 44.8,
      change: (() => {
        const series = history.EUR.slice(-7).map((p) => p.rate);
        const start = series.at(0) ?? 1;
        const end = series.at(-1) ?? start;
        return +(((end - start) / start) * 100).toFixed(2);
      })(),
      trend: history.EUR.slice(-7).map((p) => p.rate),
    },
  ];

  const loadRates = async () => {
    setLoadingRates(true);
    try {
      const data = await fetchRates(); // з Monobank (бекенд вже тягне)
      setRates(data);
      setLastUpdate(new Date());
      setHistory({
        USD: buildHistory(data.USD, 90),
        EUR: buildHistory(data.EUR, 90, 4),
      });
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося отримати курси валют");
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleRefresh = () => {
    loadRates();
  };

  // Скидаємо hover при зміні валюти або діапазону, щоб графік оновлювався одразу
  useEffect(() => {
    setHoverPoint(null);
  }, [selectedCurrency, range]);

  // для мобільних: якщо немає наведення — показуємо останню точку історії
  const activePoint = hoverPoint ?? (history[selectedCurrency]?.slice(-1)[0] ?? null);

  const historyForCurrency = useMemo(() => {
    const all = selectedCurrency === "USD" ? history.USD : history.EUR;
    if (range === "7d") return all.slice(-7);
    if (range === "30d") return all.slice(-30);
    return all.slice(-90);
  }, [range, selectedCurrency, history]);

  const historyRates = historyForCurrency.map((d) => d.rate);
  const avg30 = useMemo(() => {
    const arr = history[selectedCurrency].slice(-30).map((d) => d.rate);
    if (!arr.length) return 0;
    return arr.reduce((s, n) => s + n, 0) / arr.length;
  }, [selectedCurrency, history]);
  const minRate = historyRates.length ? Math.min(...historyRates) : 0;
  const maxRate = historyRates.length ? Math.max(...historyRates) : 0;
  const avgRate = historyRates.length
    ? historyRates.reduce((s, n) => s + n, 0) / historyRates.length
    : 0;

  const currentRate =
    selectedCurrency === "USD"
      ? rates?.USD ?? history.USD.at(-1)?.rate ?? 41.25
      : rates?.EUR ?? history.EUR.at(-1)?.rate ?? 44.8;
  const diff = currentRate - avg30;
  const diffPct = avg30 ? (diff / avg30) * 100 : 0;
  const change7dPct = (() => {
    const series = historyRates.slice(-7);
    if (series.length < 2) return 0;
    const start = series[0];
    const end = series[series.length - 1];
    return ((end - start) / start) * 100;
  })();

  let recommendationLabel = "Нейтрально";
  let recommendationTone: "good" | "neutral" | "bad" = "neutral";
  if (diffPct > 1.5) {
    recommendationLabel = "Добре продавати";
    recommendationTone = "good";
  } else if (diffPct < -1.5) {
    recommendationLabel = "Краще почекати";
    recommendationTone = "bad";
  }

  const Sparkline = ({
    data,
    color,
    className = "w-full h-8",
    onHover,
    onLeave,
    showArea = false,
  }: {
    data: number[];
    color: string;
    className?: string;
    onHover?: (idx: number) => void;
    onLeave?: () => void;
    showArea?: boolean;
  }) => {
    if (!data.length) {
      return <div className={className} />;
    }

    const max = Math.max(...data.map((n) => (Number.isFinite(n) ? n : 0)));
    const min = Math.min(...data.map((n) => (Number.isFinite(n) ? n : 0)));
    const range = max - min || 1;
    const lastY = 100 - ((data[data.length - 1] - min) / range) * 100;

    const points = data
      .map((value, index) => {
        const x = data.length === 1 ? 100 : (index / (data.length - 1)) * 100;
        const y = isFinite(range) && Number.isFinite(value)
          ? 100 - ((value - min) / range) * 100
          : lastY;
        return `${x},${y}`;
      })
      .join(" ");

    const gradientId = `sparkline-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}`;

    const handlePointer = (clientX: number, target: SVGSVGElement) => {
      if (!onHover) return;
      const rect = target.getBoundingClientRect();
      const relX = clientX - rect.left;
      const ratio = rect.width ? relX / rect.width : 0;
      const idx = Math.min(data.length - 1, Math.max(0, Math.round(ratio * (data.length - 1))));
      onHover(idx);
    };

    return (
      <svg
        viewBox="0 0 100 100"
        className={className}
        preserveAspectRatio="none"
        onMouseMove={(e) => handlePointer(e.clientX, e.currentTarget)}
        onTouchStart={(e) => handlePointer(e.touches[0].clientX, e.currentTarget)}
        onTouchMove={(e) => handlePointer(e.touches[0].clientX, e.currentTarget)}
        onMouseLeave={() => onLeave?.()}
        onTouchEnd={() => onLeave?.()}
      >
        {showArea && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        )}
        {showArea && (
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#${gradientId})`}
            stroke="none"
          />
        )}
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
              Курс Monobank та рекомендації, чи варто продавати валюту зараз
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
              <RefreshCw className={`w-4 h-4 ${loadingRates ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Exchange Rate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exchangeRates.map((rate) => {
            const isPositive = rate.change >= 0;
            const avg30Local =
              history[rate.currency as "USD" | "EUR"]
                .slice(-30)
                .reduce((s, d) => s + d.rate, 0) /
              (history[rate.currency as "USD" | "EUR"]?.slice(-30).length || 1);
            const diffLocal = rate.rate - avg30Local;
            const diffPctLocal = avg30Local ? (diffLocal / avg30Local) * 100 : 0;
            let badgeLabel = "Нейтрально";
            let badgeTone: "good" | "neutral" | "bad" = "neutral";
            if (diffPctLocal > 1.5) {
              badgeLabel = "Добре продавати";
              badgeTone = "good";
            } else if (diffPctLocal < -1.5) {
              badgeLabel = "Краще почекати";
              badgeTone = "bad";
            }
            return (
              <Card
                key={rate.currency}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                onClick={() => setSelectedCurrency(rate.currency as "USD" | "EUR")}
                onTouchStart={() => setSelectedCurrency(rate.currency as "USD" | "EUR")}
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
                          Курс Monobank
                        </CardDescription>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <span>{rate.change >= 0 ? "↑" : "↓"}</span>
                          <span className={rate.change >= 0 ? "text-green-400" : "text-red-400"}>
                            {rate.change.toFixed(2)}%
                          </span>
                          <span className="text-slate-500">за 7 днів</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          badgeTone === "good"
                            ? "default"
                            : badgeTone === "bad"
                            ? "destructive"
                            : "secondary"
                        }
                        className="gap-1"
                      >
                        {badgeTone === "good" ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : badgeTone === "bad" ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : null}
                        {badgeLabel}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <HelpCircle className="w-3 h-3" />
                        <span>Рекомендація vs середній курс за 30 днів</span>
                      </div>
                    </div>
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
                    <div className="bg-slate-900/70 rounded-lg p-2">
                      <Sparkline data={rate.trend} color={isPositive ? "#22d3ee" : "#ef4444"} />
                    </div>
                    <p className="text-[11px] text-slate-400">Міні-графік курсу за 7 днів</p>
                    <div className="text-xs text-slate-300 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span>Оновлено:</span>
                        <span>{lastUpdate.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Зміна за 7 днів:</span>
                        <span>{rate.change.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Середній за 30 днів:</span>
                        <span>{avg30Local.toFixed(2)} ₴</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {diffPctLocal > 1.5
                          ? "Курс вище середнього за 30 днів → продавати вигідніше, ніж зазвичай."
                          : diffPctLocal < -1.5
                          ? "Курс нижче середнього → краще зачекати з продажем."
                          : "Курс близько до середнього → можна не поспішати з продажем."}
                      </div>
                    </div>
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
                <CardTitle className="text-white text-base sm:text-lg">
                  Історія курсу {selectedCurrency}/UAH
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs sm:text-sm">
                  Допомагає обрати кращий момент для продажу валюти.
                </CardDescription>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug">
                  {diffPct > 1.5
                    ? "Курс вище середнього за місяць → найкращий час продати валюту."
                    : diffPct < -1.5
                    ? "Курс нижче середнього за місяць → зазвичай вигідніше купувати."
                    : "Курс близько до середнього за місяць → можна спостерігати."}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-3 text-xs text-slate-300">
                  <span>Мін: {minRate.toFixed(2)} ₴</span>
                  <span>Макс: {maxRate.toFixed(2)} ₴</span>
                  <span>Середній: {avgRate.toFixed(2)} ₴</span>
                </div>
                <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
                  <TabsList className="bg-slate-900/80 border border-slate-700">
                    <TabsTrigger value="7d">7 днів</TabsTrigger>
                    <TabsTrigger value="30d">30 днів</TabsTrigger>
                    <TabsTrigger value="90d">90 днів</TabsTrigger>
                  </TabsList>
                </Tabs>
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
            <div className="bg-slate-900 rounded-lg px-3 py-4 sm:px-4 sm:py-5">
              <div className="relative h-44 sm:h-56 overflow-hidden">
                <Sparkline
                  data={historyForCurrency.map((p) => p.rate)}
                  color="#22c55e"
                  className="w-full h-full"
                  showArea={true}
                  onHover={(idx) => setHoverPoint(historyForCurrency[idx] ?? null)}
                  onLeave={() => setHoverPoint(null)}
                />
                {activePoint && (
                  <div className="absolute top-2 left-2 bg-slate-800/90 border border-slate-700 rounded-md px-3 py-2 text-xs text-slate-100 shadow-lg">
                    <div className="font-medium">{activePoint.date}</div>
                    <div className="text-slate-300">{activePoint.rate.toFixed(2)} ₴</div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-700 pt-3">
                <span>
                  Показано курс {selectedCurrency}/UAH за{" "}
                  {range === "7d" ? "останній тиждень" : range === "30d" ? "останні 30 днів" : "останні 90 днів"}.
                  Наведи на лінію, щоб побачити курс конкретного дня.
                </span>
                <span className="whitespace-nowrap">
                  Від {historyForCurrency[0]?.date.slice(5) ?? "—"} до{" "}
                  {historyForCurrency.at(-1)?.date.slice(5) ?? "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl">Останні продажі валюти в моєму ФОПі</CardTitle>
                <CardDescription className="text-slate-400">
                  Як я конвертував валюту останніми днями та за яким курсом.
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
                    <TableHead className="text-slate-400 text-right">Валюта / сума</TableHead>
                    <TableHead className="text-slate-400 text-right">Курс</TableHead>
                    <TableHead className="text-slate-400 text-right">Отримано</TableHead>
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
