import { useState } from "react";
import { Plus, Search, Building2, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface Client {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  iban: string;
  contractStatus: "active" | "expired" | "pending";
  totalBilled: number;
  lastInvoiceDate: string;
  lastInvoiceAmount: number;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "TechCorp Inc.",
    country: "США",
    countryFlag: "🇺🇸",
    logo: "",
    email: "contact@techcorp.com",
    phone: "+1 555 0123",
    address: "123 Tech Street, San Francisco, CA 94102, USA",
    iban: "US12 3456 7890 1234 5678 90",
    contractStatus: "active",
    totalBilled: 125000,
    lastInvoiceDate: "2025-11-25",
    lastInvoiceAmount: 2500
  },
  {
    id: "2",
    name: "DesignStudio GmbH",
    country: "Німеччина",
    countryFlag: "🇩🇪",
    logo: "",
    email: "hello@designstudio.de",
    phone: "+49 30 12345678",
    address: "Berliner Str. 45, 10115 Berlin, Germany",
    iban: "DE89 3704 0044 0532 0130 00",
    contractStatus: "active",
    totalBilled: 89000,
    lastInvoiceDate: "2025-11-28",
    lastInvoiceAmount: 1800
  },
  {
    id: "3",
    name: "StartupHub Ltd",
    country: "Великобританія",
    countryFlag: "🇬🇧",
    logo: "",
    email: "info@startuphub.co.uk",
    phone: "+44 20 7946 0958",
    address: "10 Downing Street, London SW1A 2AA, UK",
    iban: "GB29 NWBK 6016 1331 9268 19",
    contractStatus: "expired",
    totalBilled: 56000,
    lastInvoiceDate: "2025-10-15",
    lastInvoiceAmount: 3200
  },
  {
    id: "4",
    name: "WebAgency SARL",
    country: "Франція",
    countryFlag: "🇫🇷",
    logo: "",
    email: "contact@webagency.fr",
    phone: "+33 1 42 86 82 00",
    address: "15 Rue de la Paix, 75002 Paris, France",
    iban: "FR14 2004 1010 0505 0001 3M02 606",
    contractStatus: "active",
    totalBilled: 72000,
    lastInvoiceDate: "2025-11-20",
    lastInvoiceAmount: 1500
  },
  {
    id: "5",
    name: "CloudServices BV",
    country: "Нідерланди",
    countryFlag: "🇳🇱",
    logo: "",
    email: "support@cloudservices.nl",
    phone: "+31 20 794 7000",
    address: "Herengracht 450, 1017 CA Amsterdam, Netherlands",
    iban: "NL91 ABNA 0417 1643 00",
    contractStatus: "pending",
    totalBilled: 43000,
    lastInvoiceDate: "2025-11-10",
    lastInvoiceAmount: 2100
  }
];

export function ClientCRMScreen() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    country: "",
    email: "",
    phone: "",
    address: "",
    iban: ""
  });

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = () => {
    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      country: newClient.country,
      countryFlag: "🌍",
      logo: "",
      email: newClient.email,
      phone: newClient.phone,
      address: newClient.address,
      iban: newClient.iban,
      contractStatus: "pending",
      totalBilled: 0,
      lastInvoiceDate: "-",
      lastInvoiceAmount: 0
    };

    setClients([...clients, client]);
    setShowAddDialog(false);
    setNewClient({
      name: "",
      country: "",
      email: "",
      phone: "",
      address: "",
      iban: ""
    });
  };

  const getStatusBadge = (status: Client["contractStatus"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800">
            Активний
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800">
            Закінчився
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800">
            Очікує
          </Badge>
        );
    }
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="mb-2 text-2xl sm:text-3xl">Клієнти</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Управління клієнтською базою та контрактами
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} size="lg" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Додати клієнта
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Всього клієнтів</p>
                  <p className="text-2xl sm:text-3xl text-blue-600">{clients.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Активні контракти</p>
                  <p className="text-2xl sm:text-3xl text-green-600">
                    {clients.filter((c) => c.contractStatus === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Загальний дохід</p>
                  <p className="text-2xl sm:text-3xl text-purple-600">
                    ${clients.reduce((sum, c) => sum + c.totalBilled, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Шукати клієнта за назвою, країною або email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Clients Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">Клієнт</TableHead>
                  <TableHead className="hidden sm:table-cell">Країна</TableHead>
                  <TableHead>Статус контракту</TableHead>
                  <TableHead className="text-right">Всього виставлено</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Останній рахунок</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={client.logo} alt={client.name} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {client.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{client.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{client.countryFlag}</span>
                        <span className="text-sm">{client.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(client.contractStatus)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${client.totalBilled.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      <div className="text-sm">
                        <p className="font-medium">${client.lastInvoiceAmount.toLocaleString()}</p>
                        <p className="text-muted-foreground text-xs">
                          {client.lastInvoiceDate !== "-"
                            ? new Date(client.lastInvoiceDate).toLocaleDateString("uk-UA")
                            : "-"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-8 sm:p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? `Не знайдено клієнтів за запитом "${searchQuery}"` : "Немає клієнтів"}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Додати нового клієнта</DialogTitle>
            <DialogDescription>
              Заповніть інформацію про клієнта для подальшої роботи
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">
                Назва компанії <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="company-name"
                  placeholder="TechCorp Inc."
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Країна</Label>
              <Input
                id="country"
                placeholder="США, Німеччина, Польща..."
                value={newClient.country}
                onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 0123"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Адреса</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                <Textarea
                  id="address"
                  placeholder="123 Main Street, City, Country"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="pl-10 min-h-[60px]"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="iban"
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                  value={newClient.iban}
                  onChange={(e) => setNewClient({ ...newClient, iban: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Скасувати
            </Button>
            <Button onClick={handleAddClient} disabled={!newClient.name}>
              Додати клієнта
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
