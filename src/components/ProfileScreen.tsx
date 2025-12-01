import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { User, Moon, Sun, RefreshCw, Phone, ListChecks } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { type User as AppUser, updateCurrentUser } from "../services/userService";
import { toast } from "sonner";
import { fetchStats, type UserStats } from "../services/statsService";

interface ProfileScreenProps {
  user: AppUser | null;
  onUserUpdated?: (user: AppUser) => void;
}

export function ProfileScreen({ user, onUserUpdated }: ProfileScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fopGroup, setFopGroup] = useState<string | number>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const onboardingData = (user?.onboarding_data as any) || null;

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setMiddleName(user.middle_name || "");
      setEmail(user.email);
      setPhone(user.phone || "");
      setFopGroup(user.fop_group ?? "");
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Не вдалося завантажити статистику");
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, []);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Профіль не завантажено
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await updateCurrentUser({
        first_name: firstName || user.first_name,
        last_name: lastName || user.last_name,
        middle_name: middleName || null,
        phone: phone || null,
      });
      onUserUpdated?.(updated);
      toast.success("Профіль оновлено");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося оновити профіль");
    } finally {
      setLoading(false);
    }
  };

  const displayName = useMemo(() => {
    return [firstName, middleName, lastName].filter(Boolean).join(" ").trim();
  }, [firstName, middleName, lastName]);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50/40 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950/20">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="w-16 h-16 md:w-20 md:h-20">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="bg-blue-600 text-white text-xl md:text-2xl">
                  {displayName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
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
                  <Button onClick={handleSave} className="flex-1 sm:flex-none" disabled={loading}>
                    {loading ? "Збереження..." : "Зберегти"}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 sm:flex-none">
                    Скасувати
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Імʼя</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="middleName">По батькові</Label>
              <Input
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                disabled={!isEditing}
                placeholder="Необов'язково"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Прізвище</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                placeholder="+380 XX XXX XX XX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fop-group">Група ФОП</Label>
              <Input
                id="fop-group"
                value={fopGroup}
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Summary */}
        {onboardingData && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle className="text-lg md:text-xl">Дані онбордингу</CardTitle>
                  <CardDescription className="text-sm md:text-base">Збережені відповіді при реєстрації</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Імʼя:</span>
                <span className="font-medium">{onboardingData.firstName || onboardingData.fullName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Прізвище:</span>
                <span className="font-medium">{onboardingData.lastName || "—"}</span>
              </div>
              {onboardingData.middleName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">По батькові:</span>
                  <span className="font-medium">{onboardingData.middleName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{onboardingData.email || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Телефон:</span>
                <span className="font-medium">{onboardingData.phone || user.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ІПН:</span>
                <span className="font-medium">{onboardingData.taxId || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Група ЄП:</span>
                <span className="font-medium">{onboardingData.taxGroup || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ЄСВ сплачую:</span>
                <span className="font-medium">{onboardingData.paysESV ? "Так" : "Ні"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Обрані КВЕД:</span>
                <div className="flex flex-wrap gap-2">
                  {(onboardingData.selectedKveds || []).length === 0 ? (
                    <span className="font-medium">—</span>
                  ) : (
                    onboardingData.selectedKveds.map((code: string) => (
                      <span
                        key={code}
                        className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100 text-xs"
                      >
                        {code}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">
                  {statsLoading ? "…" : stats?.chat_questions ?? 0}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Запитань в чаті</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">
                  {statsLoading ? "…" : stats?.calculations ?? 0}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Розрахунків</p>
              </div>
              <div className="p-3 md:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-1">
                  {statsLoading ? "…" : stats?.days_in_system ?? 0}
                </p>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>Днів в системі</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
