import { useEffect, useState } from "react";
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
import { fetchClients, createClient, type Client } from "../services/clientService";
import { toast } from "sonner";


export function ClientCRMScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    country: "",
    email: "",
    phone: "",
    address: "",
    iban: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити клієнтів");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.country || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async () => {
    if (!newClient.name.trim()) {
      toast.error("Вкажіть назву клієнта");
      return;
    }
    try {
      const created = await createClient({
        name: newClient.name,
        country: newClient.country || undefined,
        email: newClient.email || undefined,
        phone: newClient.phone || undefined,
        iban: newClient.iban || undefined,
        notes: newClient.notes || undefined,
      });
      setClients((prev) => [...prev, created]);
      setShowAddDialog(false);
      setNewClient({
        name: "",
        country: "",
        email: "",
        phone: "",
        address: "",
        iban: "",
        notes: "",
      });
      toast.success("Клієнта додано");
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося додати клієнта");
    }
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="mb-2 text-2xl sm:text-3xl">Клієнти (опційно)</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Модуль для роботи з постійними клієнтами та контрактами. Необов’язково: якщо не ведете клієнтів — можете не користуватися цим розділом.
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
                  <p className="text-sm text-muted-foreground mb-1">Email вказано</p>
                  <p className="text-2xl sm:text-3xl text-green-600">
                    {clients.filter((c) => c.email).length}
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
                  <p className="text-sm text-muted-foreground mb-1">Телефон вказано</p>
                  <p className="text-2xl sm:text-3xl text-purple-600">
                    {clients.filter((c) => c.phone).length}
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
                  <TableHead className="min-w-[220px]">Клієнт</TableHead>
                  <TableHead className="hidden sm:table-cell">Країна</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Телефон</TableHead>
                  <TableHead className="text-right">Нотатки</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" alt={client.name} />
                          <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {client.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{client.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{client.email || "—"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm">{client.country || "—"}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{client.email || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{client.phone || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground max-w-[200px] truncate">
                      {client.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="p-8 sm:p-12 text-center">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium mb-2">
                {searchQuery ? `Не знайдено клієнтів за запитом "${searchQuery}"` : "Ще немає жодного клієнта"}
              </p>
              <p className="text-muted-foreground text-sm">
                Додавайте клієнтів лише якщо працюєте за контрактами, інвойсами або хочете аналітику по замовниках. Для кафе, салонів та роздрібних ФОП цей розділ можна ігнорувати.
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

            <div className="space-y-2">
              <Label htmlFor="notes">Нотатки</Label>
              <Textarea
                id="notes"
                placeholder="Деталі співпраці, контактні особи..."
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                rows={2}
              />
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
