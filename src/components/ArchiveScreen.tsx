import { useEffect, useMemo, useState } from "react";
import { Archive, Download, Search, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import api from "../lib/api";

type FirestoreTimestamp = { seconds: number; nanoseconds: number };

interface DocumentMeta {
  id: string;
  userId: string;
  type: string;
  fileName: string;
  filePath: string;
  createdAt?: string | FirestoreTimestamp | null;
  year?: number | null;
  quarter?: number | null;
}

const typeLabels: Record<string, string> = {
  declaration: "Декларація",
  invoice: "Інвойс",
  other: "Інше",
};

function formatDate(value?: string | FirestoreTimestamp | null) {
  if (!value) return "-";
  let date: Date | null = null;
  if (typeof value === "string") {
    const parsed = new Date(value);
    date = isNaN(parsed.getTime()) ? null : parsed;
  } else if (typeof value === "object" && typeof value.seconds === "number") {
    date = new Date(value.seconds * 1000);
  }
  if (!date) return "-";
  return date.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ArchiveScreen() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<DocumentMeta[]>("/documents");
      setDocuments(data);
    } catch (error) {
      console.error("Не вдалося завантажити архів документів", error);
      toast.error("Не вдалося завантажити архів документів");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesType = typeFilter === "all" || doc.type === typeFilter;
      const haystack = `${doc.fileName ?? ""} ${doc.type ?? ""} ${doc.year ?? ""} Q${doc.quarter ?? ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase().trim());
      return matchesType && matchesSearch;
    });
  }, [documents, search, typeFilter]);

  const handleDownload = async (doc: DocumentMeta) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Не вдалося завантажити документ", error);
      toast.error("Не вдалося завантажити документ");
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/60 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Card className="bg-card/80 border shadow-sm">
          <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Archive className="w-5 h-5 text-blue-600" />
                Архів документів
              </CardTitle>
              <CardDescription>Усі створені та завантажені документи в одному місці</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadDocuments} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
              <span className="ml-2">Оновити</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Пошук за назвою, типом або періодом"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Тип документу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Усі типи</SelectItem>
                  <SelectItem value="declaration">Декларації</SelectItem>
                  <SelectItem value="invoice">Інвойси</SelectItem>
                  <SelectItem value="other">Інші</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Документи</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Знайдено: {filtered.length} / {documents.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Назва</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Період</TableHead>
                    <TableHead>Створено</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="w-4 h-4 mr-2 inline-block animate-spin" />
                        Завантаження архіву...
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Нічого не знайдено
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.fileName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {typeLabels[doc.type] ?? doc.type ?? "Невідомо"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {doc.year ? `Q${doc.quarter ?? "?"} ${doc.year}` : "-"}
                        </TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="w-4 h-4 mr-2" />
                            Завантажити
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
