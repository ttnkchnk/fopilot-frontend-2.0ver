import { useState } from "react";
import { Search, FileText, Calculator, Sparkles, FileSpreadsheet, Receipt } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  hasAI: boolean;
  icon: any;
  route?: string;
}

const templates: FormTemplate[] = [
  {
    id: "quarterly-declaration",
    title: "Квартальна декларація",
    description: "Подання декларації про доходи ФОП за квартал",
    category: "Податкова звітність",
    hasAI: true,
    icon: FileText,
    route: "/forms/declaration"
  },
  {
    id: "invoice",
    title: "Рахунок (Інвойс)",
    description: "Створення рахунку для клієнта",
    category: "Первинні документи",
    hasAI: true,
    icon: Receipt,
    route: "/forms/invoice"
  },
  {
    id: "act",
    title: "Акт виконаних робіт",
    description: "Документ підтвердження виконання послуг",
    category: "Первинні документи",
    hasAI: false,
    icon: FileSpreadsheet
  },
  {
    id: "tax-calculation",
    title: "Розрахунок податків",
    description: "Автоматичний розрахунок ЄП та ЄСВ",
    category: "Податкова звітність",
    hasAI: true,
    icon: Calculator,
    route: "/taxes"
  },
  {
    id: "contract",
    title: "Договір надання послуг",
    description: "Шаблон договору з клієнтом",
    category: "Первинні документи",
    hasAI: true,
    icon: FileText
  },
  {
    id: "closing-docs",
    title: "Закриваючі документи",
    description: "Пакет документів для закриття періоду",
    category: "Первинні документи",
    hasAI: false,
    icon: FileSpreadsheet
  }
];

export function FormsHubScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, FormTemplate[]>);

  const handleTemplateClick = (template: FormTemplate) => {
    if (template.route) {
      navigate(template.route);
    }
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/60 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2 text-2xl sm:text-3xl">Бібліотека бланків</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Готові шаблони документів для ФОП з підтримкою AI
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Шукати бланк..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm sm:text-base"
          />
        </div>

        {/* Templates Grid */}
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                <h2>{category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-blue-500"
                      onClick={() => handleTemplateClick(template)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          {template.hasAI && (
                            <Badge variant="secondary" className="gap-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                              <Sparkles className="w-3 h-3" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="mt-4 group-hover:text-blue-600 transition-colors">{template.title}</CardTitle>
                        <CardDescription className="text-base">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateClick(template);
                          }}
                        >
                          {template.route ? "Відкрити" : "Скоро"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Не знайдено бланків за запитом "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
