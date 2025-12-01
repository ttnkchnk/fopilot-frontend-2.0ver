import { useState } from "react";
import { Save, Sparkles, FileCheck, AlertCircle, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DigitalSignatureDialog } from "./DigitalSignatureDialog";

interface DeclarationRow {
  code: string;
  label: string;
  value: string;
}

export function DeclarationScreen() {
  const [declarationData, setDeclarationData] = useState<DeclarationRow[]>([
    { code: "01", label: "Прізвище, ім'я, по батькові", value: "" },
    { code: "02", label: "Реєстраційний номер облікової картки платника податків", value: "" },
    { code: "03", label: "Звітний (податковий) період", value: "I квартал 2025" },
    { code: "10", label: "Дохід від провадження господарської діяльності", value: "0.00" },
    { code: "11", label: "Дохід від надання майна в оренду", value: "0.00" },
    { code: "12", label: "Сума отриманого доходу (сумарно)", value: "0.00" },
    { code: "20", label: "Ставка єдиного податку (%)", value: "5" },
    { code: "21", label: "Сума нарахованого єдиного податку", value: "0.00" },
    { code: "30", label: "Єдиний внесок (ЄСВ) за себе", value: "0.00" },
    { code: "31", label: "Єдиний внесок (ЄСВ) за найманих працівників", value: "0.00" },
    { code: "40", label: "Загальна сума до сплати", value: "0.00" }
  ]);

  const [isAIChecking, setIsAIChecking] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [aiCheckResult, setAiCheckResult] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } | null>(null);

  const handleInputChange = (code: string, newValue: string) => {
    setDeclarationData((prev) =>
      prev.map((row) => (row.code === code ? { ...row, value: newValue } : row))
    );
  };

  const handleAICheck = () => {
    setIsAIChecking(true);
    setTimeout(() => {
      setIsAIChecking(false);
      // Simulate AI check with random result
      const hasIssues = Math.random() > 0.5;
      setAiCheckResult({
        isValid: !hasIssues,
        issues: hasIssues
          ? [
              "Сума доходу не співпадає з нарахованим податком",
              "ІПН має містити 10 цифр"
            ]
          : [],
        suggestions: hasIssues
          ? ["Перевірте правильність введених даних", "Скористайтесь калькулятором податків"]
          : ["Всі дані заповнені коректно", "Можете переходити до подання декларації"]
      });
      setShowAIDialog(true);
    }, 2000);
  };

  const handleSaveDraft = () => {
    localStorage.setItem("declaration-draft", JSON.stringify(declarationData));
    alert("Чернетку збережено");
  };

  const isMoneyField = (code: string) => {
    return ["10", "11", "12", "21", "30", "31", "40"].includes(code);
  };

  const navigate = useNavigate();

  return (
    <div className="h-full overflow-auto bg-slate-50 dark:bg-background">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl">Податкова декларація ФОП</h1>
              <Badge variant="outline">Чернетка</Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Декларація платника єдиного податку – фізичної особи – підприємця
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)} className="self-start">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>

        {/* AI Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Використовуйте кнопку "Перевірити з AI" для автоматичної перевірки даних перед поданням
          </AlertDescription>
        </Alert>

        {/* Form Paper */}
        <Card className="bg-white dark:bg-card shadow-lg">
          <div className="p-4 sm:p-8 space-y-6">
            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground border-b pb-2 text-sm sm:text-base">
                Розділ I. Загальні відомості
              </h3>
              {declarationData.slice(0, 3).map((row) => (
                <div key={row.code} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_200px] gap-2 sm:gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">{row.code}</span>
                  </div>
                  <Label className="text-xs sm:text-sm sm:hidden">{row.label}</Label>
                  <Label className="text-sm hidden sm:block">{row.label}</Label>
                  <Input
                    value={row.value}
                    onChange={(e) => handleInputChange(row.code, e.target.value)}
                    className="text-right col-span-2 sm:col-span-1"
                    disabled={row.code === "03"}
                  />
                </div>
              ))}
            </div>

            {/* Income Data */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground border-b pb-2 text-sm sm:text-base">
                Розділ II. Розрахунок доходу
              </h3>
              {declarationData.slice(3, 6).map((row) => (
                <div key={row.code} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_200px] gap-2 sm:gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">{row.code}</span>
                  </div>
                  <Label className="text-xs sm:text-sm sm:hidden">{row.label}</Label>
                  <Label className="text-sm hidden sm:block">{row.label}</Label>
                  <div className="relative col-span-2 sm:col-span-1">
                    <Input
                      type="number"
                      step="0.01"
                      value={row.value}
                      onChange={(e) => handleInputChange(row.code, e.target.value)}
                      className="text-right pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs sm:text-sm">
                      грн
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax Calculation */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground border-b pb-2 text-sm sm:text-base">
                Розділ III. Розрахунок податку та внесків
              </h3>
              {declarationData.slice(6).map((row) => (
                <div key={row.code} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_200px] gap-2 sm:gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shrink-0">
                    <span className="text-xs sm:text-sm text-muted-foreground">{row.code}</span>
                  </div>
                  <Label className="text-xs sm:text-sm sm:hidden">{row.label}</Label>
                  <Label className="text-sm hidden sm:block">{row.label}</Label>
                  <div className="relative col-span-2 sm:col-span-1">
                    <Input
                      type={isMoneyField(row.code) ? "number" : "text"}
                      step="0.01"
                      value={row.value}
                      onChange={(e) => handleInputChange(row.code, e.target.value)}
                      className={`text-right ${isMoneyField(row.code) ? "pr-12" : ""} ${
                        row.code === "40" ? "font-bold" : ""
                      }`}
                    />
                    {isMoneyField(row.code) && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xs sm:text-sm">
                        грн
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-background border-t pt-4 pb-2 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button variant="outline" onClick={handleSaveDraft} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Зберегти чернетку
          </Button>
          <Button variant="outline" onClick={handleAICheck} disabled={isAIChecking} className="w-full sm:w-auto">
            <Sparkles className="w-4 h-4 mr-2" />
            {isAIChecking ? "Перевіряю..." : "Перевірити з AI"}
          </Button>
          <Button onClick={() => setShowSignDialog(true)} className="w-full sm:w-auto">
            <FileCheck className="w-4 h-4 mr-2" />
            Підписати та подати
          </Button>
        </div>
      </div>

      {/* AI Check Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Результат перевірки AI</DialogTitle>
            <DialogDescription>
              Ось результати перевірки вашої декларації AI
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {aiCheckResult?.isValid ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Декларація валідна</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-muted-foreground">Декларація містить помилки</p>
              </div>
            )}
            {aiCheckResult?.issues.map((issue, index) => (
              <div key={index} className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-muted-foreground">{issue}</p>
              </div>
            ))}
            {aiCheckResult?.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowAIDialog(false)}
              className="bg-red-500 hover:bg-red-600"
            >
              Закрити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Digital Signature Dialog */}
      <DigitalSignatureDialog
        open={showSignDialog}
        onOpenChange={setShowSignDialog}
        onSign={() => {
          alert("Декларацію підписано та подано!");
        }}
      />
    </div>
  );
}
