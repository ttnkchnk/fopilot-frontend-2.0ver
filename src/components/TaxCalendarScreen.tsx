import { useState } from "react";
import { Calendar as CalendarIcon, AlertCircle, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface TaxEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: "deadline" | "payment" | "report";
  urgency: "high" | "medium" | "low";
}

const generateTaxEvents = (year: number): TaxEvent[] => {
  const events: TaxEvent[] = [];

  // Щомісячний ЄСВ до 20 числа наступного місяця
  for (let month = 0; month < 12; month++) {
    events.push({
      id: `esv-${year}-${month}`,
      date: new Date(year, month, 20),
      title: `Сплата ЄСВ за ${new Date(year, month, 1).toLocaleString("uk-UA", { month: "long" })}`,
      description: "Оплата єдиного соціального внеску до 20 числа",
      type: "payment",
      urgency: "medium",
    });
  }

  // Поквартально: декларація до 10 числа та ЄП до 20 числа після кварталу
  const quarters = [
    { endMonth: 2, label: "I квартал" },
    { endMonth: 5, label: "II квартал" },
    { endMonth: 8, label: "III квартал" },
    { endMonth: 11, label: "IV квартал" },
  ];

  quarters.forEach((q) => {
    events.push({
      id: `decl-${year}-${q.endMonth}`,
      date: new Date(year, q.endMonth + 1, 10), // наступний місяць після кварталу
      title: `Подання декларації за ${q.label}`,
      description: "Подання податкової декларації ФОП",
      type: "deadline",
      urgency: "high",
    });
    events.push({
      id: `tax-${year}-${q.endMonth}`,
      date: new Date(year, q.endMonth + 1, 20),
      title: `Сплата ЄП за ${q.label}`,
      description: "Оплата єдиного податку до 20 числа",
      type: "payment",
      urgency: "high",
    });
  });

  return events;
};

export function TaxCalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const events = generateTaxEvents(currentDate.getFullYear());
  const nextEvent = (() => {
    const today = new Date();
    return events.filter((e) => e.date >= today).sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  })();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const previousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800";
      case "low":
        return "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getDayUrgency = (date: Date) => {
    const events = getEventsForDate(date);
    if (events.length === 0) return null;
    if (events.some((e) => e.urgency === "high")) return "high";
    if (events.some((e) => e.urgency === "medium")) return "medium";
    return "low";
  };

  const monthNames = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1>Податковий календар</h1>
          <p className="text-muted-foreground">
            Важливі дати сплати податків та подання звітності
          </p>
        </div>

        {/* AI Insight */}
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900 dark:text-blue-100">AI Підказка</AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            {nextEvent ? (
              <>
                Наступний дедлайн: {nextEvent.title} — {nextEvent.date.toLocaleDateString("uk-UA")}.{" "}
                Залишилось {Math.max(1, Math.ceil((nextEvent.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} днів.
              </>
            ) : (
              "Всі події за поточний рік виконані."
            )}
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[currentMonth]} {currentYear}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: adjustedFirstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const date = new Date(currentYear, currentMonth, day);
                  const events = getEventsForDate(date);
                  const urgency = getDayUrgency(date);

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={`aspect-square rounded-lg border-2 p-1 hover:border-blue-500 transition-colors relative ${
                        isToday(date)
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                          : urgency
                          ? getUrgencyColor(urgency)
                          : "border-transparent hover:bg-accent"
                      }`}
                    >
                      <div className="text-sm">
                        {day}
                      </div>
                      {events.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                          {events.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                event.urgency === "high"
                                  ? "bg-red-500"
                                  : event.urgency === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Найближчі події</CardTitle>
              <CardDescription>Важливі дати та дедлайни</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingEvents().map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-2 ${getUrgencyColor(event.urgency)}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm">
                      {event.title}
                    </p>
                    <Badge
                      variant={
                        event.urgency === "high"
                          ? "destructive"
                          : event.urgency === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="shrink-0"
                    >
                      {event.urgency === "high"
                        ? "Терміново"
                        : event.urgency === "medium"
                        ? "Скоро"
                        : "Запланов."}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="w-3 h-3" />
                    {event.date.toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Позначення</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm">Терміновий дедлайн</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span className="text-sm">Найближчий дедлайн</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm">Запланована подія</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
