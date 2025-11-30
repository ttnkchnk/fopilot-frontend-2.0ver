import { useState } from "react";
import { Search, BookOpen, Calculator, DollarSign, FileText, HelpCircle, TrendingUp, Users, ArrowRight, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  articleCount: number;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: number;
  views: number;
}

const categories: Category[] = [
  {
    id: "taxes",
    title: "Податки",
    description: "Все про ЄП, ЄСВ та податкову звітність",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
    articleCount: 24
  },
  {
    id: "currency",
    title: "Валюта",
    description: "Робота з іноземною валютою та курсами",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    articleCount: 12
  },
  {
    id: "reports",
    title: "Звітність",
    description: "Декларації, форми та терміни подання",
    icon: FileText,
    color: "from-purple-500 to-purple-600",
    articleCount: 18
  },
  {
    id: "newbie",
    title: "Гід для початківців",
    description: "Перші кроки як ФОП в Україні",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600",
    articleCount: 15
  },
  {
    id: "income",
    title: "Доходи",
    description: "Як правильно враховувати та декларувати",
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600",
    articleCount: 10
  },
  {
    id: "clients",
    title: "Робота з клієнтами",
    description: "Договори, рахунки та первинка",
    icon: Users,
    color: "from-pink-500 to-pink-600",
    articleCount: 14
  }
];

const popularArticles: Article[] = [
  {
    id: "1",
    title: "Як розрахувати єдиний податок для групи 3",
    category: "Податки",
    readTime: 5,
    views: 1243
  },
  {
    id: "2",
    title: "Терміни сплати ЄСВ у 2025 році",
    category: "Податки",
    readTime: 3,
    views: 987
  },
  {
    id: "3",
    title: "Як відкрити валютний рахунок для ФОП",
    category: "Валюта",
    readTime: 7,
    views: 856
  },
  {
    id: "4",
    title: "Покрокова інструкція заповнення декларації",
    category: "Звітність",
    readTime: 10,
    views: 2145
  },
  {
    id: "5",
    title: "Що потрібно знати перед відкриттям ФОП",
    category: "Гід для початківців",
    readTime: 8,
    views: 1789
  },
  {
    id: "6",
    title: "Як виставити рахунок іноземному клієнту",
    category: "Робота з клієнтами",
    readTime: 6,
    views: 654
  }
];

export function KnowledgeBaseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!selectedCategory || article.category === selectedCategory)
  );

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-sky-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl">База знань FOPilot</h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Знайдіть відповіді на найпоширеніші питання про роботу ФОП в Україні
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Шукати відповіді про податки, звітність, валюту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 text-base shadow-lg border-2 focus:border-blue-500 bg-white dark:bg-card"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="mb-4 px-2">Категорії</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500 bg-white dark:bg-card"
                  onClick={() => setSelectedCategory(category.title)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.articleCount} статей
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 group-hover:text-blue-600 transition-colors text-base sm:text-lg">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600"
                    >
                      Переглянути статті
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Popular Articles */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2>
              {selectedCategory ? `Статті: ${selectedCategory}` : "Популярні статті"}
            </h2>
            {selectedCategory && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Скинути фільтр
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-all cursor-pointer border hover:border-blue-500 bg-white dark:bg-card"
                onClick={() => navigate(`/knowledge/${article.id}`)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {article.category}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTime} хв
                            </div>
                            <div className="flex items-center gap-1">
                              <span>👁️</span>
                              {article.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="self-start sm:self-center">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <Card className="bg-white dark:bg-card">
              <CardContent className="p-8 sm:p-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Не знайдено статей за запитом "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Banner */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="mb-2 text-white text-lg sm:text-xl">Не знайшли відповідь?</h3>
                <p className="text-blue-100 text-sm sm:text-base">
                  Запитайте AI-асистента в чаті або зверніться до нашої підтримки
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/chat")}
                className="w-full sm:w-auto"
              >
                Відкрити чат
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}