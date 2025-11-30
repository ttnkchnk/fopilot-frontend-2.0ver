import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Upload, File, Trash2, Download, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
}

export function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = localStorage.getItem("fopilot-documents");
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    } else {
      // Default sample data
      const defaultDocuments = [
        {
          id: "1",
          name: "Договір_оренди_2024.pdf",
          type: "application/pdf",
          size: 245000,
          uploadDate: new Date().toISOString(),
          category: "Договори",
        },
        {
          id: "2",
          name: "Квитанція_єдиний_податок_Q3.pdf",
          type: "application/pdf",
          size: 125000,
          uploadDate: new Date().toISOString(),
          category: "Податки",
        },
      ];
      setDocuments(defaultDocuments);
      localStorage.setItem("fopilot-documents", JSON.stringify(defaultDocuments));
    }
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

    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toISOString(),
      category: category.trim(),
    };

    const updatedDocuments = [newDocument, ...documents];
    setDocuments(updatedDocuments);
    localStorage.setItem("fopilot-documents", JSON.stringify(updatedDocuments));
    setCategory("");
    
    // Reset file input
    e.target.value = "";
    
    toast.success(`Документ "${file.name}" успішно завантажено`);
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem("fopilot-documents", JSON.stringify(updatedDocuments));
    toast.success("Документ видалено");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="w-5 h-5 text-red-600" />;
    if (type.includes("image")) return <File className="w-5 h-5 text-blue-600" />;
    if (type.includes("word") || type.includes("document")) return <FileText className="w-5 h-5 text-blue-700" />;
    if (type.includes("excel") || type.includes("spreadsheet")) return <FileText className="w-5 h-5 text-green-700" />;
    return <File className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-lg md:text-xl">Документи</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Зберігайте та організовуйте всі важливі документи
          </p>
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
                    onChange={(e) => setCategory(e.target.value)}
                  />
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
              Всього документів: {documents.length}
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
                    <TableHead>Розмір</TableHead>
                    <TableHead>Дата завантаження</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Немає завантажених документів
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getFileIcon(doc.type)}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {doc.name}
                        </TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{formatFileSize(doc.size)}</TableCell>
                        <TableCell>
                          {new Date(doc.uploadDate).toLocaleDateString("uk-UA", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              onClick={() => toast.info("Функція завантаження буде доступна після інтеграції з сервером")}
                            >
                              <Download className="w-4 h-4" />
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
