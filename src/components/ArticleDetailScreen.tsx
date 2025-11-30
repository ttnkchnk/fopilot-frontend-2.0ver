import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Eye, Share2, Bookmark, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

export function ArticleDetailScreen() {
  const navigate = useNavigate();

  // Mock article data
  const article = {
    id: "1",
    title: "Як розрахувати єдиний податок для групи 3",
    category: "Податки",
    readTime: 5,
    views: 1243,
    author: "Команда FOPilot",
    publishDate: "2025-11-15",
    content: `
## Вступ

Єдиний податок третьої групи — це спрощена система оподаткування, яка дозволяє фізичним особам-підприємцям сплачувати податок за ставкою 5% від доходу (без ПДВ) або 3% (з ПДВ).

## Основні параметри

### Група 3 (5%)
- Максимальний річний дохід: **7 000 000 грн**
- Ставка податку: **5%** від доходу
- Можливість реєстрації платником ПДВ: **Так**
- Види діяльності: **Будь-які**

## Як розрахувати податок

### Крок 1: Визначте дохід
Дохід — це всі кошти, які ви отримали за надані послуги або продані товари протягом звітного періоду (квартал).

**Приклад:**
- Січень: 100 000 грн
- Лютий: 150 000 грн  
- Березень: 120 000 грн
- **Разом за I квартал: 370 000 грн**

### Крок 2: Розрахуйте єдиний податок
Формула: \`Дохід × 5%\`

**Приклад:**
\`370 000 грн × 5% = 18 500 грн\`

### Крок 3: Додайте ЄСВ
Єдиний соціальний внесок (ЄСВ) обов'язковий для всіх ФОП. Мінімальна сума ЄСВ у 2025 році — **1 760 грн/місяць**.

**За квартал (3 місяці):**
\`1 760 грн × 3 = 5 280 грн\`

### Крок 4: Загальна сума до сплати
\`Єдиний податок + ЄСВ = 18 500 + 5 280 = 23 780 грн\`

## Терміни сплати

- **Єдиний податок:** до 10 числа місяця, що настає за звітним кварталом
- **ЄСВ:** щомісяця до 20 числа

## Важливі нюанси

⚠️ **Увага!** Якщо ваш дохід за рік перевищить 7 млн грн, вам доведеться перейти на загальну систему оподаткування.

💡 **Порада:** Використовуйте калькулятор на сторінці "Податки" в FOPilot для автоматичного розрахунку.

## Приклад розрахунку в FOPilot

1. Перейдіть на сторінку **"Податки"**
2. Введіть ваш дохід за квартал: **370 000 грн**
3. Система автоматично розрахує:
   - Єдиний податок (5%): 18 500 грн
   - ЄСВ (мін.): 5 280 грн
   - **Разом: 23 780 грн**

## Корисні посилання

- [Декларація єдиного податку](/forms/declaration)
- [Календар податкових термінів](/calendar)
- [Калькулятор податків](/taxes)

## Підсумок

Розрахунок єдиного податку для групи 3 — це простий процес:
1. Підсумуйте дохід за квартал
2. Помножте на 5%
3. Додайте ЄСВ (мін. 5 280 грн за квартал)
4. Сплатіть до 10 числа наступного місяця

**Потрібна допомога?** Запитайте AI-асистента в [чаті](/chat)!
    `
  };

  // Table of contents
  const tableOfContents = [
    { id: "intro", title: "Вступ" },
    { id: "params", title: "Основні параметри" },
    { id: "calculate", title: "Як розрахувати податок" },
    { id: "deadlines", title: "Терміни сплати" },
    { id: "nuances", title: "Важливі нюанси" },
    { id: "example", title: "Приклад в FOPilot" },
    { id: "summary", title: "Підсумок" }
  ];

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/knowledge-base")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до бази знань
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_250px] gap-6 p-4 sm:p-6">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Article Header */}
            <div className="space-y-4 mb-8">
              <Badge variant="secondary">{article.category}</Badge>
              
              <h1 className="text-3xl sm:text-4xl">{article.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime} хв читання
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views} переглядів
                </div>
                <div>
                  {new Date(article.publishDate).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
                <div>Автор: {article.author}</div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div 
                className="space-y-6"
                dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .split('\n')
                    .map(line => {
                      if (line.startsWith('## ')) {
                        return `<h2 class="text-2xl mt-8 mb-4">${line.substring(3)}</h2>`;
                      } else if (line.startsWith('### ')) {
                        return `<h3 class="text-xl mt-6 mb-3">${line.substring(4)}</h3>`;
                      } else if (line.startsWith('**') && line.endsWith('**')) {
                        return `<p class="font-semibold mb-2">${line.substring(2, line.length - 2)}</p>`;
                      } else if (line.startsWith('- ')) {
                        return `<li class="ml-4">${line.substring(2)}</li>`;
                      } else if (line.startsWith('⚠️') || line.startsWith('💡')) {
                        return `<div class="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-l-4 border-blue-600 my-4">${line}</div>`;
                      } else if (line.startsWith('\`') && line.endsWith('\`')) {
                        return `<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">${line.substring(1, line.length - 1)}</code>`;
                      } else if (line.trim() === '') {
                        return '<br />';
                      }
                      return `<p class="mb-4">${line}</p>`;
                    })
                    .join('')
                }}
              />
            </div>

            {/* Feedback */}
            <Card className="mt-12 p-6 bg-slate-50 dark:bg-slate-900">
              <div className="text-center space-y-4">
                <p className="text-lg">Чи була ця стаття корисною?</p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" size="lg" className="gap-2">
                    <ThumbsUp className="w-4 h-4" />
                    Так
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <ThumbsUp className="w-4 h-4 rotate-180" />
                    Ні
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <Card className="p-4">
                <h3 className="mb-3 text-sm text-muted-foreground">Зміст статті</h3>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm hover:text-blue-600 transition-colors py-1"
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <h3 className="mb-2">Потрібна допомога?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Запитайте AI-асистента про податки
                </p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate("/chat")}
                >
                  Відкрити чат
                </Button>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
