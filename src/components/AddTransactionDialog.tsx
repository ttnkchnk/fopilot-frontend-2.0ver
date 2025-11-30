import { useState } from "react";
import { Check, DollarSign, TrendingUp, RefreshCw, HelpCircle, Calendar as CalendarIcon, Building2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TransactionType = "income-uah" | "income-foreign" | "exchange" | null;

interface Client {
  id: string;
  name: string;
  logo: string;
  country: string;
}

const clients: Client[] = [
  { id: "1", name: "TechCorp Inc.", logo: "", country: "🇺🇸" },
  { id: "2", name: "DesignStudio GmbH", logo: "", country: "🇩🇪" },
  { id: "3", name: "StartupHub Ltd", logo: "", country: "🇬🇧" },
  { id: "4", name: "WebAgency SARL", logo: "", country: "🇫🇷" },
  { id: "5", name: "CloudServices BV", logo: "", country: "🇳🇱" }
];

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [selectedType, setSelectedType] = useState<TransactionType>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>();
  const [selectedClient, setSelectedClient] = useState("");

  const handleReset = () => {
    setSelectedType(null);
    setAmount("");
    setDate(undefined);
    setSelectedClient("");
  };

  const handleSubmit = () => {
    // Logic to save transaction
    console.log({
      type: selectedType,
      amount,
      date,
      client: selectedClient
    });
    handleReset();
    onOpenChange(false);
  };

  const getCurrencySymbol = () => {
    if (selectedType === "income-uah") return "₴";
    if (selectedType === "income-foreign") return "$";
    if (selectedType === "exchange") return "$";
    return "₴";
  };

  const transactionTypes = [
    {
      id: "income-uah" as TransactionType,
      title: "Дохід (UAH)",
      description: "Надходження в гривнях",
      icon: TrendingUp,
      color: "from-green-500 to-green-600"
    },
    {
      id: "income-foreign" as TransactionType,
      title: "Дохід (Валюта)",
      description: "Надходження в USD/EUR",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "exchange" as TransactionType,
      title: "Обмін валюти",
      description: "Конвертація валюти",
      icon: RefreshCw,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 shadow-2xl rounded-xl">
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
                      id="date"
                      variant="outline"
                      className={`w-full h-12 justify-start text-left border-2 hover:border-blue-500 ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5" />
                      {date ? format(date, "d MMMM yyyy", { locale: uk }) : "Оберіть дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={uk}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Client/Counterparty Dropdown */}
              <div className="space-y-2">
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="client">Клієнт / Контрагент</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Виберіть клієнта або контрагента транзакції</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>

                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger id="client" className="h-12 border-2">
                    <SelectValue placeholder="Оберіть клієнта">
                      {selectedClient && (
                        <div className="flex items-center gap-3">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={clients.find(c => c.id === selectedClient)?.logo} />
                            <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                              {clients.find(c => c.id === selectedClient)?.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{clients.find(c => c.id === selectedClient)?.country}</span>
                            {clients.find(c => c.id === selectedClient)?.name}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-3 py-1">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={client.logo} />
                            <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                              {client.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex items-center gap-2">
                            <span className="text-lg">{client.country}</span>
                            {client.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Fields Based on Type */}
              {selectedType === "exchange" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Продано</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Курс обміну</Label>
                    <Input
                      type="number"
                      placeholder="41.25"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl border-t">
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
              className="flex-1 sm:flex-none"
            >
              Скасувати
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedType || !amount || !date || !selectedClient}
              className="flex-1 sm:flex-none shadow-lg"
              size="lg"
            >
              Додати транзакцію
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
