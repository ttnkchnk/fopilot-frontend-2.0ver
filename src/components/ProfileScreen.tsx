import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { User, Moon, Sun, RefreshCw } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("Іван Петренко");
  const [email, setEmail] = useState("ivan.petrenko@example.com");
  const [phone, setPhone] = useState("+380 67 123 4567");
  const [fopGroup, setFopGroup] = useState("Третя група");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Тут буде логіка збереження
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-16 h-16 md:w-20 md:h-20">
              <AvatarImage src="" alt={name} />
              <AvatarFallback className="bg-blue-600 text-white text-xl md:text-2xl">
                {name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-lg md:text-xl">Кабінет користувача</h1>
              <p className="text-muted-foreground text-sm md:text-base">Керуйте своїм профілем та налаштуваннями</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <CardTitle className="text-lg md:text-xl">Особиста інформація</CardTitle>
                <CardDescription className="text-sm md:text-base">Основні дані вашого профілю</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full sm:w-auto">
                  Редагувати
                </Button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={handleSave} className="flex-1 sm:flex-none">Зберегти</Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 sm:flex-none">
                    Скасувати
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Повне ім'я</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fop-group">Група ФОП</Label>
              <Input
                id="fop-group"
                value={fopGroup}
                onChange={(e) => setFopGroup(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Налаштування</CardTitle>
            <CardDescription className="text-sm md:text-base">Персоналізуйте свій досвід</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-blue-600 shrink-0" />
                ) : (
                  <Sun className="w-5 h-5 text-blue-600 shrink-0" />
                )}
                <div>
                  <p className="text-sm md:text-base">Темна тема</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                    {theme === "dark" ? "Активна" : "Неактивна"}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm md:text-base">Тип облікового запису</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                    Фізична особа-підприємець
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm md:text-base">Пройти онбординг знову</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                    Скинути початкові налаштування
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  localStorage.removeItem("fopilot-onboarding-completed");
                  window.location.reload();
                }}
              >
                Скинути
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Статистика</CardTitle>
            <CardDescription className="text-sm md:text-base">Ваша активність в додатку</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">24</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Запитань в чаті</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">8</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Розрахунків</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">12</p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Днів в системі</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}