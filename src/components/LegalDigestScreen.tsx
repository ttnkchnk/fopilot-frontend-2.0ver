import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { ScrollArea } from "./ui/scroll-area";
import { RefreshCw, Info, ExternalLink } from "lucide-react";
import {
  fetchLegalDigest,
  type PeriodMode,
  type LegalDigestResponse
} from "../services/legalDigestService";
import { toast } from "sonner";
import { Input } from "./ui/input";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

export function LegalDigestScreen() {
  const [periodMode, setPeriodMode] = useState<PeriodMode>("month");
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [quarter, setQuarter] = useState<number>(Math.ceil(currentMonth / 3));
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [digest, setDigest] = useState<LegalDigestResponse | null>(null);
  const [importance, setImportance] = useState<"all" | "high" | "medium" | "low">("all");
  const [topic, setTopic] = useState<string>("");

  const fetchDigest = async (opts?: { force?: boolean }) => {
    try {
      setError(null);
      if (!digest || opts?.force) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const params: Record<string, number | string> = {
        period: periodMode,
        year,
      };
      if (periodMode === "month") params.month = month;
      if (periodMode === "quarter") params.quarter = quarter;
      if (importance && importance !== "all") params.importance = importance;
      if (topic.trim()) params.topic = topic.trim();

      const data = await fetchLegalDigest(params as any);
      setDigest(data);
    } catch (e: any) {
      console.error("Failed to load legal digest", e);
      const detail = e?.response?.data?.detail || "Не вдалося завантажити дайджест змін.";
      setError(detail);
      toast.error(detail);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDigest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodMode, year, month, quarter, importance, topic]);

  const handleRefresh = () => fetchDigest({ force: true });

  const readablePeriod = () => {
    if (periodMode === "year") return `${year} рік`;
    if (periodMode === "quarter") return `${quarter} кв. ${year}`;
    return `${String(month).padStart(2, "0")}.${year}`;
  };

  const impactLabel = (impact?: string | null) => {
    if (!impact) return "Загальна інформація";
    switch (impact) {
      case "high":
        return "Критично для ФОП 3 групи";
      case "medium":
        return "Важливі зміни";
      case "low":
        return "Другорядні зміни";
      default:
        return impact;
    }
  };

  const impactVariant = (impact?: string | null) => {
    switch (impact) {
      case "high":
        return "destructive" as const;
      case "medium":
        return "default" as const;
      case "low":
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-sky-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-8">
          <div className="flex justify-between items-center max-w-4xl mx-auto px-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => window.history.back()}>
              ← Назад
            </Button>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Info className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="w-16" />
          </div>
          <h1 className="text-3xl sm:text-4xl">Дайджест змін законодавства</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Огляд змін для ФОП 3 групи (5%) по податках, ЄСВ та звітності.
          </p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-blue-500/30 bg-white/70 dark:bg-card shadow-lg">
          <CardHeader className="flex flex-col gap-4 px-4 py-4 md:px-6 md:py-5">
            <div className="w-full grid gap-3 md:gap-4 md:grid-cols-4 items-end">
              <Tabs
                value={periodMode}
                onValueChange={(v) => setPeriodMode(v as PeriodMode)}
                className="w-full md:w-auto"
              >
                <TabsList className="w-full md:w-auto justify-start md:justify-center">
                  <TabsTrigger value="month" className="flex-1">
                    Місяць
                  </TabsTrigger>
                  <TabsTrigger value="quarter" className="flex-1">
                    Квартал
                  </TabsTrigger>
                  <TabsTrigger value="year" className="flex-1">
                    Рік
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={String(year)} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue placeholder="Рік" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const y = currentYear - idx;
                    return (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {periodMode === "month" && (
                <Select value={String(month)} onValueChange={(value) => setMonth(Number(value))}>
                  <SelectTrigger className="w-full md:w-[160px]">
                    <SelectValue placeholder="Місяць" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Січень",
                      "Лютий",
                      "Березень",
                      "Квітень",
                      "Травень",
                      "Червень",
                      "Липень",
                      "Серпень",
                      "Вересень",
                      "Жовтень",
                      "Листопад",
                      "Грудень",
                    ].map((label, index) => (
                      <SelectItem key={index + 1} value={String(index + 1)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {periodMode === "quarter" && (
                <Select value={String(quarter)} onValueChange={(value) => setQuarter(Number(value))}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Квартал" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">I квартал</SelectItem>
                    <SelectItem value="2">II квартал</SelectItem>
                    <SelectItem value="3">III квартал</SelectItem>
                    <SelectItem value="4">IV квартал</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={importance} onValueChange={(v) => setImportance(v as any)}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Важливість" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Усі</SelectItem>
                  <SelectItem value="high">Критично</SelectItem>
                  <SelectItem value="medium">Важливі</SelectItem>
                  <SelectItem value="low">Другорядні</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Тема (наприклад, ЄП)"
                className="flex-1 bg-white dark:bg-background border-slate-300 dark:border-slate-700 text-base"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="shrink-0 self-end sm:self-auto"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)]">
          <Card className="flex h-full flex-col border border-[#3be2ff33] bg-white/5 backdrop-blur-xl shadow-[0_0_30px_-12px_rgba(59,226,255,0.6)]">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
              <div>
                <CardTitle className="text-base font-semibold text-white">Зміни за період: {readablePeriod()}</CardTitle>
                {digest?.generated_at && (
                  <p className="mt-1 text-xs text-slate-200/70">
                    Останнє оновлення: {new Date(digest.generated_at).toLocaleString("uk-UA")}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="flex items-center gap-1 border-[#3be2ff66] text-[#3be2ff]">
                <Info className="h-3 w-3" />
                ФОП 3 група (5%)
              </Badge>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden pt-0">
              {loading ? (
                <div className="space-y-3 pt-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="border-muted">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-3/5" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                        <div className="flex gap-2 pt-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button size="sm" onClick={handleRefresh}>
                    Спробувати ще раз
                  </Button>
                </div>
              ) : !digest || digest.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-slate-200/70">
                  <p>За обраний період немає знайдених змін для ФОП 3 групи.</p>
                  <p>Спробуй інший місяць чи квартал.</p>
                </div>
              ) : (
                <ScrollArea className="h-full pr-2">
                  <div className="space-y-3 pb-4">
                    {digest.items.map((item) => (
                      <Card
                        key={item.id}
                        className="border border-[#3be2ff22] bg-white/[0.03] shadow-[0_0_24px_-14px_rgba(59,226,255,0.6)]"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <CardTitle className="text-sm font-semibold leading-snug text-white">{item.title}</CardTitle>
                              {item.law_date && (
                                <p className="mt-1 text-xs text-slate-200/70">
                                  Дата документа / розʼяснення:{" "}
                                  {new Date(item.law_date).toLocaleDateString("uk-UA")}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              {item.tags?.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[11px]">
                                  {tag}
                                </Badge>
                              ))}
                              <Badge variant={impactVariant(item.impact_level)} className="text-[11px]">
                                {impactLabel(item.impact_level)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-100">
                          {(item.summary_short || item.summary) && (
                            <div className="rounded-lg bg-white/[0.04] border border-white/5 p-3">
                              <p className="text-[13px] leading-relaxed text-slate-100/90 line-clamp-4">
                                {item.summary_short || item.summary}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-xs text-slate-200/70">
                              Джерело: {item.source || "Автоматичний моніторинг"}
                            </span>

                            {item.source_url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-[#3be2ff] hover:text-white hover:bg-[#3be2ff]/20"
                                asChild
                              >
                                <a href={item.source_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-1 h-3 w-3" />
                                  Відкрити першоджерело
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          <Card className="h-full border border-[#3be2ff33] bg-white/5 backdrop-blur-xl shadow-[0_0_30px_-12px_rgba(59,226,255,0.6)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-white">Як читати цей дайджест</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-200/80">
              <div className="space-y-1.5">
                <p className="font-medium text-white">Що вже робить FOPilot:</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Раз на добу тягне новини з податкових джерел.</li>
                  <li>Фільтрує зміни, що стосуються ФОП 3 групи.</li>
                  <li>Узагальнює їх у короткі, людською мовою написані пояснення.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Що означають бейджі важливості:</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    <span className="font-semibold">Критично</span> – зміни ставок, лімітів, строків сплати або
                    звітності.
                  </li>
                  <li>
                    <span className="font-semibold">Важливі</span> – нові вимоги, уточнення правил, ризики втрати
                    статусу єдинника.
                  </li>
                  <li>
                    <span className="font-semibold">Другорядні</span> – нюанси заповнення, розʼяснення без прямих
                    фінансових наслідків.
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <p className="font-medium text-foreground">Персоналізація для твого акаунта:</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Фокус тільки на ФОП 3 групи (5%) – без зайвого шуму по іншим групам.</li>
                  <li>LLM враховує групу / статус ПДВ з онбордингу (можна розширити логіку пізніше).</li>
                </ul>
              </div>

              <div className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed">
                У майбутньому тут можна буде:
                <ul className="mt-1 list-disc space-y-1 pl-4">
                  <li>Зберігати важливі зміни в «Закладки» в акаунті користувача.</li>
                  <li>Генерувати персональний чекліст дій після змін.</li>
                  <li>Ставити запит у чаті: “Поясни, як на мене впливають зміни за {readablePeriod()}”.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
