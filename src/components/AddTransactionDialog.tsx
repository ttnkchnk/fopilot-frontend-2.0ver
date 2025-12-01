import { useState } from "react";
import { Check, DollarSign, TrendingUp, RefreshCw, HelpCircle, Calendar as CalendarIcon, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "income" | "expense";
  onSave: (payload: {
    amount: number;
    date: string;
    description: string;
    category?: string;
    client?: string | null;
  }) => Promise<void> | void;
}

type TransactionType = "income-uah" | "income-foreign" | "exchange" | "expense" | null;

export function AddTransactionDialog({ open, onOpenChange, mode, onSave }: AddTransactionDialogProps) {
  const [selectedType, setSelectedType] = useState<TransactionType>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [client, setClient] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleReset = () => {
    setSelectedType(null);
    setAmount("");
    setDate(undefined);
    setDescription("");
    setCategory("");
    setClient(null);
  };

  const handleSubmit = async () => {
    if (!amount || !date) {
      return;
    }
    setSaving(true);
    try {
      await onSave({
        amount: parseFloat(amount),
        date: date.toISOString().slice(0, 10),
        description: description || "Транзакція",
        category: mode === "expense" ? category || "Загальна" : undefined,
        client: client,
      });
      handleReset();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const getCurrencySymbol = () => {
    if (selectedType === "income-uah") return "₴";
    if (selectedType === "income-foreign") return "$";
    if (selectedType === "exchange") return "$";
    if (selectedType === "expense") return "₴";
    return "₴";
  };

  const transactionTypes = mode === "income"
    ? [
        {
          id: "income-uah" as TransactionType,
          title: "Дохід (UAH)",
          description: "Надходження в гривнях",
          icon: TrendingUp,
          color: "from-green-500 to-green-600",
        },
        {
          id: "income-foreign" as TransactionType,
          title: "Дохід (Валюта)",
          description: "Надходження в USD/EUR",
          icon: DollarSign,
          color: "from-blue-500 to-blue-600",
        },
        {
          id: "exchange" as TransactionType,
          title: "Обмін валюти",
          description: "Конвертація валюти",
          icon: RefreshCw,
          color: "from-purple-500 to-purple-600",
        },
      ]
    : [
        {
          id: "expense" as TransactionType,
          title: "Витрата",
          description: "Операційні витрати",
          icon: RefreshCw,
          color: "from-red-500 to-red-600",
        },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0 shadow-2xl rounded-xl">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">Додати нову транзакцію</DialogTitle>
          <DialogDescription>
            Оберіть тип транзакції та заповніть деталі операції
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Step 1: Transaction Type Selection */}
          <div className="space-y-3">
            <Label className="text-base">Крок 1: Тип транзакції</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {transactionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className={`font-medium ${isSelected ? "text-blue-600" : ""}`}>
                          {type.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Dynamic Form */}
          {selectedType && (
            <div className="space-y-5 pt-4 border-t animate-in fade-in duration-300">
              <Label className="text-base">Крок 2: Деталі транзакції</Label>

              {/* Amount Input */}
              <div className="space-y-2">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="amount">Сума</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Вкажіть повну суму транзакції</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-muted-foreground">
                    {getCurrencySymbol()}
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 h-14 text-xl border-2 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="date">Дата операції</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Дата коли відбулася транзакція</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd MMMM yyyy", { locale: uk }) : "Оберіть дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Опис</Label>
                <Input
                  id="description"
                  placeholder={mode === "income" ? "Напр., Оплата за послуги" : "Напр., Оренда офісу"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Category for expenses */}
              {mode === "expense" && (
                <div className="space-y-2">
                  <Label htmlFor="category">Категорія</Label>
                  <Input
                    id="category"
                    placeholder="Оренда, Матеріали, Послуги..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              )}

              {/* Optional client */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="client">Клієнт / Контрагент (необовʼязково)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm">
                        Необов’язкове поле. Вкажіть клієнта, якщо працюєте за контрактами чи інвойсами (IT, консалтинг, B2B). Якщо ви працюєте з готівкою або не ведете облік клієнтів — залиште порожнім.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-3">
                  <UserRound className="w-4 h-4 text-muted-foreground" />
                  <Input
                    id="client"
                    placeholder="Оберіть клієнта (необов'язково) або залиште порожнім"
                    value={client || ""}
                    onChange={(e) => setClient(e.target.value || null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button className="w-full" onClick={handleSubmit} disabled={saving || !selectedType}>
            {saving ? "Збереження..." : "Зберегти транзакцію"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
