import { useState } from "react";
import { Plus, Sparkles, Trash2, Send, Download, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useNavigate } from "react-router-dom";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export function InvoiceScreen() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<"draft" | "sent">("draft");

  // Contractor details
  const [contractorName, setContractorName] = useState("");
  const [contractorCode, setContractorCode] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");

  // Client details
  const [clientName, setClientName] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Line items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      price: 0,
      total: 0
    }
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updated.total = updated.quantity * updated.price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const generateWithAI = (itemId: string) => {
    // Simulate AI generation
    updateItem(itemId, "description", "Послуги з розробки веб-додатку");
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = subtotal;

  const navigate = useNavigate();

  return (
    <div className="h-full overflow-auto bg-slate-50 dark:bg-background">
      <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl">Рахунок на оплату</h1>
              <Badge variant={status === "draft" ? "secondary" : "default"}>
                {status === "draft" ? "Чернетка" : "Відправлено"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">Створення рахунку для клієнта</p>
          </div>
          <div className="flex gap-2 self-start">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Invoice Paper */}
        <Card className="bg-white dark:bg-card shadow-lg">
          <CardHeader className="border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">Номер рахунку</Label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full sm:w-40"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">Дата</Label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full sm:w-40"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Contractor and Client Details */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Contractor */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm sm:text-base">Постачальник</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs sm:text-sm">ПІБ / Назва</Label>
                    <Input
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      placeholder="ФОП Іваненко Іван Іванович"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Код ЄДРПОУ/ІПН</Label>
                    <Input
                      value={contractorCode}
                      onChange={(e) => setContractorCode(e.target.value)}
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Адреса</Label>
                    <Textarea
                      value={contractorAddress}
                      onChange={(e) => setContractorAddress(e.target.value)}
                      placeholder="м. Київ, вул. Хрещатик, 1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Client */}
              <div className="space-y-3">
                <h3 className="text-muted-foreground text-sm sm:text-base">Покупець</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs sm:text-sm">ПІБ / Назва</Label>
                    <Input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="ТОВ «Компанія»"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Код ЄДРПОУ/ІПН</Label>
                    <Input
                      value={clientCode}
                      onChange={(e) => setClientCode(e.target.value)}
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Адреса</Label>
                    <Textarea
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="м. Львів, вул. Свободи, 10"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-3">
              <h3 className="text-muted-foreground text-sm sm:text-base">Товари та послуги</h3>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Опис</TableHead>
                      <TableHead className="w-20 sm:w-24">Кільк.</TableHead>
                      <TableHead className="w-24 sm:w-32">Ціна</TableHead>
                      <TableHead className="w-24 sm:w-32">Сума</TableHead>
                      <TableHead className="w-12 sm:w-20"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                updateItem(item.id, "description", e.target.value)
                              }
                              placeholder="Опис товару/послуги"
                              className="text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => generateWithAI(item.id)}
                              title="Згенерувати з AI"
                              className="shrink-0"
                            >
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", parseFloat(e.target.value))
                            }
                            className="text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", parseFloat(e.target.value))
                            }
                            className="text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="text-right text-sm">
                            {item.total.toFixed(2)} грн
                          </div>
                        </TableCell>
                        <TableCell>
                          {items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Додати позицію
              </Button>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Підсумок:</span>
                  <span>{subtotal.toFixed(2)} грн</span>
                </div>
                <div className="flex justify-between pt-2 border-t text-sm sm:text-base">
                  <span className="text-muted-foreground">Разом до сплати:</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span></span>
                  <span className="text-blue-600">{totalAmount.toFixed(2)} грн</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button variant="outline" className="w-full sm:w-auto">Зберегти чернетку</Button>
          <Button onClick={() => setStatus("sent")} className="w-full sm:w-auto">
            <Send className="w-4 h-4 mr-2" />
            Відправити клієнту
          </Button>
        </div>
      </div>
    </div>
  );
}