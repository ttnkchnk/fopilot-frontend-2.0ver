import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Upload, File, Trash2, Download, FileText, ArchiveRestore, Archive } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

interface DocumentMeta {
  id: string;
  userId: string;
  type: string;
  fileName: string;
  filePath: string;
  createdAt?: string;
  year?: number | null;
  quarter?: number | null;
  category?: string | null;
  archived?: boolean;
}

export function DocumentsScreen() {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const suggestedCategories = useMemo(() => {
    const base = ["Договори", "Податки", "Акти", "Квитанції", "Інше"];
    const fromDocs = documents
      .map((d) => d.category)
      .filter((c): c is string => Boolean(c))
      .map((c) => c.trim());
    return Array.from(new Set([...base, ...fromDocs])).filter(Boolean);
  }, [documents]);

  const loadDocuments = async () => {
    try {
      const { data } = await api.get<DocumentMeta[]>("/documents");
      setDocuments(data);
    } catch (error) {
      console.error("Не вдалося отримати документи", error);
      toast.error("Не вдалося завантажити документи");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!category.trim()) {
      toast.error("Вкажіть категорію документа");
      return;
    }

    const file = files[0];

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Файл занадто великий. Максимальний розмір: 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        await api.post("/documents/upload", {
          file_name: file.name,
          pdf_base64: base64,
          type: category.trim(),
          category: category.trim(),
        });
        toast.success(`Документ "${file.name}" успішно завантажено`);
        setCategory("");
        e.target.value = "";
        loadDocuments();
      } catch (error) {
        console.error("Не вдалося завантажити документ", error);
        toast.error("Не вдалося завантажити документ");
      }
    };
    reader.onerror = () => {
      toast.error("Не вдалося прочитати файл");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Документ видалено");
      loadDocuments();
    } catch (error) {
      console.error("Не вдалося видалити", error);
      toast.error("Не вдалося видалити документ");
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-600" />;
    if (type.includes("image")) return <File className="w-5 h-5 text-blue-600" />;
    if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5 text-blue-700" />;
    if (type.includes("excel") || type.includes("spreadsheet")) return <FileText className="w-5 h-5 text-green-700" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  const formatDate = (val?: string) => {
    if (!val) return "-";
    const d = new Date(val);
    return isNaN(d.getTime())
      ? "-"
      : d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesArchive = showArchived ? doc.archived : !doc.archived;
      const haystack = `${doc.fileName} ${doc.category ?? ""} ${doc.type ?? ""}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase().trim());
      return matchesArchive && matchesSearch;
    });
  }, [documents, showArchived, search]);

  const toggleArchive = async (doc: DocumentMeta) => {
    try {
      await api.patch(`/documents/${doc.id}/archive`, { archived: !doc.archived });
      toast.success(doc.archived ? "Повернуто з архіву" : "Переміщено в архів");
      loadDocuments();
    } catch (error) {
      console.error("Не вдалося оновити документ", error);
      toast.error("Не вдалося змінити статус документа");
    }
  };

  const handleDownload = async (doc: DocumentMeta) => {
    try {
      const response = await api.get(`/documents/${doc.id}/download`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Не вдалося скачати документ", error);
      toast.error("Не вдалося скачати документ");
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/60 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl">Документи</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Зберігайте, завантажуйте та архівуйте файли
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Input
              placeholder="Пошук за назвою / категорією"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button
              variant={showArchived ? "default" : "outline"}
              onClick={() => setShowArchived((v) => !v)}
              className="w-full sm:w-auto"
            >
              {showArchived ? <ArchiveRestore className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
              {showArchived ? "Показати активні" : "Показати архів"}
            </Button>
          </div>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Завантажити документ</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Оберіть файл та вкажіть категорію (максимум 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Категорія</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="Договори, Податки, Акти..."
                    value={category}
                    list="category-options"
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  <datalist id="category-options">
                    {suggestedCategories.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Файл</Label>
                  <div className="relative">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <Upload className="w-4 h-4 shrink-0" />
                <span>Підтримувані формати: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Мої документи</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Всього документів: {documents.length} | Показано: {filteredDocs.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Назва</TableHead>
                    <TableHead>Категорія</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата завантаження</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Немає документів
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocs.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getFileIcon(doc.type || "")}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {doc.fileName}
                        </TableCell>
                        <TableCell>{doc.category || doc.type}</TableCell>
                        <TableCell>{doc.archived ? "Архів" : "Активний"}</TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleArchive(doc)}
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            >
                              {doc.archived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
